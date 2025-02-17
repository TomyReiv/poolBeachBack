import { Document, /* ObjectId */ } from "mongoose";

interface ReservSubSchema {
  name: string;
  amount: number;
}
/* Cambie user por email y cambie ObjectId por string */
export interface Booking extends Document {
  id: string;
  email: string;
  name: string;
  type?: ReservSubSchema[];
  amount?: number;
  date: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}