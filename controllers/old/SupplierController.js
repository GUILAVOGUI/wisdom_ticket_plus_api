const Supplier = require('../models/Supplier');


// Create a new supplier
exports.createSupplier = async (req, res) => {
    try {
        // Check if the name already exists
        const existingSupplier = await Supplier.findOne({ name: req.body.name });
        if (existingSupplier) {
            return res.status(400).json({ error: 'Supplier with this name already exists' });
        }

        // If the name doesn't exist, create a new supplier
        const newSupplier = new Supplier(req.body);
        await newSupplier.save();
        res.status(201).json(newSupplier);
    } catch (error) {
        console.error('Error creating supplier:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Add credit to supplier balance
exports.creditBalance = async (req, res) => {
    // console.log('creditBalance');
    const { transactionType, currency, products, comment, date, imagebannerLink } = req.body;
    const { tel, userName } = req; // Assuming tel and userName are properties of req
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) {
            return res.status(404).json({ error: 'Supplier not found' });
        }

        // Calculate the amount based on products (sum of total product unit price * quantity)
        const amount = products.reduce((total, product) => total + product.unitPrice * product.quantity, 0);

        // Update supplier balance and add transaction for the specified currency
        supplier.balance[currency] += amount;
        supplier.balanceTransactions.push({
            transactionType,
            amount,
            products,
            status: 'credit',
            registerBy: `${userName} (${tel})`,
            currency: currency,
            comment, // Store comment in the transaction
            date: date,
            imagebannerLink: imagebannerLink

        });

        await supplier.save();
        res.status(200).json(supplier);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
// Add remboursement to reduce supplier balance
exports.remboursementBalance = async (req, res) => {
    const { transactionType, currency, products, manualAmount, comment, date, imagebannerLink } = req.body;
    const { tel, userName } = req; // Assuming tel and userName are properties of req

    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) {
            return res.status(404).json({ error: 'Supplier not found' });
        }

        // Ensure products is an array and calculate the amount based on products
        const amount = Array.isArray(products)
            ? products.reduce((total, product) => total + (product.unitPrice || 0) * (product.quantity || 0), 0)
            : 0;

        // Check if manualAmount exists, use it as the amount
        const remboursementAmount = manualAmount || amount;

        // Check if there is enough balance for remboursement
        if (supplier.balance[currency] < remboursementAmount) {
            return res.status(400).json({ error: 'Insufficient balance for remboursement' });
        }

        // Update supplier balance and add transaction for the specified currency
        supplier.balance[currency] -= remboursementAmount;
        supplier.balanceTransactions.push({
            transactionType,
            amount: remboursementAmount,
            products,
            status: 'remboursement',
            registerBy: `${userName} (${tel})`,
            manualAmount, // Store manualAmount in the transaction
            comment, // Store comment in the transaction
            currency: currency,
            date: date,
            imagebannerLink: imagebannerLink


        });

        await supplier.save();
        res.status(200).json(supplier);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};




// Get all suppliers
exports.getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.status(200).json(suppliers);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get a specific supplier by ID
exports.getSupplierById = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) {
            return res.status(404).json({ error: 'Supplier not found' });
        }
        res.status(200).json(supplier);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update a supplier by ID
exports.updateSupplierById = async (req, res) => {
    try {
        const updatedSupplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSupplier) {
            return res.status(404).json({ error: 'Supplier not found' });
        }
        res.status(200).json(updatedSupplier);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete a supplier by ID
exports.deleteSupplierById = async (req, res) => {
    try {
        const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);
        if (!deletedSupplier) {
            return res.status(404).json({ error: 'Supplier not found' });
        }
        res.status(200).json(deletedSupplier);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
