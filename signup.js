const mongoose = require("mongoose")
const User = require("./user")
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();


async function saveToDb(email, name, password, updates) {
  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

  // Save OTP along with user details in the database
  const user = new User({
    Email: email,
    Name: name,
    Password: password,
    Updates: updates,
    OTP: otp
  });
  await user.save();

  // Send verification email with OTP
  sendVerificationEmail(email, otp);

  return true;
}

function sendVerificationEmail(email, otp) {
  // Create a transporter using Ethereal's SMTP transport
  console.log(process.env.ETHEREAL_SMTP_HOST, process.env.ETHEREAL_SMTP_PORT)
  const transporter = nodemailer.createTransport({
    host: process.env.ETHEREAL_SMTP_HOST,
    port: process.env.ETHEREAL_SMTP_PORT,
    auth: {
      user: process.env.ETHEREAL_USER,
      pass: process.env.ETHEREAL_PASSWORD,
    },
  });

  // Email content
  const mailOptions = {
    from: "haley.mraz@ethereal.email",
    to: email,
    subject: "Verify Your Email Address",
    text: `Your OTP (One-Time Password) for email verification is: ${otp}`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending verification email:", error);
    } else {
      console.log("Verification email sent:", info.response);
    }
  });
}
module.exports = { saveToDb };