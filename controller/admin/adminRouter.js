const {
  successResponse,
  errorResponse,
  conflict,
} = require("../../constants/response");
const AdminUser = require("../../models/Admin/AdminUserSchema");
const Site = require("../../models/Admin/siteModel");
const Cars = require("../../models/cars/carSchema");
const Dealer = require("../../models/dealers/dealerSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "Something secret";
const mongoose = require("mongoose");
const Enquiry = require("../../models/Enquiry/EnquiryModel");
const Stats = require("../../models/Admin/StatMode");

module.exports = {
  addCar: async (data) => {
    try {
      let res = await Cars.create(data);
      successResponse.data = res;
      return successResponse;
    } catch (error) {
      return error;
    }
  },

  getAllCars: async (query) => {
    try {
      let filter = {};

      if (query.search) {
        filter.$or = [
          { car_name: { $regex: query.search, $options: "i" } },
          { brand: { $regex: query.search, $options: "i" } },
          { model: { $regex: query.search, $options: "i" } },
        ];
      }

      if (query.latitude && query.longitude) {
        const radius = query.radius ? parseFloat(query.radius) : 5000;
        filter.location = {
          $geoWithin: {
            $centerSphere: [
              [parseFloat(query.longitude), parseFloat(query.latitude)],
              radius / 6378.1,
            ],
          },
        };
      }

      if (query.car_name) filter.car_name = query.car_name;
      if (query.brand) filter.brand = query.brand;
      if (query.model) filter.model = query.model;
      if (query.year) filter.year = query.year;
      if (query.kilometer) filter.kilometer = { $lte: query.kilometer };
      if (query.owner) filter.owner = query.owner;
      if (query.shop_name) filter.shop_name = query.shop_name;
      if (query.dealer) filter.dealer = query.dealer;
      if (query.loan_available !== undefined)
        filter.loan_available = query.loan_available === "true";
      if (query.varient) filter.varient = query.varient;
      if (query.claim !== undefined) filter.claim = query.claim === "true";
      if (query.sold !== undefined) filter.sold = query.sold === "true";

      const page = parseInt(query.page) || 1;
      const limit = parseInt(query.limit) || 10;
      const skip = (page - 1) * limit;

      if (query.priceRange) {
        const [minPrice, maxPrice] = query.priceRange;

        const parsedMinPrice = parseFloat(minPrice);
        const parsedMaxPrice = parseFloat(maxPrice);

        if (!isNaN(parsedMinPrice) && !isNaN(parsedMaxPrice)) {
          filter.price = { $gte: parsedMinPrice, $lte: parsedMaxPrice };
        }
      }

      const cars = await Cars.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      const totalCars = await Cars.countDocuments(filter);

      return { success: true, data: cars, totalCars, page, limit };
    } catch (error) {
      console.error(error);
      return { success: false, error: error.message };
    }
  },

  getCar: async (carId) => {
    try {
      let car = await Cars.findOne({ _id: carId });
      successResponse.data = car;
      return successResponse;
    } catch (error) {
      return error;
    }
  },
  getAllDealers: async () => {
    try {
      let dealers = await Dealer.find();
      successResponse.data = dealers;
      return successResponse;
    } catch (error) {
      return error;
    }
  },
  addDealer: async (data) => {
    try {
      await Dealer.create(data);
      return successResponse;
    } catch (error) {
      return error;
    }
  },
  updateAdminUser: async (id, data) => {
    try {
      await AdminUser.updateOne({ _id: id }, { $set: data });
      return true;
    } catch (error) {
      return false;
    }
  },
  deleteAdminUser: async (id, data) => {
    try {
      await AdminUser.deleteOne({ _id: id });
      return true;
    } catch (error) {
      return false;
    }
  },
  getAdminUsers: async (data) => {
    try {
      let res = await AdminUser.find();
      successResponse.data = res;
      return successResponse;
    } catch (error) {
      return error;
    }
  },
  addAdmin: async (data) => {
    try {
      let { username, email } = data;
      let user = await AdminUser.findOne({ username });
      let userEmail = await AdminUser.findOne({ email });

      if (user || userEmail) {
        return conflict;
      } else {
        let bcryptedPassword = await bcrypt.hash(data.password, 10);

        data.password = bcryptedPassword;
        const token = jwt.sign({ username, email }, JWT_SECRET, {
          expiresIn: "1d",
        });
        data.token = token;
        await AdminUser.create(data);

        successResponse.data = data;
        return successResponse;
      }
    } catch (error) {
      return error;
    }
  },
  login: (userData) => {
    return new Promise(async (resolve, reject) => {
      const { username, password } = userData;

      if (!(username && password)) {
        resolve({ message: "All input is required" });
      }

      const user = await AdminUser.findOne({ username });

      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ username, email: user.email }, JWT_SECRET, {
          expiresIn: "1d",
        });

        user.token = token;

        successResponse.data = user;
        resolve(successResponse);
      }
      resolve(errorResponse);
    });
  },
  addSiteSettings: async (data) => {
    try {
      let res = await Site.create(data);
      return successResponse;
    } catch (error) {
      return error;
    }
  },
  getSiteSettings: async () => {
    try {
      let res = await Site.findOne({});
      successResponse.data = res;
      return successResponse;
    } catch (error) {
      return error;
    }
  },
  updateSiteSettings: async (id, data) => {
    try {
      let res = await Site.updateOne({ _id: id }, { $set: data });
      return true;
    } catch (error) {
      return error;
    }
  },
  getAllEnquiries: async (filters, page, limit) => {
    try {
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      const skip = (pageNumber - 1) * limitNumber;

      let enquiries = await Enquiry.find(filters).skip(skip).limit(limitNumber);

      const totalEnquiries = await Enquiry.countDocuments(filters);

      const successResponse = {
        status: 200,
        message: "Success",
        data: enquiries,
        meta: {
          total: totalEnquiries,
          page: pageNumber,
          limit: limitNumber,
          totalPages: Math.ceil(totalEnquiries / limitNumber),
        },
      };

      return successResponse;
    } catch (error) {
      return { status: 500, message: "Error", error };
    }
  },
  updateEnquiry: async (id) => {
    try {
      await Enquiry.updateOne({ _id: id }, { $set: { detailsSent: true } });
      return successResponse;
    } catch (error) {
      return error;
    }
  },
  getStatus: async () => {
    try {
      let stat = await Stats.findOne({});

      let carCount = await Cars.countDocuments({});
      let salesCount = 0;
      let dealerCount = await Dealer.countDocuments({});
      let status = {
        total_earnings: 0,
        total_sales: 0,
        total_cars: carCount,
        total_dealers: dealerCount,
      };

      successResponse.data = status;
      return successResponse;
    } catch (error) {
      return error;
    }
  },
  getEnquiryDetails: async (enquiryId) => {
    try {
      const enquiry = await Enquiry.findOne({ _id: enquiryId });
      if (!enquiry) {
        return errorResponse;
      }
      let respObj = {};
      const carId = enquiry.carId;

      const car = await Cars.findOne({ _id: carId, sold: false });
      if (!car) {
        respObj.car_details = null;
      }

      (respObj.enquiry_details = enquiry),
        (respObj.car_details = car),
        (successResponse.data = respObj);
      return successResponse;
    } catch (error) {
      return error;
    }
  },
  deleteCar: async (id) => {
    try {
      await Cars.deleteOne({ _id: id });
      return true;
    } catch (error) {
      return error;
    }
  },
  editCar: async (id, data) => {
    try {
      const car = await Cars.findOne({ _id: id });

      if (!car) {
        return { success: false, message: "Car not found" };
      }
      console.log("data---------------", data);
      let status = await Cars.updateOne({ _id: id }, { data });
      const new_car = await Cars.findOne({ _id: id });
      console.log("NEW CAR-------------", new_car);
      return { success: true, message: "Car updated successfully" };
    } catch (error) {
      return {
        success: false,
        message: "An error occurred",
        error: error.message,
      };
    }
  },
};
