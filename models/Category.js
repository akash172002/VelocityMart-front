import mongoose, { Schema, model, models } from "mongoose";

const categorySchema = new Schema({
  name: { type: String, required: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  properties: [{ type: Object }],
});

export const Category = models?.Category || model("Category", categorySchema);
