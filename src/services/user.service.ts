import mongoose from "mongoose";
import UserDTO from "../dto/user.dto";
import { User } from "../interfaces/user.interface";
import userModel from "../models/user.model";

class UserService {
  async getAllUsers(): Promise<UserDTO[]> {
    try {
      const user = await userModel.find().populate({
        path: "bookings",
        model: "Booking",
        options: { strictPopulate: false }, // En caso de errores
      });
      if (!user) throw new Error("Users not found");
      return user.map((user) => new UserDTO(user));
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${(error as Error).message}`);
    }
  }

  async getOneUser(id: any): Promise<UserDTO> {
    try {
      const user = await userModel.findById(id).populate({
        path: "bookings",
        model: "Booking",
        options: { strictPopulate: false }, // En caso de errores
      });
      if (!user) throw new Error("User not found");
      return new UserDTO(user.toObject());
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${(error as Error).message}`);
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await userModel.findOne({ email }).populate({
        path: "bookings",
        model: "Booking",
        options: { strictPopulate: false }, // En caso de errores
      });
      if (!user) throw new Error("User not found");
      return user;
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${(error as Error).message}`);
    }
  }

  async createUser(user: User): Promise<any> {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const newUser = new userModel(user);
      const savedUser = await newUser.save({ session });
      await session.commitTransaction();
      session.endSession();
      return savedUser;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new Error(`Error al obtener usuarios: ${(error as Error).message}`);
    }
  }

  async updateUser(id: any, user: User): Promise<any> {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const user = await userModel.findById(id);
      if (!user) throw new Error("User not found");
      const updatedUser = await userModel.findByIdAndUpdate(id, user, {
        new: true,
        session,
      });
      await session.commitTransaction();
      session.endSession();
      return { data: updatedUser, msg: "Usuario actualizado" };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new Error(`Error al obtener usuarios: ${(error as Error).message}`);
    }
  }

  async deleteUser(id: any): Promise<any> {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const user = await userModel.findByIdAndDelete(id, { session });
      if (!user) throw new Error(`No se encontró el usuario con ID ${id}`);
      await session.commitTransaction();
      return { msg: "Usuario eliminado" };
    } catch (error) {
      await session.abortTransaction();
      throw new Error(`Error al obtener usuarios: ${(error as Error).message}`);
    } finally {
      session.endSession();
    }
  }
}

export default UserService;
