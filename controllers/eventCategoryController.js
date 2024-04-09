const EventCategory = require('../models/eventCategory');

// Create a new event category
exports.createEventCategory = async (req, res) => {

    try {
        const { name } = req.body;
        const existingCategory = await EventCategory.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Event category already exists' });
        }
        const newCategory = new EventCategory({ name });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all event categories
exports.getEventCategories = async (req, res) => {
    // console.log('getEventCategories');

    try {
        const eventCategories = await EventCategory.find();
        res.json(eventCategories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update an event category
exports.updateEventCategory = async (req, res) => {
    try {
        const { name } = req.body;
        await EventCategory.findByIdAndUpdate(req.params.id, { name });
        res.json({ message: 'Event category updated' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete an event category
exports.deleteEventCategory = async (req, res) => {
    try {
        await EventCategory.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event category deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
