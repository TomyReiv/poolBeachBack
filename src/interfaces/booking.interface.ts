import { Document, ObjectId } from "mongoose";

interface ReservSubSchema {
  sundbed: string;
  amount: number;
}

export interface Booking extends Document {
  id: string;
  user: ObjectId
  type?: ReservSubSchema[];
  amount?: number;
  date: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}