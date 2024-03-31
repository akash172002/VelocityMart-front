const { Schema, models, model } = require("mongoose");

const OrderSchema = new Schema(
  {
    userEmail: String,
    line_items: Object,
    name: String,
    city: String,
    email: String,
    postal: String,
    country: String,
    address: String,
    paid: Boolean,
  },
  {
    timestamps: true,
  }
);

export const Order = models?.Order || model("Order", OrderSchema);
