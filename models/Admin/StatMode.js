const mongoose = require("mongoose");
const statSchema = mongoose.Schema(
  {
    total_earnings: { type: Number, default: 0 },
    total_sales: { type: Number, default: 0 },
    total_cars: { type: Number, default: 0 },
    total_dealers: { type: Number, default: 0 },
  },
  {
    timestamp: true,
  }
);

const Stats = mongoose.model("Stats", statSchema);
module.exports = Stats;
