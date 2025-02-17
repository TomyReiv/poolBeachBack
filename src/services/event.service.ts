import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.config";
import { Event } from "../interfaces/event.interface";
import eventsModel from "../models/events.model";

class EventService {
  async getAllEvents(): Promise<Event[]> {
    try {
      const events = await eventsModel.find();
      if (!events) throw new Error("No events found");
      return events;
    } catch (error) {
      throw new Error(`Error al obtener eventos: ${(error as Error).message}`);
    }
  }

  async getEvent(id: any): Promise<Event> {
    try {
      const event = await eventsModel.findById(id);
      if (!event) throw new Error("Event not found");
      return event;
    } catch (error) {
      throw new Error(`Error al obtener evento: ${(error as Error).message}`);
    }
  }

  async createEvent(event: Event, image: any): Promise<any> {
    const session = await mongoose.startSession();
    try {

      session.startTransaction();
      const imageStore = await cloudinary.uploader.upload(image.path, {
        resource_type: "image",
        folder: `Tracks/Singles`,
      });

      if (imageStore) {
        event.image = (imageStore as any).secure_url;
      }
      
      const newEvent = new eventsModel(event);
      const savedEvent = await newEvent.save({ session });
      await session.commitTransaction();
      return savedEvent;
    } catch (error) {
      await session.abortTransaction();
      throw new Error(`Error al crear evento: ${(error as Error).message}`);
    } finally {
      session.endSession();
    }
  }

  async updateEvent(id: any, event: Event): Promise<any> {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const event = await eventsModel.findById(id);
      if (!event) throw new Error("Event not found");
      const updatedEvent = await eventsModel.findByIdAndUpdate(id, event, {
        new: true,
        session,
      });
      await session.commitTransaction();
      return { data: updatedEvent, msg: "Evento actualizado" };
    } catch (error) {
      await session.abortTransaction();
      throw new Error(
        `Error al actualizar evento: ${(error as Error).message}`
      );
    } finally {
      session.endSession();
    }
  }

  async deleteEvent(id: any): Promise<any> {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const event = await eventsModel.findByIdAndDelete(id, { session });
      if (!event) throw new Error(`No se encontró el evento con ID ${id}`);
      await session.commitTransaction();
      return { msg: "Evento eliminado" };
    } catch (error) {
      await session.abortTransaction();
      throw new Error(`Error al eliminar evento: ${(error as Error).message}`);
    } finally {
      session.endSession();
    }
  }
}

export default EventService;
