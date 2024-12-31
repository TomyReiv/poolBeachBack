import mongoose from "mongoose";
import { Booking } from "../interfaces/booking.interface";
import bookingModel from "../models/booking.model";
import userModel from "../models/user.model";

class BookingService {
  async getAllBookings(): Promise<Booking[]> {
    try {
      const booking = await bookingModel.find().populate("User");
      if (!booking) throw new Error("Bookings not found");
      return booking;
    } catch (error) {
      throw new Error(`Error al obtener reservas: ${(error as Error).message}`);
    }
  }

  async getBooking(id: any): Promise<Booking> {
    try {
      const booking = await bookingModel.findById(id).populate("User");
      if (!booking) throw new Error("Booking not found");
      return booking;
    } catch (error) {
      throw new Error(`Error al obtener reserva: ${(error as Error).message}`);
    }
  }

  async createBooking(booking: Booking): Promise<any> {
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
  }

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
      const booking = await bookingModel.findByIdAndDelete(id, { session });
      if (!booking) throw new Error(`No se encontró la reserva con ID ${id}`);
      await session.commitTransaction();
      return { msg: "Reserva eliminada" };
    } catch (error) {
      await session.abortTransaction();
      throw new Error(`Error al eliminar reserva: ${(error as Error).message}`);
    } finally {
      session.endSession();
    }
  }
}

export default BookingService;
