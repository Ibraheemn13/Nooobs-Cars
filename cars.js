const mongoose = require("mongoose")

// creating a schema for cars
const carsSchema = new mongoose.Schema({
    CarName: {
        type: String,
        required: true
    },
    ModelYear: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    Image1: {
        data: Buffer,
        contentType: String
    },
    Image2: {
        data: Buffer,
        contentType: String
    },
    Image3: {
        data: Buffer,
        contentType: String
    },
    Image4: {
        data: Buffer,
        contentType: String
    },
    Image5: {
        data: Buffer,
        contentType: String
    },
})

// Exporting the model to use it in other files
module.exports = mongoose.model("Cars", carsSchema)
