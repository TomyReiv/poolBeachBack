import { ObjectId } from "mongoose";
import { User } from "../interfaces/user.interface";

export default class UserDTO {
  id: ObjectId;
  name: string;
  email: string;
  status: string;
  rol: string;

  constructor(user: User){
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.status = user.status;
    this.rol = user.role;
  }
}