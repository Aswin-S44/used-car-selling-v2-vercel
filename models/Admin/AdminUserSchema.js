const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    deactivated: { type: Boolean, default: false },
    password: { type: String, required: true },
    enable2fa: { type: Boolean, default: true },
    securityCode: { type: String },
  },
  {
    timestamps: true,
  }
);

const AdminUser = mongoose.model("AdminUser", adminSchema);
module.exports = AdminUser;
