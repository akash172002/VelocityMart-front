const { Schema, default: mongoose, model, models } = require("mongoose");

const AddressSchema = new Schema({
  userEmail: { type: String, unique: true, required: true },
  name: String,
  email: String,
  city: String,
  postal: String,
  address: String,
  country: String,
});

export const Address = models?.Address || model("Address", AddressSchema);
