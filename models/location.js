const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    country: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true,
        unique: true // Ensure location is unique
    }
});

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
