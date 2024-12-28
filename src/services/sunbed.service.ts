import { Sunbed } from "../interfaces/sunbed.interface";
import SunbedModel from "../models/sunbeds.model";

class SunbedService {
  async getAllSunbeds(): Promise<Sunbed[]> {
    try {
      const sunbeds = await SunbedModel.find();
      if (!sunbeds) throw new Error("No sunbeds found");
      return sunbeds;
    } catch (error) {
      throw new Error(`Error al obtener sunbeds: ${(error as Error).message}`);
    }
  }

  async getSunbed(id: any): Promise<Sunbed> {
    try {
      const sunbed = await SunbedModel.findById(id);
      if (!sunbed) throw new Error("Sunbed not found");
      return sunbed;
    } catch (error) {
      throw new Error(`Error al obtener sunbeds: ${(error as Error).message}`);
    }
  }

  async createSunbed(sunbed: Sunbed): Promise<any> {
    try {
      const newSunbed = new SunbedModel(sunbed);
      const savedSunbed = await newSunbed.save();
      return savedSunbed;
    } catch (error) {
      throw new Error(`Error al obtener sunbeds: ${(error as Error).message}`);
    }
  }

  async updateSunbed(id: any, sunbed: Sunbed): Promise<any> {
    try {
      const sunbed = await SunbedModel.findById(id);
      if (!sunbed) throw new Error("Sunbed not found");
      const updatedSunbed = await SunbedModel.findByIdAndUpdate(id, sunbed, {
        new: true,
      });
      return { data: updatedSunbed, msg: "Sunbed updated" };
    } catch (error) {
      throw new Error(`Error al obtener sunbeds: ${(error as Error).message}`);
    }
  }

  async deleteSunbed(id: any): Promise<any> {
    try {
      const sunbed = await SunbedModel.findByIdAndDelete(id);
      if (!sunbed) throw new Error(`No sunbed found with ID ${id}`);
      return { msg: "Sunbed deleted" };
    } catch (error) {
      throw new Error(`Error al obtener sunbeds: ${(error as Error).message}`);
    }
  }
}
export default SunbedService;