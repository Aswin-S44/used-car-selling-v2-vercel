const mongoose = require("mongoose");

const DealerSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    location: { type: String, required: true },
    brand: { type: String, required: true },
    blocked: { type: Boolean, default: false },
    deactivated: { type: Boolean, default: false },
    about: { type: String },
    carCount: { type: Number, default: 0 },
    subscribed: { type: Boolean, default: false },
    soldCount: { type: Number, default: false },
  },
  {
    timestamp: true,
  }
);

const Dealer = mongoose.model("Dealer", DealerSchema);
module.exports = Dealer;
