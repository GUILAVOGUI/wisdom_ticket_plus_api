// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now,
    }, 
    deadline: {
        type: Date,
    }, 
    closingDate: {
        type: Date,
    }, 
    taskName: String,
    actions: {
        type: String, // Using a text data type to allow new lines and paragraphs
        trim: true, // Remove leading and trailing white spaces
    },
    progress: String,
    status: String,
    supplier: String,
    responsible: String,
    quantity: Number,
    unitPrice: Number,
    totalAmount: Number,
    remark: String,
});

module.exports = mongoose.model('Task', taskSchema);
