const { Schema, models, model } = require("mongoose");

const reviewSchema = new Schema(
  {
    title: String,
    description: String,
    stars: Number,
    product: { type: Schema.Types.ObjectId },
    userEmail: String,
    userImage: String,
  },
  { timestamps: true }
);

export const Review = models?.Review || model("Review", reviewSchema);
