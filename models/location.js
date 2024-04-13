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
    },
    creationDate: { type: Date, default: Date.now },

});

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
