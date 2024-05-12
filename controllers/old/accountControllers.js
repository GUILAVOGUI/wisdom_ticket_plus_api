// Controllers.js

const Account = require('../models/account');

exports.createAccount = async (req, res) => {
    // const { name, id } = req.user;
    
    const name = req.userName
    const id = req.id

    try {
        const accountData = { ...req.body, createdBy: { name, id } };
        const account = await Account.create(accountData);
        res.status(201).json(account);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllAccount = async (req,res) => {

    try {
        const accounts = await Account.find()

        res.json(accounts)

    } catch( error) {
        res.status(500).json({message: error.message})
    }
}


// Get all Account Info
exports.getAllAccountsInfo = async (req, res) => {
    // console.log('getAllAccountsInfo');
    try {
        const userId = req.id;

        // Project only the required fields
        const accounts = await Account.find({ 'createdBy.id': userId });
        // const accounts = await Account.find({ 'createdBy.id': userId }, { name: 1, balance: 1, currency: 1, type: 1 });

        res.json(accounts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error getting banks' });
    }
};

// Users get their Account
exports.getAllAccountByUserId = async (req, res) => {
    const userId = req.id;

    try {
        const accounts = await Account.find({ 'createdBy.id': userId });

        res.json(accounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



exports.getAccountById = async (req, res) => {
    try {
        const account = await Account.findById(req.params.id);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        res.json(account);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateAccountById = async (req, res) => {
    try {
        const account = await Account.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        res.json(account);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteAccountById = async (req, res) => {
    try {
        const account = await Account.findByIdAndDelete(req.params.id);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
 
exports.createTransaction = async (req, res) => {
    // console.log('createTransaction');
    const { id } = req.params;
    const { amount, personName, comment, personTel } = req.body;

    try {
        const account = await Account.findById(id);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        // Determine whether to add or subtract from the balance based on the sign of the amount
        const transactionAmount = Math.abs(amount);
        let type;
        if (amount < 0 && (account.balance - transactionAmount) >= 0) {
            account.balance -= transactionAmount; // Subtract from the balance
            type = 'reduce'; // Set the type to 'reduce' for negative amounts
        } else if (amount > 0) {
            account.balance += transactionAmount; // Add to the balance
            type = 'add'; // Set the type to 'add' for positive amounts
        } else {
            return res.status(404).json({ message: 'Amount too big' });
        }

        // Add transaction to historic with the determined type
        // console.log(`person Tel ${personTel} `);
        account.historic.push({ amount: transactionAmount, personName, personTel, comment, type });

        await account.save();

        res.status(201).json(account);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.addToAccessList = async (req, res) => {
    const { id } = req.params;
    const { phoneNumber } = req.body;

    try {
        const account = await Account.findById(id);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        // Check if the phoneNumber already exists in accessList
        if (!account.accessList.includes(phoneNumber)) {
            account.accessList.push(phoneNumber);
            await account.save();
            return res.status(200).json(account);
        } else {
            return res.status(400).json({ message: 'Phone number already exists in accessList' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



exports.removeFromAccessList = async (req, res) => {
    const { id, phoneNumber } = req.params;

    try {
        const account = await Account.findById(id);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        // Check if the phoneNumber exists in accessList
        const index = account.accessList.indexOf(phoneNumber);
        if (index !== -1) {
            account.accessList.splice(index, 1);
            await account.save();
            return res.status(200).json(account);
        } else {
            return res.status(400).json({ message: 'Phone number not found in accessList' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Controller function to add a new member to an account
exports.addMemberToAccount = async (req, res) => {
    // console.log('addMemberToAccount');
    try {
        const { name, phoneNumber, address } = req.body;
        const account = await Account.findById(req.params.id);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        // Check if the phone number already exists in the account's members
        const phoneNumberExists = account.members.some(member => member.phoneNumber === phoneNumber);
        if (phoneNumberExists) {
            return res.status(400).json({ message: 'Phone number already exists in the account' });
        }

        // If the phone number is unique, add the member to the account
        account.members.push({ name, phoneNumber, address });
        await account.save();
        res.json(account);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 

exports.deleteMemberFromAccount = async (req, res) => {
    // console.log('deleteMemberFromAccount');
    try {
        const account = await Account.findById(req.params.id);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        const memberId = req.params.memberId;
        // console.log(`member id: ${memberId}`);

        // Find the member by ID within the account's members array
        const memberToDelete = account.members.find(member => member._id.toString() === memberId);

        // If memberToDelete is null, the member was not found in the account
        if (!memberToDelete) {
            return res.status(404).json({ message: 'Member not found in the account' });
        }

        // Remove the member from the account's members array
        account.members.pull(memberToDelete);

        // Save the account with the updated members array
        await account.save();

        res.json({ message: 'Member deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Controller function to update a member's information in an account
exports.updateMemberInfo = async (req, res) => {
    // console.log('updateMemberInfo');
    try {
        const memberId = req.params.memberId;

        // Find the account by ID
        const account = await Account.findById(req.params.id);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        // Find the member by ID within the account's members array
        const memberToUpdate = account.members.find(member => member._id.toString() === memberId);

        // If memberToUpdate is null, the member was not found in the account
        if (!memberToUpdate) {
            return res.status(404).json({ message: 'Member not found in the account' });
        }

        // Update member's information based on the fields received from the request
        for (const key in req.body) {
            if (req.body.hasOwnProperty(key)) {
                // Check if the field exists in the memberToUpdate object
                if (memberToUpdate.hasOwnProperty(key)) {
                    // console.log(`Updating ${key} from ${memberToUpdate[key]} to ${req.body[key]}`);
                    memberToUpdate[key] = req.body[key];
                } else {
                    // If the field doesn't exist, create it
                    // console.log(`Creating new field ${key} with value ${req.body[key]}`);
                    memberToUpdate[key] = req.body[key];
                }
            }
        }

        // Save the account with the updated member information
        await account.save();

        res.json({ message: 'Member information updated successfully', member: memberToUpdate });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

