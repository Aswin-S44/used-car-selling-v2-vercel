const mongoose = require("mongoose");

const SellMyCarSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    car_name: { type: String, required: true },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

const SellMyCar = mongoose.model("SellMyCar", SellMyCarSchema);
module.exports = SellMyCar;
