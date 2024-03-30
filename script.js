const mongoose = require("mongoose")
const User = require("./user")

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// using static files to use with express
app.use(express.static('login'));
app.use(express.static('./'));

// Middleware to parse the body of HTTP requests
app.use(express.urlencoded({ extended: true }));

// Route to handle GET request
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login/signup.html');
});

// Route to handle the form submission
app.post('/submit-form', async (req, res) => {
    try {
        const { email, fullname, password, updates} = req.body;
        await saveToDb(email, fullname, password, updates);

        // res.send('Form submitted and user saved.');
        res.send(`<script>alert('Form submitted and user saved.'); window.location.href="/";</script>`);

    } catch (error) {
        res.send(`<script>alert('Error saving user.'); window.location.href="/";</script>`);
        // console.error('Detailed error: ', error.message); // Log detailed error message
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

async function saveToDb(Email, name, password, updates) {

    // checking if the updates checkbox is checked or not 
    const wantsUpdates = updates ? true : false;

    // Creating a new user
    const user = new User({ Email: Email, Name: name, Password: password, Updates: wantsUpdates })

    // Saving the user into the database
    await user.save()
}