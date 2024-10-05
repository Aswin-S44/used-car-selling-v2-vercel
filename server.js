const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const dealerRouter = require("./routes/dealer/dealerRouter");
const adminRouter = require("./routes/admin/adminRouter");
const customerRouter = require("./routes/customer/customerRouter");
require("dotenv").config();
const { Server } = require("socket.io"); // Importing Socket.IO
const http = require("http");
const Enquiry = require("./models/Enquiry/EnquiryModel");
const { successResponse } = require("./constants/response");
const sendEmail = require("./utils/helpers");

const app = express();
const port = process.env.PORT || 5000;

// Create HTTP server for Socket.IO integration
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Enable cross-origin requests if needed
    methods: ["GET", "POST"],
  },
});

db.connect();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes configurations
app.use("/api/v1/dealer", dealerRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/customer", customerRouter);

app.get("/", (req, res) => {
  res.send("Nodejs server is running....");
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.post("/enquiry", async (req, res) => {
  try {
    let data = req.body;
    console.log("req bdy------------", req.body);
    let result = await Enquiry.create(req.body);
    console.log("rsult---------", result ? result : "no result");
    io.emit("new-enquiry", result);
    await sendEmail(
      "aswin.s.t.s04@gmail.com",
      "Enquiry received",
      `${data?.first_name} send you an enquiry . Contact : ${data?.phone_number}`
    );
    res.send(successResponse);
  } catch (error) {
    return error;
  }
});

app.get("/enquiries", async (req, res) => {
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
    } = req.query;

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
    res.send(successResponse);
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Listen on the server
server.listen(port, () => {
  console.log(`Server is running at the port ${port}`);
});

// Export io to use in the routes
module.exports = io;
