const mongoose = require("mongoose");

const apartmentSchema = new mongoose.Schema({
    rooms: {
        type: Number,
        require: true,
    },
    apartmentName: {
        type: String,
        require: true,
    },
    price: {
        type: Number,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
});

module.exports = mongoose.model("Apartment", apartmentSchema);
