const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Controller for creating a new user

exports.createUser = async (req, res) => {
    try {
        const { email, phoneNumber, name, gender, dateOfBirth, password, type, secretCode, pinCode, agentCode } = req.body;

        // Check if a user with the same phone number already exists
        const existingUser = await User.findOne({ phoneNumber: phoneNumber });
        const existingUserByEmail = await User.findOne({ email: email });
        if (existingUser || existingUserByEmail) {
            return res.status(400).json({ error: 'Phone number/Email already registered' });
        }

        // Check if the user is trying to create an admin type
        if (type !== 'Normal User') {
            return res.status(400).json({ error: 'Error: Cannot create user with this type' });
        }

        // Hash secret code and PIN code
        const saltRounds = 10;
        const hashedSecretCode = await bcrypt.hash(secretCode, saltRounds);
        const hashedPINCode = await bcrypt.hash(pinCode, saltRounds);

        // Create user instance
        const user = new User({
            email,
            phoneNumber,
            name,
            gender,
            dateOfBirth,
            password,
            secretCode: hashedSecretCode,
            pinCode: hashedPINCode,
            agentCode
        });

        // Generate JWT token
        const tokenPayload = { userId: user._id, type: user.type, phoneNumber: user.phoneNumber };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);

        // Assign token to the user and save
        user.token = token;
        await user.save();

        res.status(201).json({ status: 'success', data: user, token });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Controller for getting all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ status: 'success', data: users });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// Controller for getting a single user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }
        res.status(200).json({ status: 'success', data: user });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// Controller for updating a user by ID
exports.updateUserById = async (req, res) => {
    try {
        const { type, purchaseHistory, notifications, transactionHistory, ...updateData } = req.body;
        // Exclude the fields that should not be updated
        const allowedUpdates = { ...updateData };

        const user = await User.findByIdAndUpdate(req.params.id, allowedUpdates, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }
        
        res.status(200).json({ status: 'success', data: user });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};


// Controller for deleting a user by ID
exports.deleteUserById = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};
