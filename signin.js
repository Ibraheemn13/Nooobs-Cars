const mongoose = require("mongoose")
const User = require("./user")

async function signInFun(Email, password) {


    const existingUser = await User.findOne({ Email: Email });
    console.log(existingUser.Password)

    if (existingUser) {

        //const DbPass = await User.findOne({ Email: Email }, {Password:1});

        const DbPass = existingUser.Password;
        if (DbPass === password) {
            console.log("User logged in with email:", Email);
            return 1;
        }
        else {
            console.log("Wrong Password");
            return 0;
        }        
    }

    console.log("User not registered");

    return 0;
}

module.exports = { signInFun };