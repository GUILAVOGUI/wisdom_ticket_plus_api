// controllers/userController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();


const Task = require('../../models/old/tasks');

 
const createTasks = async (req, res) => {    
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


// Get all Tasks
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Get a task by ID
const getATaskById = async (req, res) => {
    try {
        res.json(res.task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



// Update a task by ID
const updateTaskById = async (req, res) => {
    console.log('Updating a ticket by ID');
    try {
        const { id } = req.params; // Get the ticket ID from request parameters
        console.log(id);

        // Check if the ticket exists
        const task = await Task.findById(id);

        console.log(`task ${task}`);

        if (!task) {
            return res.status(404).json({ error: 'task not found' });
        }

        console.log(`previous task.deadline  = ${task.deadline}`);
        console.log(`previous task.closingDate  = ${task.closingDate}`);

        console.log(`req.body.closingDate  = ${req.body.closingDate}`);
        console.log(`req.body.deadline  = ${req.body.deadline}`);
        // Update the task data
       task.taskName = req.body.taskName  || task.taskName,
       task.actions = req.body.actions  || task.actions,
       task.progress = req.body.progress  || task.progress,
       task.status = req.body.status  || task.status,
       task.supplier = req.body.supplier  || task.supplier,
       task.responsible = req.body.responsible  || task.responsible,
       task.quantity = req.body.quantity  || task.quantity,
       task.unitPrice = req.body.unitPrice  || task.unitPrice,
       task.totalAmount = req.body.totalAmount  || task.totalAmount,
       task.deadline = req.body.deadline   || task.deadline,
       task.closingDate = req.body.closingDate  || task.closingDate,
           task.remark = req.body.remark || task.remark,
           task.date = req.body.date || task.date,


            console.log(`current  task.deadline  = ${task.deadline}`);
        console.log(`current  task.closingDate  = ${task.closingDate}`);

        // Save the updated task
        await task.save();

        // Return the updated task data
        res.json({ task });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error updating the task' });
    }
};




// Delete a task by ID
const deleteTakById = async (req, res) => {
    try {
        const deleteTask = await Task.findByIdAndRemove(req.params.id);
        if (!deleteTask) {
            return res.status(404).json({ error: 'Task  entry not found' });
        }
        res.json({ message: 'delete successfully' });
        res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Unable to delete Task  entry' });
    }
};


 
module.exports = {
createTasks,
getAllTasks,
updateTaskById,
getATaskById,
deleteTakById

};
