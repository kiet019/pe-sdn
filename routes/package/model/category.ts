import { Schema, model } from "mongoose";

export const categorySchema = new Schema(
  {
    categoryName: {
      type: String,
    },
  },
  { timestamps: true }
);

export const categoryModel = model("category", categorySchema);

export interface Category {
  _id: any;
  categoryName: string;
}
