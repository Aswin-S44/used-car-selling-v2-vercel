const mongoose = require("mongoose");

const siteSchema = new mongoose.Schema(
  {
    instagram_url: { type: String },
    email: { type: String, required: true },
    facebook_url: { type: String },
    twitter: { type: String },
    phone: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Site = mongoose.model("Site", siteSchema);
module.exports = Site;
