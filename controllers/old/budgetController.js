// controllers/userController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();


const Budget = require('../models/old/old/budget');

 
const createBudget = async (req, res) => {    
    try {

        // Destructure the required fields from the request body
        const { name} = req.body;
     
        const existingBudget = await Budget.findOne({ name: name });

        if (existingBudget) {
            // A user with this phone number already exists.
            res.status(400).json({ error: 'this Budget Already register' });
        } else {

            const budget = new Budget(req.body);
            // console.log(budget);
           
            await budget.save();
            // console.log(budget);

            const budgetResponse = {
                _id: budget._id,
                name: budget.name,
                createdAt: budget.createdAt,
            };

            res.status(201).json({ ...budgetResponse });
        }

    } catch (error) {
        // res.status(500).json({ error: error.message });
        console.log(error);
        res.status(500).json({ error: 'Name already exists' });
        // res.status(500).json('Number already Registered | Cet Numero deja enregister');
    }
};


// Get all Budgets
const getAllBudget = async (req, res) => {
    try {
       
        const budgets = await Budget.find()

        res.json({

            budgets,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


 
module.exports = {
    createBudget, getAllBudget

};
