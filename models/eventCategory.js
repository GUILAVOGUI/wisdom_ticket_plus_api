const mongoose = require('mongoose');

const eventCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true // Ensure category name is unique
    },
    creationDate: { type: Date, default: Date.now },

});

const EventCategory = mongoose.model('EventCategory', eventCategorySchema);

module.exports = EventCategory;
