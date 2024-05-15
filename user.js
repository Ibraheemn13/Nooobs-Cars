const mongoose = require("mongoose")

// creating a schema for signup page
const userSchema = new mongoose.Schema({
    Email: {
        type: String,
        required: true,
        lowercase: true
    },
    Name: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    CreatedAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true
    },
    Updates: {
        type: Boolean,
        default:false
    }    
})

// Exporting the model to use it in other files
module.exports = mongoose.model("User", userSchema)
