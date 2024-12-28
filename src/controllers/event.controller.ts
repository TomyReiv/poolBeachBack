import { Request, Response } from "express";
import { httpResponse } from "../utils/enumsError";
import { Event } from "../interfaces/event.interface";
import EventService from "../services/event.service";

const HttpResponse = new httpResponse();
const eventService = new EventService();

class EventController {
  async getEvents(req: Request, res: Response) {
    try {
      const events = await eventService.getAllEvents();
      if (!events)
        return HttpResponse.DATA_BASE_ERROR(res, "Eventos no encontrados");
      return HttpResponse.OK(res, events);
    } catch (error) {
      return HttpResponse.Error(res, (error as Error).message);
    }
  }

  async getEvent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const event = await eventService.getEvent(id);
      if (!event)
        return HttpResponse.DATA_BASE_ERROR(res, "Evento no encontrado");
      return HttpResponse.OK(res, event);
    } catch (error) {
      return HttpResponse.Error(res, (error as Error).message);
    }
  }

  async createEvent(req: Request, res: Response) {
    try {
      const event: Event = req.body as Event;
      const image = req.file;
      if (!image) return HttpResponse.BAD_REQUEST_ERROR(res, "Imagen requerida");
      const newEvent = await eventService.createEvent(event, image);
      return HttpResponse.OK(res, newEvent);
    } catch (error) {
      return HttpResponse.Error(res, (error as Error).message);
    }
  }

  async updateEvent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const event: Event = req.body;
      const updatedEvent = await eventService.updateEvent(id, event);
      if (!updatedEvent)
        return HttpResponse.DATA_BASE_ERROR(res, "Evento no encontrado");
      return HttpResponse.OK(res, updatedEvent.msg);
    } catch (error) {
      return HttpResponse.Error(res, (error as Error).message);
    }
  }

  async deleteEvent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deletedEvent = await eventService.deleteEvent(id);
      if (!deletedEvent)
        return HttpResponse.DATA_BASE_ERROR(res, "Evento no encontrado");
      return HttpResponse.OK(res, deletedEvent);
    } catch (error) {
      return HttpResponse.Error(res, (error as Error).message);
    }
  }
}

export default EventController;
