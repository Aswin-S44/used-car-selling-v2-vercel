const express = require("express");
const {
  addCar,
  getAllCars,
  getCar,
  getAllDealers,
  addDealer,
  addAdmin,
  login,
  addSiteSettings,
  getSiteSettings,
  updateSiteSettings,
  getAdminUsers,
  updateAdminUser,
  deleteAdminUser,
  getAllEnquiries,
  updateEnquiry,
  getStatus,
  getEnquiryDetails,
  deleteCar,
  editCar,
} = require("../../controller/admin/adminRouter");
const adminRouter = express.Router();
const multer = require("multer");
const { cloudinary } = require("../../config/cloudinary");
const Enquiry = require("../../models/Enquiry/EnquiryModel");
const { getCoordinates } = require("../../utils/helpers");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

adminRouter.get("/", (req, res) => {
  res.send("Admin router");
});

adminRouter.post("/add-car", async (req, res) => {
  try {
    let carData = req.body;
    // ss
    const { latitude, longitude } = await getCoordinates(carData.location);

    carData.latitude = latitude;
    carData.longitude = longitude;
    const mainImageStr = req.body.image;
    const mainImageResponse = await cloudinary.uploader.upload(mainImageStr, {
      upload_preset: "cloudinary_react",
      public_id: Date.now(),
    });
    carData.image = mainImageResponse.url;

    let additionalImageUrls = [];
    const additionalImages = req.body.additional_images || [];
    for (let image of additionalImages) {
      const additionalImageResponse = await cloudinary.uploader.upload(image, {
        upload_preset: "cloudinary_react",
        public_id: `${Date.now()}_additional`,
      });
      additionalImageUrls.push(additionalImageResponse.url);
    }

    carData.additional_images = additionalImageUrls;
    console.log("car data==============", carData ? carData : "NO CAR DATA");
    let response = await addCar(carData);
    res.send(response);
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).send({ error: "Error uploading images" });
  }
});

adminRouter.get("/get-cars", async (req, res) => {
  let response = await getAllCars(req.query);
  res.send(response);
});

adminRouter.get("/car/:id", async (req, res) => {
  let response = await getCar(req.params.id);
  res.send(response);
});

adminRouter.get("/all-dealers", async (req, res) => {
  let response = await getAllDealers();
  res.send(response);
});

adminRouter.post("/add-dealer", async (req, res) => {
  let response = await addDealer(req.body);
  res.send(response);
});

adminRouter.get("/get-admin-users", async (req, res) => {
  let response = await getAdminUsers();
  res.send(response);
});

adminRouter.post("/update-admin-user/:id", async (req, res) => {
  let response = await updateAdminUser(req.params.id, req.body);
  res.send(response);
});

adminRouter.post("/delete-admin-user/:id", async (req, res) => {
  let response = await deleteAdminUser(req.params.id);
  res.send(response);
});

adminRouter.post("/add-admin", async (req, res) => {
  let response = await addAdmin(req.body);
  res.send(response);
});

adminRouter.post("/login", async (req, res) => {
  let response = await login(req.body);
  res.send(response);
});

adminRouter.post("/add-site-settings", async (req, res) => {
  let response = await addSiteSettings(req.body);
  res.send(response);
});

adminRouter.get("/get-site-settings", async (req, res) => {
  let response = await getSiteSettings();
  res.send(response);
});

adminRouter.post("/update-site-settings/:id", async (req, res) => {
  let response = await updateSiteSettings(req.params.id, req.body);
  res.send(response);
});

adminRouter.get("/enquiries", async (req, res) => {
  const {
    page = 1,
    limit = 10,
    allow_whatsapp_notification,
    detailsSent,
    carPurchased,
  } = req.query;

  let filters = {};

  if (allow_whatsapp_notification !== undefined) {
    filters.allow_whatsapp_notification =
      allow_whatsapp_notification === "true";
  }

  if (detailsSent !== undefined) {
    filters.detailsSent = detailsSent === "true";
  }

  if (carPurchased !== undefined) {
    filters.carPurchased = carPurchased === "true";
  }

  try {
    let response = await getAllEnquiries(filters, page, limit);
    res.send(response);
  } catch (error) {
    res.status(500).send({ message: "Error fetching enquiries", error });
  }
});

adminRouter.put("/update-enquiry/:id", async (req, res) => {
  const { detailsSent, carPurchased } = req.body;
  try {
    await Enquiry.updateOne(
      { _id: req.params.id },
      { $set: { detailsSent, carPurchased } }
    );
    res.send({ success: true });
  } catch (error) {
    res.status(500).send({ error: "Failed to update enquiry" });
  }
});

adminRouter.get("/get-status", async (req, res) => {
  let response = await getStatus();
  res.send(response);
});

adminRouter.get("/get-enquiry/:id", async (req, res) => {
  let response = await getEnquiryDetails(req.params.id);
  res.send(response);
});

adminRouter.delete("/car/:id", async (req, res) => {
  let response = await deleteCar(req.params.id);
  res.send(response);
});

adminRouter.put("/edit-car/:id", async (req, res) => {
  let response = await editCar(req.params.id, req.body.data);
  res.send(response);
});

module.exports = adminRouter;
