const express = require("express");
const {
  addDealer,
  getDealers,
} = require("../../controller/dealer/dealerController");

const dealerRouter = express.Router();

dealerRouter.get("/", async (req, res) => {
  const query = req.query;

  const response = await getDealers(query);
  if (response.error) {
    res.status(500).send({ error: response.error });
  } else {
    res.send(response);
  }
});

dealerRouter.post("/add", async (req, res) => {
  let response = await addDealer(req.body);
  res.send(response);
});

module.exports = dealerRouter;
