const mongoose = require("mongoose")
const User = require("./user")

async function saveToDb(Email, name, password, updates) {

    // checking if the updates checkbox is checked or not 
    const wantsUpdates = updates ? true : false;


    const existingUser = await User.findOne({ Email: Email });

    if (existingUser) {
        console.log("User already exists with email:", Email);
        
        return 0; 
    }


    // Creating a new user
    const user = new User({ Email: Email, Name: name, Password: password, Updates: wantsUpdates })




    // Saving the user into the database
    await user.save()
    return 1;
}

module.exports = { saveToDb };