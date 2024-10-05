const mongoose = require("mongoose");
const EnquirySchema = mongoose.Schema(
  {
    first_name: { type: String, required: true },
    country_code: { type: String },
    phone_number: { type: String, required: true },
    allow_whatsapp_notification: { type: Boolean, default: false },
    carId: { type: String, required: true },
    detailsSent: { type: Boolean, default: false },
    carPurchased: { type: Boolean, default: false },
  },
  {
    timestamp: true,
  }
);

const Enquiry = mongoose.model("Enquiry", EnquirySchema);
module.exports = Enquiry;
