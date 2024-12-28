import { Booking } from "../interfaces/booking.interface";
import bookingModel from "../models/booking.model";

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
    try {
      const newBooking = new bookingModel(booking);
      const savedBooking = await newBooking.save();
      return savedBooking;
    } catch (error) {
      throw new Error(`Error al crear reserva: ${(error as Error).message}`);
    }
  }

  async updateBooking(id: any, booking: Booking): Promise<any> {
    try {
      const booking = await bookingModel.findById(id);
      if (!booking) throw new Error("Booking not found");
      const updatedBooking = await bookingModel.findByIdAndUpdate(id, booking, {
        new: true,
      });
      return { data: updatedBooking, msg: "Reserva actualizada" };
    } catch (error) {
      throw new Error(
        `Error al actualizar reserva: ${(error as Error).message}`
      );
    }
  }

  async deleteBooking(id: any): Promise<any> {
    try {
      const booking = await bookingModel.findByIdAndDelete(id);
      if (!booking) throw new Error(`No se encontró la reserva con ID ${id}`);
      return { msg: "Reserva eliminada" };
    } catch (error) {
      throw new Error(`Error al eliminar reserva: ${(error as Error).message}`);
    }
  }
}

export default BookingService;
