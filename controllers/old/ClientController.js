const Client = require('../models/Client');


// Create a new client
exports.createClient = async (req, res) => {
    console.log('createClient');
    try {
        // Check if the name already exists
        const existingClient = await Client.findOne({ name: req.body.name });
        if (existingClient) {
            return res.status(400).json({ error: 'Client with this name already exists' });
        }

        // If the name doesn't exist, create a new client
        const newClient = new Client(req.body);
        await newClient.save();
        res.status(201).json(newClient);
    } catch (error) {
        console.error('Error creating client:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Add credit to client balance
exports.creditBalance = async (req, res) => {
    console.log('creditBalance');
    const { transactionType, currency, products, comment, date, imagebannerLink } = req.body;
    const { tel, userName } = req; // Assuming tel and userName are properties of req
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }

        // Calculate the amount based on products (sum of total product unit price * quantity)
        const amount = products.reduce((total, product) => total + product.unitPrice * product.quantity, 0);

        // Update client balance and add transaction for the specified currency
        client.balance[currency] += amount;
        client.balanceTransactions.push({
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

        await client.save();
        res.status(200).json(client);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
// Add remboursement to reduce client balance
exports.remboursementBalance = async (req, res) => {
    const { transactionType, currency, products, manualAmount, comment, date, imagebannerLink } = req.body;
    const { tel, userName } = req; // Assuming tel and userName are properties of req

    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }

        // Ensure products is an array and calculate the amount based on products
        const amount = Array.isArray(products)
            ? products.reduce((total, product) => total + (product.unitPrice || 0) * (product.quantity || 0), 0)
            : 0;

        // Check if manualAmount exists, use it as the amount
        const remboursementAmount = manualAmount || amount;

        // Check if there is enough balance for remboursement
        if (client.balance[currency] < remboursementAmount) {
            return res.status(400).json({ error: 'Insufficient balance for remboursement' });
        }

        // Update client balance and add transaction for the specified currency
        client.balance[currency] -= remboursementAmount;
        client.balanceTransactions.push({
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

        await client.save();
        res.status(200).json(client);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};




// Get all clients
exports.getAllClients = async (req, res) => {
    console.log('getAllClients');
    try {
        const clients = await Client.find();
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get a specific client by ID
exports.getClientById = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update a client by ID
exports.updateClientById = async (req, res) => {
    try {
        const updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedClient) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.status(200).json(updatedClient);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete a client by ID
exports.deleteClientById = async (req, res) => {
    try {
        const deletedClient = await Client.findByIdAndDelete(req.params.id);
        if (!deletedClient) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.status(200).json(deletedClient);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
