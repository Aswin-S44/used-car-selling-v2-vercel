const { successResponse, errorResponse } = require("../../constants/response");
const Contact = require("../../models/Customer/Contact");
const Review = require("../../models/Customer/Reviews");
const Enquiry = require("../../models/Enquiry/EnquiryModel");
const io = require("../../server");
const sendEmail = require("../../utils/helpers");

module.exports = {
  sendEnquiry: async (data) => {
    try {
      let res = await Enquiry.create(data);
      io.emit("new-enquiry", res);
      await sendEmail(
        "aswin.s.t.s04@gmail.com",
        "Enquiry received",
        `${data?.first_name} send you an enquiry . Contact : ${data?.phone_number}`
      );
      res.send(successResponse);
    } catch (error) {
      return error;
    }
  },
  getEnquiries: async (query) => {
    try {
      const {
        page = 1,
        limit = 10,
        sort = "createdAt",
        order = "desc",
        startDate,
        endDate,
        carId,
        detailsSent,
        carPurchased,
      } = query;

      const filter = {};
      if (carId) filter.carId = carId;
      if (detailsSent) filter.detailsSent = detailsSent === "true";
      if (carPurchased) filter.carPurchased = carPurchased === "true";
      if (startDate && endDate) {
        filter.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      const totalCount = await Enquiry.countDocuments(filter);

      const enquiries = await Enquiry.find(filter)
        .sort({ [sort]: order === "asc" ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      let resp = {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: parseInt(page),
        data: enquiries,
      };
      successResponse.data = resp;
      return successResponse;
    } catch (error) {
      console.error("Error fetching enquiries:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  sendFeedback: async (feedback) => {
    try {
      let res = await Contact.create(feedback);
      return successResponse;
    } catch (error) {
      return error;
    }
  },
  addReview: async (review) => {
    try {
      let res = await Review.create(review);
      return successResponse;
    } catch (error) {
      return error;
    }
  },
  getReviews: async (query) => {
    try {
      let result = [];
      if (query.dealerId == "all") {
        result = await Review.find({}).sort({ rating: 1 });
      } else {
        result = await Review.find(query).sort({
          rating: 1,
        });
      }
      return result;
    } catch (error) {
      return error;
    }
  },
};
