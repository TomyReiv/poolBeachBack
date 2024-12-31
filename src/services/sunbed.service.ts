import mongoose from "mongoose";
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
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const newSunbed = new SunbedModel(sunbed);
      const savedSunbed = await newSunbed.save({ session });
      await session.commitTransaction();
      return savedSunbed;
    } catch (error) {
      await session.abortTransaction();
      throw new Error(`Error al obtener sunbeds: ${(error as Error).message}`);
    }finally {
      session.endSession();
    }
  }

  async updateSunbed(id: any, sunbed: Sunbed): Promise<any> {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const sunbed = await SunbedModel.findById(id);
      if (!sunbed) throw new Error("Sunbed not found");
      const updatedSunbed = await SunbedModel.findByIdAndUpdate(id, sunbed, {
        new: true,
        session,
      });
      await session.commitTransaction();
      return { data: updatedSunbed, msg: "Sunbed updated" };
    } catch (error) {
      await session.abortTransaction();
      throw new Error(`Error al obtener sunbeds: ${(error as Error).message}`);
    } finally {
      session.endSession();
    }
  }

  async deleteSunbed(id: any): Promise<any> {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const sunbed = await SunbedModel.findByIdAndDelete(id, { session });
      if (!sunbed) throw new Error(`No sunbed found with ID ${id}`);
      await session.commitTransaction();
      return { msg: "Sunbed deleted" };
    } catch (error) {
      await session.abortTransaction();
      throw new Error(`Error al obtener sunbeds: ${(error as Error).message}`);
    } finally {
      session.endSession();
    }
  }
}
export default SunbedService;
