const nodemailer = require("nodemailer");
const axios = require("axios");
require("dotenv").config();

const sendEmail = async (to, subject, content) => {
  try {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "wheelzloop@gmail.com", //process.env.EMAIL_USER,
        pass: "zcpnzjhyvrbjijsn", // process.env.EMAIL_PASS,
      },
    });

    var mailOptions = {
      from: to,
      to: "wheelzloop@gmail.com", // process.env.EMAIL_USER,
      subject,
      text: content,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    console.log("Error while sending email : ", error);
    return error;
  }
};

const getCoordinates = async (locationName) => {
  const apiKey = process.env.GEOLOCATION_API_KEY;
  const response = await axios.get(
    `https://api.opencagedata.com/geocode/v1/json?q=${locationName}&key=${apiKey}`
  );
  console.log("response-------------", response);
  const { lat, lng } = response.data.results[0]?.geometry;
  return { latitude: lat, longitude: lng };
};

module.exports = { sendEmail, getCoordinates };
