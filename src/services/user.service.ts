import UserDTO from "../dto/user.dto";
import { User } from "../interfaces/user.interface";
import userModel from "../models/user.model";

class UserService {
  async getAllUsers(): Promise<UserDTO[]> {
    try {
      const user = await userModel.find().populate("Booking");
      if (!user) throw new Error("Users not found");
      return user.map((user) => new UserDTO(user));
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${(error as Error).message}`);
    }
  }

  async getOneUser(id: any): Promise<UserDTO> {
    try {
      const user = await userModel.findById(id).populate("Booking");
      if (!user) throw new Error("User not found");
      return new UserDTO(user.toObject());
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${(error as Error).message}`);
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await userModel.findOne({ email }).populate("Booking");
      if (!user) throw new Error("User not found");
      return user;
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${(error as Error).message}`);
    }
  }

  async createUser(user: User): Promise<any> {
    try {
      const newUser = new userModel(user);
      const savedUser = await newUser.save();
      return savedUser;
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${(error as Error).message}`);
    }
  }

  async updateUser(id: any, user: User): Promise<any> {
    try {
      const user = await userModel.findById(id);
      if (!user) throw new Error("User not found");
      const updatedUser = await userModel.findByIdAndUpdate(id, user, {
        new: true,
      });
      return { data: updatedUser, msg: "Usuario actualizado" };
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${(error as Error).message}`);
    }
  }

  async deleteUser(id: any): Promise<any> {
    try {
      const user = await userModel.findByIdAndDelete(id);
      if (!user) throw new Error(`No se encontró el usuario con ID ${id}`);
      return { msg: "Usuario eliminado" };
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${(error as Error).message}`);
    }
  }
}

export default UserService;
