import { Schema, model, SchemaTypes } from "mongoose";
import { Booking } from "../interfaces/booking.interface";

const bookingSchema = new Schema<Booking>({
  user: {
    type: SchemaTypes.ObjectId,
    ref: "User",
  },
  type: {
    type: SchemaTypes.ObjectId,
    ref: "Sunbed",
  },
  date: {
    type: SchemaTypes.Date,
    default: Date.now,
  },
  amount: {
    type: SchemaTypes.Number,
    required: true,
  },
  status: {
    type: SchemaTypes.String,
    enum: ["pending", "paid", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: SchemaTypes.Date,
    default: Date.now,
  },
  updatedAt: {
    type: SchemaTypes.Date,
    default: Date.now,
  },
});

export default model("Booking", bookingSchema);
