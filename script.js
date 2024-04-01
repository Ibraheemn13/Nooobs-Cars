const mongoose = require("mongoose")
const { saveToDb } = require('./signup');
const { signInFun } = require('./signin');
const path = require('path');
const express = require('express');

const app = express();
const port = 3000;

// using static files to use with express
app.use(express.static('login'));
app.use(express.static('./'));

// Middleware to parse the body of HTTP requests
app.use(express.urlencoded({ extended: true }));

// FOR SIGNUP PAGE

// Route to handle GET request
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '/login/signup.html'));
});

// Route to handle the form submission
app.post('/submit-form', async (req, res) => {
    try {
        const { email, fullname, password, updates } = req.body;
        saved = await saveToDb(email, fullname, password, updates);
        if (saved) {
            // res.send('Form submitted and user saved.');
            res.send(`<script>alert('Form submitted and user saved.'); window.location.href="/login/signup.html";</script>`);
        }
        else {
            res.send(`<script>alert('User already exsists with this email.'); window.location.href="/login/signup.html";</script>`);
        }

    } catch (error) {
        res.send(`<script>alert('Error saving user.'); window.location.href="/login/signup.html";</script>`);
        console.error('SignUp Error: ', error.message); // Log detailed error message
    }

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





app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});




// DATABASE STUFF

// Connsecting to database nooobsCars
mongoose.connect("mongodb://localhost/nooobsCars",)
    //If connected
    .then(() => console.log("Connected to MongoDB"))
    // If not connected
    .catch(err => console.error("Could not connect to MongoDB:", err));

// calling the function to save the new user in database
