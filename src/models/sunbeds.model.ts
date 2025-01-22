import { Schema, model, SchemaTypes } from "mongoose";
import { Sunbed } from "../interfaces/sunbed.interface";

const entriesSchema = new Schema(
  {
    name: {
      type: SchemaTypes.String,
      required: true,
      enum: [
        "General",
        "Tumbona cesped",
        "Tumbona maritimo",
        "Balinesa x2",
        "Balinesa x4",
      ],
    },
    amount: { type: SchemaTypes.Number, required: true },
    price: {
      type: SchemaTypes.Number,
      required: true,
    },
  },
  { _id: false }
);

const sunbedSchema = new Schema<Sunbed>({
  date: {
    type: SchemaTypes.Date,
    required: true,
  },
  entries: {
    type: [entriesSchema],
    required: true,
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
