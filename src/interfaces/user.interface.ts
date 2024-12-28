import { Document, ObjectId } from "mongoose";

export interface User extends Document {
  id: ObjectId;
  name: string;
  email: string;
  password: string;
  status: string;
  role: string;
  bookings: string[];
  createdAt: Date;
  updatedAt: Date;
}
