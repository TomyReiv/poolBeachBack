import { Request, Response } from "express";
import { httpResponse } from "../utils/enumsError";
import { Booking } from "../interfaces/booking.interface";
import BookingService from "../services/booking.service";

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
      const { sunbeds, totalPrice, userId, date } = req.body;

      if (!sunbeds || !totalPrice || !userId || !date) {
        throw new Error(
          "Missing required data (sunbeds, totalPrice, userId or date)"
        );
      }
      console.log('date en cotroller', date);
      // Mark selected sunbeds as 'processing'
      await bookingService.markSunbedsAsProcessing(date, sunbeds, session);

      // Create the Stripe session
      const stripeSession = await bookingService.createStripeSession(
        sunbeds,
        totalPrice,
        userId,
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
}

export default bookingController;
