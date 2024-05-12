const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const Transfers = require('../../models/old/transfer');

// Create Transfer
const createTransfer = async (req, res) => {
    // console.log('createTransfer');
    try {
        const transfer = new Transfers(req.body);
        console.log(transfer);
        await transfer.save();
        res.status(201).json(transfer);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
};

// Read All Transfers
const getAllTransfers = async (req, res) => {
    try {
        const transfers = await Transfers.find();
        res.status(200).json(transfers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Read One Transfer by ID
const getTransferById = async (req, res) => {
    try {
        const transfer = await Transfers.findById(req.params.id);
        if (!transfer) {
            res.status(404).json({ error: 'Transfer not found' });
            return;
        }
        res.status(200).json(transfer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Transfer
// const updateTransfer = async (req, res) => {
//     console.log('update transfer');
//     try {
//         const transfer = await Transfers.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         if (!transfer) {
//             res.status(404).json({ error: 'Transfer not found' });
//             return;
//         }
//         res.status(200).json(transfer);
//     } catch (error) {
//         console.log(error);
//         res.status(400).json({ error: error.message });
//     }
// };

// // Update Transfer
// const updateTransfer = async (req, res) => {
//     console.log('update transfer');
//     try {
//         const { depositStatus, withdrawStatus } = req.body;

//         let updatedFields = {};

//         if (depositStatus === 'Pending') {
//             // If depositStatus is set to Pending, update withdrawStatus to Pending
//             updatedFields = { withdrawStatus: 'Pending' };
//         } else if (depositStatus === 'Cancelled') {
//             // If depositStatus is set to Cancelled, update withdrawStatus to Cancelled
//             updatedFields = { withdrawStatus: 'Cancelled' };
//         }

//         if (withdrawStatus === 'Cancelled') {
//             // If withdrawStatus is set to Cancelled, update depositStatus to Cancelled
//             updatedFields = { depositStatus: 'Cancelled' };
//         }

//         if (withdrawStatus === 'Received') {
//             // If withdrawStatus is set to Cancelled, update depositStatus to Cancelled
//             updatedFields = { depositStatus: 'Received' };
//         }

//         // Update the transfer with the calculated fields
//         const transfer = await Transfers.findByIdAndUpdate(req.params.id, { ...req.body, ...updatedFields }, { new: true });

//         if (!transfer) {
//             res.status(404).json({ error: 'Transfer not found' });
//             return;
//         }

//         res.status(200).json(transfer);
//     } catch (error) {
//         console.log(error);
//         res.status(400).json({ error: error.message });
//     }
// };

// Update Transfer
const updateTransfer = async (req, res) => {
    console.log('update transfer');
    try {
        const { depositStatus, withdrawStatus } = req.body;

        let updatedFields = {};

        if (depositStatus === 'Pending') {
            // If depositStatus is set to Pending, update withdrawStatus to Pending
            updatedFields.withdrawStatus = 'Pending';
            updatedFields.transferStatus = 'Processing';
        } else if (depositStatus === 'Cancelled') {
            // If depositStatus is set to Cancelled, update withdrawStatus to Cancelled
            updatedFields.withdrawStatus = 'Cancelled';
            updatedFields.transferStatus = 'Cancelled';

        } else if (depositStatus === 'Received') {
            // If depositStatus is set to Cancelled, update withdrawStatus to Cancelled
            updatedFields.transferStatus = 'Processing';
            updatedFields.withdrawStatus = 'Pending';

        }

        if (withdrawStatus === 'Cancelled') {
            // If withdrawStatus is set to Cancelled, update depositStatus to Cancelled
            updatedFields.depositStatus = 'Cancelled';
            updatedFields.transferStatus = 'Cancelled';
        }

        if (withdrawStatus === 'Received') {
            // If withdrawStatus is set to Received, update depositStatus to Received
            updatedFields.depositStatus = 'Received';

            // Also update transferStatus to Completed
            updatedFields.transferStatus = 'Completed';
        }

        if (withdrawStatus === 'Pending') {
            // Also update transferStatus to Completed
            updatedFields.transferStatus = 'Processing';
        }

        // Update the transfer with the calculated fields
        const transfer = await Transfers.findByIdAndUpdate(req.params.id, { ...req.body, ...updatedFields }, { new: true });

        if (!transfer) {
            res.status(404).json({ error: 'Transfer not found' });
            return;
        }

        res.status(200).json(transfer);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
};





// Delete Transfer
const deleteTransfer = async (req, res) => {
    try {
        const transfer = await Transfers.findByIdAndDelete(req.params.id);
        if (!transfer) {
            res.status(404).json({ error: 'Transfer not found' });
            return;
        }
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createTransfer,
    getAllTransfers,
    getTransferById,
    updateTransfer,
    deleteTransfer,
};
