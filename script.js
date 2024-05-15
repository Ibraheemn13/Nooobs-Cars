const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const { signInFun } = require('./signin');
const { saveToDb, submitCode } = require("./signup");
const User = require('./user');


// Load environment variables from .env file
require("dotenv").config();

const app = express();
const port = 3000;
var userEmail;

// Middleware to parse the body of HTTP requests
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('login'));
app.use(express.static('./'));


// // Add the new API endpoint to get users data
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// // FOR SIGNUP PAGE

// // Route to handle GET request
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '/login/signup.html'));
});

// Route to handle the form submission
app.post('/submit-form', async (req, res) => {
    try {
        const { email, fullname, password, updates } = req.body;
        //console.log("email from signup is ", email)
        saved = await saveToDb(email, fullname, password, updates);
        if (saved) {
            userEmail = email;
            // res.send('Form submitted and user saved.');
            res.send(`<script>alert('Form submitted and user saved.'); window.location.href="/emailVerification/VerifyEmail.html";</script>`);
        }
        else {
            res.send(`<script>alert('User already exsists with this email.'); window.location.href="/login/signup.html";</script>`);
        }

    } catch (error) {
        res.send(`<script>alert('Error saving user.'); window.location.href="/login/signup.html";</script>`);
        console.error('SignUp Error: ', error.message); // Log detailed error message
    }

});





// FOR EMAIL VERIFICATION

// Route to handle GET request for email verification page

app.get("/emailVerification/verifyEmail", (req, res) => {
    res.sendFile(path.join(__dirname, "/emailVerification/verifyEmail.html"));
});

// Route to handle POST request for OTP verification
app.post("/emailVerification/verifyEmail", async (req, res) => {
    try {
        const { otp } = req.body;
        const verified = await submitCode(otp, userEmail);
        if (verified) {
            res.send(`<script>alert('Email Verified.'); window.location.href="/";</script>`
            );
        }
        else {
            res.send(`<script>alert('Invalid OTP.'); window.location.href="/";</script>`
            );
        }
    } catch (error) {
        console.error("Error verifying email:", error.message);
        res.send('<script>alert("Error verifying email."); window.location.href="/emailVerification/verifyEmail.html";</script>'
        );
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});




// FOR SIGNIN PAGE

// Route to handle GET request
app.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, '/login/login.html'));
});

// Route to handle the form submission
app.post('/signin-form', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("called from scriptjs", password);
        const result = await signInFun(email, password);
        if (result === 1) {
            // Authentication successful
            res.send(`<script>alert('User logged in successfully.'); window.location.href="/";</script>`);
        } else if (result === 0) {
            // Authentication failed
            res.send(`<script>alert('Authentication failed. Wrong email or password.'); window.location.href="/login/login.html";</script>`);
        }

    } catch (error) {
        res.send(`<script>alert('Error saving user.'); window.location.href="/login/login.html";</script>`);
        console.error('SignIn Error: ', error.message); // Log detailed error message

    }

});




// DATABASE STUFF

// Connsecting to database nooobsCars
mongoose.connect("mongodb://localhost/nooobsCars",)
    //If connected
    .then(() => console.log("Connected to MongoDB"))
    // If not connected
    .catch(err => console.error("Could not connect to MongoDB:", err));

