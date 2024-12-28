import { Document, ObjectId } from "mongoose";

export interface Booking extends Document {
  id: string;
  user: ObjectId
  type: ObjectId;
  price: number;
  amount: number;
  date: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}