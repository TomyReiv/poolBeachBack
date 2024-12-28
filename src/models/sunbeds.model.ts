import { Schema, model, SchemaTypes } from "mongoose";
import { Sunbed } from "../interfaces/sunbed.interface";

const sunbedSchema = new Schema<Sunbed>({
  name: {
    type: SchemaTypes.String,
    required: true,
  },
  price: {
    type: SchemaTypes.Number,
    required: true,
  },
  amount: {
    type: SchemaTypes.Number,
    required: true,
    },
  status: {
    type: SchemaTypes.String,
    enum: ["available", "booked"],
    default: "available",
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

export default model("Sunbed", sunbedSchema);
