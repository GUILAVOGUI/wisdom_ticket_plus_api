const Privacy = require('../models/privacy');

// Create a new privacy type
exports.createPrivacy = async (req, res) => {
    try {
        const { type } = req.body;
        const existingPrivacy = await Privacy.findOne({ type });
        if (existingPrivacy) {
            return res.status(400).json({ message: 'Privacy type already exists' });
        }
        const newPrivacy = new Privacy({ type });
        await newPrivacy.save();
        res.status(201).json(newPrivacy);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all privacy types
exports.getPrivacies = async (req, res) => {
    try {
        const privacies = await Privacy.find();
        res.json(privacies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a privacy type
exports.updatePrivacy = async (req, res) => {
    try {
        const { type } = req.body;
        await Privacy.findByIdAndUpdate(req.params.id, { type });
        res.json({ message: 'Privacy type updated' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a privacy type
exports.deletePrivacy = async (req, res) => {
    try {
        await Privacy.findByIdAndDelete(req.params.id);
        res.json({ message: 'Privacy type deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
