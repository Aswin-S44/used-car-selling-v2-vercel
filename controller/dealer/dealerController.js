const { successResponse } = require("../../constants/response");
const Dealer = require("../../models/dealers/dealerSchema");

module.exports = {
  addDealer: async (data) => {
    try {
      let res = await Dealer.create(data);
      successResponse.data = res;
      return successResponse;
    } catch (error) {
      return error;
    }
  },
  getDealers: async (query) => {
    try {
      const { page = 1, limit = 10, location, name, brand } = query;

      const skip = (page - 1) * limit;

      const filter = {};
      if (location) filter.location = new RegExp(location, "i");
      if (name) filter.name = new RegExp(name, "i");
      if (brand) filter.brand = new RegExp(brand, "i");

      const dealers = await Dealer.find(filter).skip(skip).limit(Number(limit));
      const total = await Dealer.countDocuments(filter);

      const response = {
        data: dealers,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / limit),
        },
      };
      return response;
    } catch (error) {
      return { error: error.message };
    }
  },
};
