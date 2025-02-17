import { Schema, model, SchemaTypes } from "mongoose";
import { Booking } from "../interfaces/booking.interface";

const reservSubSchema = new Schema(
  {
    name: {
      type: SchemaTypes.String,
      required: true,
    },
    amount: {
      type: SchemaTypes.Number,
      required: true,
      default: 1,
    },
  },
  { _id: false }
);

const bookingSchema = new Schema<Booking>({
  email: {
    type: SchemaTypes.String,
  },
  name: {
    type: SchemaTypes.String,
  },
  type: [reservSubSchema],
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
