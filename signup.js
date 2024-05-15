const mongoose = require("mongoose")
const User = require("./user")
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

var userName;

async function saveToDb(Email, name, password, updates, onetp) {

  // checking if the updates checkbox is checked or not 
  const wantsUpdates = updates ? true : false;


  const existingUser = await User.findOne({ Email: Email });

  if (existingUser) {
    console.log("User already exists with email:", Email);

    return 0;
  }

  userName = name;

  // Creating a new user
  const user = new User({ Email: Email, Name: name, Password: password, Updates: wantsUpdates, OTP: onetp })

  // Saving the user into the database
  await user.save()

  return 1;
}

function sendVerificationEmail(email, otp) {
  // Create a transporter using Ethereal's SMTP transport
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
    text: `Dear ${userName},\n\nYour OTP (One-Time Password) for email verification is: ${otp}.\n\nRegards,\nNOOOBS`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending verification email:", error);
    } else {
      console.log("Verification email sent:", info.response);
      console.log('GET OTP FROM THIS URL: %s', nodemailer.getTestMessageUrl(info));
    }
  });
}

async function submitCode(verificationCode, Email, OriginalOTP) {
  if (!verificationCode) {
    console.log('Please enter the verification code.');
    return 0;
  }

  const existingUser = await User.findOne({ Email: Email });
  console.log(existingUser)

  if (verificationCode === OriginalOTP) {
    console.log("User Email Verified by OTP");
    return 1;
  }
  else {
    console.log('Invalid OTP!');
    return 0;
  }

}

module.exports = { saveToDb, submitCode, sendVerificationEmail};
