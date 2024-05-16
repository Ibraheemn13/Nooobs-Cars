const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const multer = require("multer");
const { signInFun } = require('./signin');
const { saveToDb, submitCode, sendVerificationEmail } = require("./signup");
const User = require('./user');
const Cars = require('./cars');


// Load environment variables from .env file
require("dotenv").config();

const app = express();
const port = 3000;

var name, Email, passwd;
var update = true;

var onetp = 0;

// Middleware to parse the body of HTTP requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static('login'));
app.use(express.static('./'));


// Multer setup for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });


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

// API endpoint to delete a user by ID
app.delete('/api/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        await User.findByIdAndDelete(userId);
        res.status(200).send('User deleted');
    } catch (error) {
        console.error('Error deleting user:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// API endpoint to get car details by ID
app.get('/api/cars/:id', async (req, res) => {
    try {
        const carId = new mongoose.Types.ObjectId(req.params.id); // Correctly create an ObjectId instance
        const car = await Cars.findById(carId);
        res.json(car);
    } catch (error) {
        console.error('Error fetching car details:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// API endpoint to update a car by ID
app.put('/api/cars/:id', async (req, res) => {
    try {
        const carId = req.params.id;
        const updatedCar = await Cars.findByIdAndUpdate(carId, req.body, { new: true });
        if (!updatedCar) {
            return res.status(404).send('Car not found');
        }
        res.status(200).json(updatedCar);
    } catch (error) {
        console.error('Error updating car:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Add the new API endpoint to get cars data
app.get('/api/cars', async (req, res) => {
    try {
        const cars = await Cars.find();
        res.json(cars);
    } catch (error) {
        console.error('Error fetching cars:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// API endpoint to delete a car by ID
app.delete('/api/cars/:id', async (req, res) => {
    try {
        const carId = req.params.id;
        await Cars.findByIdAndDelete(carId);
        res.status(200).send('Car deleted');
    } catch (error) {
        console.error('Error deleting car:', error.message);
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
    const { email, fullname, password, updates } = req.body;
    //console.log("email from signup is ", email)
    Email = email;
    name = fullname;
    passwd = password;
    update = updates;

    // Generate OTP
    onetp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

    sendVerificationEmail(Email, onetp);

    res.send(`<script>alert('Form submitted'); window.location.href="/emailVerification/VerifyEmail";</script>`);
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
        const verified = await submitCode(otp, Email, onetp);
        if (verified) {
            saved = await saveToDb(Email, name, passwd, update);
            if (saved) {
                res.send(`<script>alert('Email Verified and user saved.'); window.location.href="/";</script>`);
            }
            else {
                res.send(`<script>alert('User already exists with this email.'); window.location.href="/login/signup.html";</script>`);
            }
        }
        else {
            res.send(`<script>alert('Invalid OTP. User Not saved'); window.location.href="/emailVerification/VerifyEmail.html";</script>`
            );
        }
    } catch (error) {
        console.error("Error verifying email:", error.message);
        res.send('<script>alert("Error verifying email."); window.location.href="/emailVerification/verifyEmail.html";</script>'
        );
    }
});


// Route to handle GET request for car details form
app.get('/sellYourCar', (req, res) => {
    res.sendFile(path.join(__dirname, '/sellYourCar.html'));
});

// Route to handle the car details form submission with image uploads
app.post('/submit-car-details', upload.fields([
    { name: 'CarImage1', maxCount: 1 },
    { name: 'CarImage2', maxCount: 1 },
    { name: 'CarImage3', maxCount: 1 },
    { name: 'CarImage4', maxCount: 1 },
    { name: 'CarImage5', maxCount: 1 }
]), async (req, res) => {
    try {
        const { CarName, CarModelYear, CarDescription } = req.body;
        
        // Create a new car document
        const newCar = new Cars({
            CarName: CarName,
            ModelYear: CarModelYear,
            Description: CarDescription,
            Image1: req.files.CarImage1 ? { data: req.files.CarImage1[0].buffer, contentType: req.files.CarImage1[0].mimetype } : undefined,
            Image2: req.files.CarImage2 ? { data: req.files.CarImage2[0].buffer, contentType: req.files.CarImage2[0].mimetype } : undefined,
            Image3: req.files.CarImage3 ? { data: req.files.CarImage3[0].buffer, contentType: req.files.CarImage3[0].mimetype } : undefined,
            Image4: req.files.CarImage4 ? { data: req.files.CarImage4[0].buffer, contentType: req.files.CarImage4[0].mimetype } : undefined,
            Image5: req.files.CarImage5 ? { data: req.files.CarImage5[0].buffer, contentType: req.files.CarImage5[0].mimetype } : undefined,
        });

        // Save the car document to the database
        await newCar.save();

        res.send(`<script>alert('Car details submitted successfully.'); window.location.href="/";</script>`);
    } catch (error) {
        console.error('Error submitting car details:', error.message);
        res.status(500).send(`<script>alert('Error submitting car details.'); window.location.href="/sellYourCar";</script>`);
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

