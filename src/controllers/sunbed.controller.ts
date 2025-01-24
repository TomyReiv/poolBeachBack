import { Request, Response } from "express";
import { httpResponse } from "../utils/enumsError";
import { Sunbed } from "../interfaces/sunbed.interface";
import SunbedService from "../services/sunbed.service";

const HttpResponse = new httpResponse();
const sunbedService = new SunbedService();

class SunbedController {
  async getSunbeds(req: Request, res: Response) {
    try {
      const date =
        req.query.date && !isNaN(new Date(req.query.date as string).getTime())
          ? new Date(req.query.date as string)
          : new Date();

      const isoDate = date.toISOString();
      console.log(isoDate);
      
      const sunbeds = await sunbedService.getAllSunbeds(isoDate);
      if (!sunbeds)
        return HttpResponse.DATA_BASE_ERROR(res, "Tumbonas no encontradas");
      return HttpResponse.OK(res, sunbeds);
    } catch (error) {
      return HttpResponse.Error(res, (error as Error).message);
    }
  }

  async getSunbed(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const sunbed = await sunbedService.getSunbed(id);
      if (!sunbed)
        return HttpResponse.DATA_BASE_ERROR(res, "Tumbona no encontrada");
      return HttpResponse.OK(res, sunbed);
    } catch (error) {
      return HttpResponse.Error(res, (error as Error).message);
    }
  }

  async createSunbed(req: Request, res: Response) {
    try {
      const sunbed: Sunbed = req.body as Sunbed;
      const newSunbed = await sunbedService.createSunbed(sunbed);
      return HttpResponse.OK(res, newSunbed);
    } catch (error) {
      return HttpResponse.Error(res, (error as Error).message);
    }
  }

  async updateSunbed(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const sunbed: Sunbed = req.body as Sunbed;
      const updatedSunbed = await sunbedService.updateSunbed(id, sunbed);
      if (!updatedSunbed)
        return HttpResponse.DATA_BASE_ERROR(res, "Tumbona no encontrada");
      return HttpResponse.OK(res, updatedSunbed.msg);
    } catch (error) {
      return HttpResponse.Error(res, (error as Error).message);
    }
  }

  async deleteSunbed(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deletedSunbed = await sunbedService.deleteSunbed(id);
      if (!deletedSunbed)
        return HttpResponse.DATA_BASE_ERROR(res, "Tumbona no encontrada");
      return HttpResponse.OK(res, deletedSunbed.msg);
    } catch (error) {
      return HttpResponse.Error(res, (error as Error).message);
    }
  }
}

export default SunbedController;
