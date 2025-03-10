import { Booking } from "../interfaces/booking.interface";
import bookingModel from "../models/booking.model";
/* import userModel from "../models/user.model"; */ //No estoy usando el user todavia
import Stripe from "stripe";
import mongoose, { ClientSession } from "mongoose";
import sunbedsModel from "../models/sunbeds.model";
import { URL, URL_BACK } from "../utils/constant";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-12-18.acacia",
});

class BookingService {
  async getAllBookings(): Promise<Booking[]> {
    try {
      const booking = await bookingModel.find(); /* .populate("user") */
      if (!booking) throw new Error("Bookings not found");
      return booking;
    } catch (error) {
      throw new Error(`Error al obtener reservas: ${(error as Error).message}`);
    }
  }

  async getBooking(id: any): Promise<Booking> {
    try {
      const booking = await bookingModel.findById(id); /* .populate("user") */
      if (!booking) throw new Error("Booking not found");
      return booking;
    } catch (error) {
      throw new Error(`Error al obtener reserva: ${(error as Error).message}`);
    }
  }

  /* No se usa el user */

  /*   async createBooking(booking: Booking): Promise<any> {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      // Verificar si el usuario existe dentro de la transacción
      const user = await userModel.findById(booking.user).session(session);
      if (!user) throw new Error("User not found");

      // Crear y guardar la reserva con la sesión activa
      const newBooking = new bookingModel(booking);
      const savedBooking = await newBooking.save({ session });

      // Actualizar el usuario con la nueva reserva
      await userModel.findByIdAndUpdate(
        booking.user,
        { $push: { bookings: savedBooking._id } },
        { new: true, session }
      );

      await session.commitTransaction();

      return savedBooking;
    } catch (error) {
      await session.abortTransaction();
      throw new Error(`Error al crear reserva: ${(error as Error).message}`);
    } finally {
      session.endSession();
    }
  } */

  async updateBooking(id: any, booking: Booking): Promise<any> {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const booking = await bookingModel.findById(id);
      if (!booking) throw new Error("Booking not found");
      const updatedBooking = await bookingModel.findByIdAndUpdate(id, booking, {
        new: true,
        session,
      });
      await session.commitTransaction();
      return { data: updatedBooking, msg: "Reserva actualizada" };
    } catch (error) {
      await session.abortTransaction();
      throw new Error(
        `Error al actualizar reserva: ${(error as Error).message}`
      );
    } finally {
      session.endSession();
    }
  }

  async deleteBooking(id: any): Promise<any> {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const bookingById = await bookingModel.findById(id);
      const booking = await bookingModel.findByIdAndDelete(id, { session });
      if (!booking) throw new Error(`No se encontró la reserva con ID ${id}`);
      if (bookingById) {
        this.releaseProcessingSunbeds(bookingById.date, bookingById.type);
        console.log("Sunbeds released");
        
      }

      await session.commitTransaction();
      return { msg: "Reserva eliminada" };
    } catch (error) {
      await session.abortTransaction();
      throw new Error(`Error al eliminar reserva: ${(error as Error).message}`);
    } finally {
      session.endSession();
    }
  }

  // Método para crear una sesión de pago con Stripe

  async initiateSession(): Promise<ClientSession> {
    const session = await mongoose.startSession();
    session.startTransaction();
    return session;
  }

  async createStripeSession(
    /* Cambie userId por email */
    sunbeds: { name: string; amount: number }[],
    totalPrice: number,
    email: string,
    name: string,
    date: Date
  ) {
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            product_data: {
              name: "Pool Sunbed Booking",
              description: `Reservation for sunbeds`,
            },
            unit_amount: totalPrice * 100, // Stripe accepts amounts in cents
          },
        },
      ],
      metadata: {
        sunbeds: JSON.stringify(sunbeds),
        date: new Date(date).toISOString(),
        totalPrice,
        name,
        email,
      },
      success_url: `${URL}/Reserva`,
      cancel_url: `${URL_BACK}/api/booking/cancel?session_id={CHECKOUT_SESSION_ID}`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutos
    });
    return stripeSession;
  }

  async markSunbedsAsProcessing(
    date: Date,
    types: { name: string; amount: number }[],
    session: ClientSession
  ): Promise<void> {
    const dateSercah = new Date(date).toISOString();

    for (const type of types) {
      const result = await sunbedsModel.updateOne(
        {
          date: dateSercah, // Fecha específica
          "entries.name": type.name,
          "entries.amount": { $gte: type.amount }, // Asegura suficiente stock
        },
        {
          $inc: { "entries.$.amount": -type.amount }, // Resta la cantidad deseada
          $set: { updatedAt: new Date() }, // Marca actualización de tiempo
        },
        { session } // Usamos una sesión (transacción)
      );

      if (result.modifiedCount === 0) {
        throw new Error(
          `No hay suficientes entradas para '${type.name}' en la fecha especificada.`
        );
      }
    }
  }

  /**
   * Reversa las entradas en caso de error durante la transacción de compra.
   */
  async releaseProcessingSunbeds(date: Date, types: any): Promise<void> {
    const dateSercah = new Date(date).toISOString();
    for (const type of types) {
      await sunbedsModel.updateOne(
        {
          date: dateSercah, // Fecha específica
          "entries.name": type.name,
        },
        {
          $inc: { "entries.$.amount": type.amount }, // Reversa la cantidad
          $set: { updatedAt: new Date() }, // Marca actualización de tiempo
        }
      );
    }
  }

  async finalizeBooking(data: any): Promise<any> {
    const email = data.email;
    const date = data.date;
    const name = data.name;

    const booking = new bookingModel({
      email: email,
      name: name,
      type: data.type,
      amount: data.totalPrice!,
      status: "paid",
      date,
    });
    await booking.save();

    return booking;
  }
}

export default BookingService;
