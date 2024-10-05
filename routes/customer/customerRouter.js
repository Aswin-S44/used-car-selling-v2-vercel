const express = require("express");
const {
  sendEnquiry,
  getEnquiries,
  sendFeedback,
  addReview,
  getReviews,
} = require("../../controller/customer/customerController");
const Cars = require("../../models/cars/carSchema");
const SellMyCar = require("../../models/Customer/SellMyCar");
const { successResponse } = require("../../constants/response");
const customerRouter = express.Router();

customerRouter.get("/", (req, res) => {
  res.send("Customer router called");
});

customerRouter.post("/enquiry", async (req, res) => {
  let result = await sendEnquiry(req.body);
  res.send(result);
});

customerRouter.get("/enquiries", async (req, res) => {
  let result = await getEnquiries(req.query);
  res.send(result);
});

customerRouter.post("/add-feedback", async (req, res) => {
  let result = await sendFeedback(req.body);
  res.send(result);
});

customerRouter.post("/add-review", async (req, res) => {
  let result = await addReview(req.body);
  res.send(result);
});

customerRouter.get("/get-reviews", async (req, res) => {
  let result = await getReviews(req.query);
  res.send(result);
});

customerRouter.post("/favourites", async (req, res) => {
  try {
    const { favIds } = req.body;

    if (!favIds || !Array.isArray(favIds) || favIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "favIds must be a non-empty array.",
      });
    }

    const favCars = await Cars.find({ _id: { $in: favIds } });

    return res.status(200).json({
      success: true,
      data: favCars,
    });
  } catch (error) {
    console.error("Error retrieving favorite cars:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve favorite cars.",
      error: error.message,
    });
  }
});

customerRouter.post("/sell-my-car", async (req, res) => {
  try {
    let resp = await SellMyCar.create(req.body);
    res.send(successResponse);
  } catch (error) {
    console.log("Error while sell my car request : ", error);
  }
});

module.exports = customerRouter;
