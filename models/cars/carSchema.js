const mongoose = require("mongoose");
const carSchema = new mongoose.Schema(
  {
    car_name: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: String, required: true },
    kilometer: { type: Number, required: true },
    varient: { type: String },
    owner: { type: String, required: true },
    claim: { type: Boolean, required: true },
    major_accident: { type: Boolean, required: true },
    shop_name: { type: String, required: true },
    loan_available: { type: Boolean, required: true },
    dealer: { type: String, required: true },
    about: { type: String, required: false },
    image: { type: String, required: true },
    additional_images: [],
    sold: { type: Boolean, required: false },
    price: { type: Number, required: true },
    color: { type: String },
    under_warrenty: { type: String, required: true },
    fuelType: { type: String, required: true },
    location: { type: String, required: true },
    transmission_type: { type: String, required: true },
    registration: { type: String, required: true },
    category: { type: String, required: true },
    insurance: { type: String },
    rto: { type: String },
    engine: { type: String },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: false,
      },
      coordinates: {
        type: [Number],
        required: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

carSchema.index({ location: "2dsphere" });

const Cars = mongoose.model("Cars", carSchema);
module.exports = Cars;
