import { Schema, model } from "mongoose";
import { Category } from "./category.ts";

export const orchidSchema = new Schema(
  {
    orchidName: { type: String, require: true },
    price: { type: Number, require: true },
    isNatural: { type: Boolean, default: false },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Categories",
      require: true,
    },
  },
  { timestamps: true }
);

export const orchidModel = model("orchid", orchidSchema);

export interface Orchid {
  _id: any;
  orchidName: string;
  price: number;
  isNatural: boolean;
  category: Category;
}
