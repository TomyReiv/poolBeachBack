import { Schema, model, SchemaTypes } from "mongoose";
import { User } from "../interfaces/user.interface";

const userSchema = new Schema<User>({
  name: {
    type: SchemaTypes.String,
    required: true,
  },
  email: {
    type: SchemaTypes.String,
    required: true,
    unique: true,
  },
  password: {
    type: SchemaTypes.String,
    required: true,
  },
  status:{
    type: SchemaTypes.String,
    enum: ['active', 'inactive'],
  },
  role: {
    type: SchemaTypes.String,
    enum: ["user", "admin"],
    default: "user",
  },
  bookings: [
    {
      type: SchemaTypes.ObjectId,
      ref: "Booking",
    },
    ],
  createdAt: {
    type: SchemaTypes.Date,
    default: Date.now,
  },
  updatedAt: {
    type: SchemaTypes.Date,
    default: Date.now,
  },
});
export default model("User", userSchema);