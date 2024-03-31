import { Product } from "./Product";

const { Schema, models, model } = require("mongoose");

const WhishProductSchema = new Schema({
  userEmail: { type: String, required: true },
  product: { type: Schema.Types.ObjectId, ref: "Product" },
});

export const WhishedProduct =
  models?.WhishedProduct || model("WhishedProduct", WhishProductSchema);
