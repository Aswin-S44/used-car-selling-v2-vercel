module.exports = {
  successResponse: {
    status: 200,
    message: "Success",
    data: null,
  },
  errorResponse: {
    status: 400,
    message: "Error ",
    data: null,
  },
  conflict: {
    status: 404,
    message: "Data already exists",
    data: null,
  },
  serverError: {
    status: 500,
    message: "Internal server error",
    data: null,
  },
};
