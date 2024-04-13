const mongoose = require('mongoose');

const privacySchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        unique: true // Ensure privacy type is unique
    },
    creationDate: { type: Date, default: Date.now },


});

const Privacy = mongoose.model('Privacy', privacySchema);

module.exports = Privacy;
