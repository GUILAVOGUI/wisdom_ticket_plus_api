const Bank = require('../models/bank');

// Create a new bank
// const createBank = async (req, res) => {
    // console.log('createBank');
//     try {
//         const newBankData = req.body;
//         const newBank = new Bank(newBankData);
//         await newBank.save();
//         res.status(201).json(newBank);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Error creating the bank' });
//     }
// };

const createBank = async (req, res) => {
    // console.log('createBank');
    try {
        const { imagebannerLink, ...otherData } = req.body;

        let newBank;

        // Ensure that the required field (imagebannerLink) is present in req.body
        if (!imagebannerLink) {
            newBank = new Bank({
                ...otherData, // Spread the rest of the data
                imagebannerLink: 'https://res.cloudinary.com/dxkvkr8ns/image/upload/v1702405031/emyh4kcva3jexxk2v43s.png', // Set imagebannerLink from req.body
            });
        } else {
            newBank = new Bank({
                ...otherData, // Spread the rest of the data
                imagebannerLink, // Set imagebannerLink from req.body
            });
        }

        // console.log(newBank);
        await newBank.save();

        res.status(201).json(newBank);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating the bank' });
    }
};




// Get all banks
const getAllBanks = async (req, res) => {
    try {
        const banks = await Bank.find();
        res.json(banks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error getting banks' });
    }
};


// Get all banks Info
const getAllBanksInfo = async (req, res) => {
    try {
        // Project only the required fields
        const banks = await Bank.find({}, { name: 1, imagebannerLink: 1, balances: 1 });

        res.json(banks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error getting banks' });
    }
};



// Get a specific bank by name
const getBankByName = async (req, res) => {
    try {
        const bankName = req.params.name;
        const bank = await Bank.findOne({ name: bankName });
        if (bank) {
            res.json(bank);
        } else {
            res.status(404).json({ message: 'Bank not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error getting bank by name' });
    }
};

// Update bank details
const updateBank = async (req, res) => {
    try {
        const bankName = req.params.name;
        const updatedBankData = req.body;
        const updatedBank = await Bank.findOneAndUpdate({ name: bankName }, updatedBankData, { new: true });
        if (updatedBank) {
            res.json(updatedBank);
        } else {
            res.status(404).json({ message: 'Bank not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating bank' });
    }
};

// Delete a bank
const deleteBank = async (req, res) => {
    try {
        const bankName = req.params.name;
        const deletedBank = await Bank.findOneAndDelete({ name: bankName });
        if (deletedBank) {
            res.json({ message: 'Bank deleted successfully' });
        } else {
            res.status(404).json({ message: 'Bank not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting bank' });
    }
};


// // // Create a new deposit transaction
// const createDeposit = async (req, res) => {
    // console.log(`creating deposit transaction`);
//     try {
//         const bankName = req.params.name;
//         const depositData = req.body;
//         const bank = await Bank.findOne({ name: bankName });

//         if (!bank) {
//             return res.status(404).json({ message: 'Bank not found' });
//         }

//         const depositTransaction = {
//             ...depositData,
//             date: new Date(),
//         };
        // console.log(`depositTransaction: ${JSON.stringify(depositTransaction)}`);

//         // Ensure the currency is initialized in the balance object
//         if (!bank.balances[depositTransaction.transactionCurrency]) {
//             bank.balances[depositTransaction.transactionCurrency] = 0;
//         }

//         bank.transactions.deposit.push(depositTransaction);
//         bank.balances[depositTransaction.transactionCurrency] += depositTransaction.amount;

//         await bank.save();

//         res.status(201).json(bank.transactions.deposit);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Error creating deposit transaction' });
//     }
// };

// // Create a new deposit transaction
// const createDeposit = async (req, res) => {
    // console.log(`creating deposit transaction`);
//     try {
//         const bankName = req.params.name;
//         const depositData = req.body;
        // console.log(`depositData = ${JSON.stringify(depositData)}`);
//         const bank = await Bank.findOne({ name: bankName });

//         if (!bank) {
//             return res.status(404).json({ message: 'Bank not found' });
//         }

//         const depositTransaction = {
//             ...depositData,
//             date: new Date(),
//         };
        // console.log(`depositTransaction: ${depositTransaction}`);

//         // Ensure the currency is initialized in the balance object
//         if (!bank.balances[depositTransaction.transactionCurrency]) {
//             bank.balances[depositTransaction.transactionCurrency] = 0;
//         }

//         bank.transactions.deposit.push(depositTransaction);

//         // Properly convert the amount to a numeric format
//         const depositAmount = parseFloat(depositTransaction.amount);

//         bank.balances[depositTransaction.transactionCurrency] += depositAmount;

//         await bank.save();

//         res.status(201).json(bank.transactions.deposit);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Error creating deposit transaction' });
//     }
// };




// Create a new withdrawal transaction
const createWithdrawal = async (req, res) => {
    try {
        const bankName = req.params.name;
        const withdrawalData = req.body;
        const userName = req.userName; // The authenticated user object should be available due to the authMiddleware
        const userTel = req.tel; // The authenticated user object should be available due to the authMiddleware



        const bank = await Bank.findOne({ name: bankName });

        if (!bank) {
            return res.status(404).json({ message: 'Bank not found' });
        }

        const withdrawAmount = parseFloat(withdrawalData.amount);

        const withdrawalTransaction = {
            ...withdrawalData,
            date: new Date(),
            userName: userName,
            userTel: userTel,
            amount: withdrawAmount, // Update the amount field
        };

        // Ensure the currency is initialized in the balance object
        if (!bank.balances[withdrawalTransaction.transactionCurrency]) {
            bank.balances[withdrawalTransaction.transactionCurrency] = 0;
        }

        bank.transactions.withdraw.push(withdrawalTransaction);
        bank.balances[withdrawalTransaction.transactionCurrency] -= withdrawalTransaction.amount;

        await bank.save();

        res.status(201).json(bank.transactions.withdraw);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating withdrawal transaction' });
    }
};


// // Delete a withdrawal transaction by ID
// const deleteWithdrawal = async (req, res) => {
//     try {
//         const bankName = req.params.name;
//         const withdrawalId = req.params.id;

//         const bank = await Bank.findOne({ name: bankName });

//         if (!bank) {
//             return res.status(404).json({ message: 'Bank not found' });
//         }

//         const withdrawalTransaction = bank.transactions.withdraw.id(withdrawalId);

//         if (!withdrawalTransaction) {
//             return res.status(404).json({ message: 'Withdrawal transaction not found' });
//         }

//         // Remove the withdrawal transaction
//         withdrawalTransaction.remove();

//         await bank.save();

//         res.json({ message: 'Withdrawal transaction deleted successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Error deleting withdrawal transaction' });
//     }
// };

// Delete a withdrawal transaction by ID
const deleteWithdrawal = async (req, res) => {
    // console.log('deleteWithdrawal');
    try {
        const bankName = req.params.name;
        const withdrawalId = req.params.id;

        const bank = await Bank.findOne({ name: bankName });

        if (!bank) {
            return res.status(404).json({ message: 'Bank not found' });
        }

        const withdrawalIndex = bank.transactions.withdraw.findIndex(
            (withdrawal) => withdrawal._id.toString() === withdrawalId
        );

        if (withdrawalIndex === -1) {
            return res.status(404).json({ message: 'Withdrawal transaction not found' });
        }

        // Store the amount before removing the withdrawal transaction
        const removedAmount = bank.transactions.withdraw[withdrawalIndex].amount;

        // Set back the removed amount to the balance
        bank.balances[bank.transactions.withdraw[withdrawalIndex].transactionCurrency] += removedAmount;

        // Remove the withdrawal transaction
        bank.transactions.withdraw.splice(withdrawalIndex, 1);

        await bank.save();

        res.json({ message: 'Withdrawal transaction deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting withdrawal transaction' });
    }
};




const createDeposit = async (req, res) => {
    // console.log(`creating deposit transaction`);
    try {
        const userName = req.userName; // The authenticated user object should be available due to the authMiddleware
        const userTel = req.tel; // The authenticated user object should be available due to the authMiddleware
        // console.log('step 0');
        // console.log(userName, userTel);
        const bankName = req.params.name;
        const depositData = req.body;
        // console.log(`depositData = ${JSON.stringify(depositData)}`);
        const bank = await Bank.findOne({ name: bankName });
        // console.log('step 1');

        if (!bank) {
            return res.status(404).json({ message: 'Bank not found' });
        }

        // console.log('step 2');

        // Ensure the currency is initialized in the balance object
        if (!bank.balances[depositData.transactionCurrency]) {
            bank.balances[depositData.transactionCurrency] = 0;
        }

        // console.log('step 3');

        // Properly convert the amount to a numeric format
        const depositAmount = parseFloat(depositData.amount);

        // Validate each transaction in the deposit array
        // console.log(`depositData.amount = ${depositData.amount}`);
        if (!userName || !userTel || !depositData.amount || !depositData.transactionCurrency) {
            console.error('Error: Missing required fields in depositData');
            return res.status(400).json({ error: 'Missing required fields in depositData' });
        }


        const depositTransaction = {
            ...depositData,
            date: new Date(),
            userName: userName,
            userTel: userTel,
            amount: depositAmount, // Update the amount field
        };

        // console.log(`depositTransaction ${JSON.stringify(depositTransaction)}`);

        // Check if userName, userTel, amount, and transactionCurrency are present and not empty
        if (userName && userTel && depositData.amount && depositData.transactionCurrency) {
            const depositTransaction = {
                ...depositData,
                date: new Date(),
                amount: depositAmount,
                userName: userName,
                userTel: userTel
            };
            // console.log('step 4');

            // Push the new deposit transaction
            bank.transactions.deposit.push(depositTransaction);
            bank.balances[depositData.transactionCurrency] += depositAmount;
            // console.log('step 5');

            // Save the updated bank document
            await bank.save();

            res.status(201).json(bank.transactions.deposit);
        } else {
            // console.log('step 6');

            // Log an error and return a response with status 400
            console.error('Error: Missing required fields in depositData');
            res.status(400).json({ error: 'Missing required fields in depositData' });
        }

    } catch (error) {
        // console.log('step 7');
        // console.log(error);
        console.error('Error creating deposit transaction:', error);
        res.status(500).json({ error: 'Error creating deposit transaction' });
    }
};


// // Delete a deposit transaction by ID
// const deleteDeposit = async (req, res) => {
//     try {
//         const bankName = req.params.name;
//         const depositId = req.params.id;

//         const bank = await Bank.findOne({ name: bankName });

//         if (!bank) {
//             return res.status(404).json({ message: 'Bank not found' });
//         }

//         const depositTransaction = bank.transactions.deposit.id(depositId);

//         if (!depositTransaction) {
//             return res.status(404).json({ message: 'Deposit transaction not found' });
//         }

//         // Remove the deposit transaction
//         depositTransaction.remove();

//         await bank.save();

//         res.json({ message: 'Deposit transaction deleted successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Error deleting deposit transaction' });
//     }
// };


// Delete a deposit transaction by ID
const deleteDeposit = async (req, res) => {
    try {
        const bankName = req.params.name;
        const depositId = req.params.id;

        const bank = await Bank.findOne({ name: bankName });

        if (!bank) {
            return res.status(404).json({ message: 'Bank not found' });
        }

        const depositIndex = bank.transactions.deposit.findIndex(
            (deposit) => deposit._id.toString() === depositId
        );

        if (depositIndex === -1) {
            return res.status(404).json({ message: 'Deposit transaction not found' });
        }

        // Store the amount before removing the deposit transaction
        const removedAmount = bank.transactions.deposit[depositIndex].amount;

        // Set back the removed amount to the balance
        bank.balances[bank.transactions.deposit[depositIndex].transactionCurrency] -= removedAmount;

        // Remove the deposit transaction
        bank.transactions.deposit.splice(depositIndex, 1);

        await bank.save();

        res.json({ message: 'Deposit transaction deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting deposit transaction' });
    }
};


// Update a withdrawal transaction by ID
const updateWithdrawal = async (req, res) => {
    try {
        const bankName = req.params.name;
        const withdrawalId = req.params.id;
        const updateData = req.body;

        const bank = await Bank.findOne({ name: bankName });

        if (!bank) {
            return res.status(404).json({ message: 'Bank not found' });
        }

        const withdrawalTransaction = bank.transactions.withdraw.id(withdrawalId);

        if (!withdrawalTransaction) {
            return res.status(404).json({ message: 'Withdrawal transaction not found' });
        }

        // Update the withdrawal transaction
        Object.assign(withdrawalTransaction, updateData);

        await bank.save();

        res.json(withdrawalTransaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating withdrawal transaction' });
    }
};


// Update a deposit transaction by ID
const updateDeposit = async (req, res) => {
    try {
        const bankName = req.params.name;
        const depositId = req.params.id;
        const updateData = req.body;

        const bank = await Bank.findOne({ name: bankName });

        if (!bank) {
            return res.status(404).json({ message: 'Bank not found' });
        }

        const depositTransaction = bank.transactions.deposit.id(depositId);

        if (!depositTransaction) {
            return res.status(404).json({ message: 'Deposit transaction not found' });
        }

        // Update the deposit transaction
        Object.assign(depositTransaction, updateData);

        await bank.save();

        res.json(depositTransaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating deposit transaction' });
    }
};








module.exports = {
    createBank,
    getAllBanks,
    getAllBanksInfo,
    getBankByName,
    updateBank,
    deleteBank,
    createWithdrawal,
    createDeposit,
    updateWithdrawal,
    deleteWithdrawal,
    updateDeposit,
    deleteDeposit,
};
