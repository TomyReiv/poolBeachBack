import { Schema, model, SchemaTypes } from "mongoose";
import { Event } from "../interfaces/event.interface";

const eventSchema = new Schema<Event>({
  title: {
    type: SchemaTypes.String,
    required: true,
  },
  description: {
    type: SchemaTypes.String,
    required: true,
  },
  menu: {
    type: SchemaTypes.String,
    required: true,
  },
  price: {
    type: SchemaTypes.Number,
    required: true,
  },
  image: {
    type: SchemaTypes.String,
    required: true,
  },
  date: {
    type: SchemaTypes.Date,
    required: true,
  },
  status: {
    type: SchemaTypes.String,
    enum: ["active", "inactive"],
    default: "active",
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

export default model("Event", eventSchema);
