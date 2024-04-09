const Location = require('../models/location');

// Create a new location
exports.createLocation = async (req, res) => {
    try {
        const { country, location } = req.body;
        const existingLocation = await Location.findOne({ location });
        if (existingLocation) {
            return res.status(400).json({ message: 'Location already exists' });
        }
        const newLocation = new Location({ country, location });
        await newLocation.save();
        res.status(201).json(newLocation);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


// Get all locations
exports.getLocations = async (req, res) => {
    try {
        const locations = await Location.find();
        res.json(locations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a location
exports.updateLocation = async (req, res) => {
    try {
        const { country, location } = req.body;
        await Location.findByIdAndUpdate(req.params.id, { country, location });
        res.json({ message: 'Location updated' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a location
exports.deleteLocation = async (req, res) => {
    try {
        await Location.findByIdAndDelete(req.params.id);
        res.json({ message: 'Location deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
