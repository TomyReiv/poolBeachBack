import { Request, Response } from "express";
import { httpResponse } from "../utils/enumsError";
import { Booking } from "../interfaces/booking.interface";
import BookingService from "../services/booking.service";
import Stripe from "stripe";
import { URL } from "../utils/constant";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-12-18.acacia",
}); 

const HttpResponse = new httpResponse();

const bookingService = new BookingService();

class bookingController {
  async getBookings(req: Request, res: Response) {
    try {
      const bookings = await bookingService.getAllBookings();
      if (!bookings)
        return HttpResponse.DATA_BASE_ERROR(res, "Reservas no encontradas");
      return HttpResponse.OK(res, bookings);
    } catch (error) {
      return HttpResponse.Error(res, (error as Error).message);
    }
  }

  async getBooking(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const booking = await bookingService.getBooking(id);
      if (!booking)
        return HttpResponse.DATA_BASE_ERROR(res, "Reserva no encontrada");
      return HttpResponse.OK(res, booking);
    } catch (error) {
      return HttpResponse.Error(res, (error as Error).message);
    }
  }

  /*   async createBooking(req: Request, res: Response) {
    try {
      const booking: Booking = req.body as Booking;
      const newBooking = await bookingService.createBooking(booking);
      return HttpResponse.OK(res, newBooking);
    } catch (error) {
      return HttpResponse.Error(res, (error as Error).message);
    }
  } */

  async createBooking(req: Request, res: Response) {
    const session = await bookingService.initiateSession();
    try {
      const { sunbeds, totalPrice, email, date, name } = req.body;
      /* Se cambio userid por email */
      if (!sunbeds || !totalPrice || !email || !date || !name) {
        throw new Error(
          "Missing required data (sunbeds, totalPrice, email or date)"
        );
      }
      // Mark selected sunbeds as 'processing'
      await bookingService.markSunbedsAsProcessing(date, sunbeds, session);
      console.log("Sunbeds marked as processing");
      
      // Create the Stripe session
      const stripeSession = await bookingService.createStripeSession(
        sunbeds,
        totalPrice,
        email,
        name,
        date
      );
      await session.commitTransaction();
      session.endSession();

      // Respond with Stripe session URL
      return HttpResponse.OK(res, { sessionUrl: stripeSession.url });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      await bookingService.releaseProcessingSunbeds(req.body.date, req.body.sunbeds);
      return HttpResponse.Error(res, (error as Error).message);
    }
  }

  async updateBooking(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const booking: Booking = req.body as Booking;
      const updatedBooking = await bookingService.updateBooking(id, booking);
      if (!updatedBooking)
        return HttpResponse.DATA_BASE_ERROR(res, "Reserva no encontrada");
      return HttpResponse.OK(res, updatedBooking.msg);
    } catch (error) {
      return HttpResponse.Error(res, (error as Error).message);
    }
  }

  async deleteBooking(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deletedBooking = await bookingService.deleteBooking(id);
      if (!deletedBooking)
        return HttpResponse.DATA_BASE_ERROR(res, "Reserva no encontrada");
      return HttpResponse.OK(res, deletedBooking);
    } catch (error) {
      return HttpResponse.Error(res, (error as Error).message);
    }
  }

  async cancelBooking(req: Request, res: Response) {
    try {
      const sessionId = req.query.session_id as string;
      
      if (!sessionId) {
        return res.status(400).send("Falta session_id");
      }
  
      // Consultar el estado de la sesión en Stripe
      const session = await stripe.checkout.sessions.retrieve(sessionId);
  
      if (session.payment_status !== "paid") {
        // Si no está pagado, liberar los sunbeds reservados
        const sunbeds = JSON.parse(session!.metadata!.sunbeds);
        const date = new Date(session!.metadata!.date);
        await bookingService.releaseProcessingSunbeds(date, sunbeds);
        console.log("Reserva liberada por cancelación.");
      }
  
      res.redirect(`${URL}/Reserva`); // Redirigir al frontend para mostrar el mensaje
    } catch (error) {
      console.error("Error en cancel:", error);
      res.status(500).send("Error al procesar cancelación");
    }
  }
}

export default bookingController;
