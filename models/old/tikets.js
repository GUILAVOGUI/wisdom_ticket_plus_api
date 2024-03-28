const mongoose = require('mongoose');

 

 

const ticketSchema = new mongoose.Schema({
    name: { type: String, required: true },
    status: { type: String, default: 'processing', enum: ['pending', 'processing', 'completed','cancelled'], required: false },
    typeOfTicket: { type: String, enum: ['complain', 'access',"forgotPassword"], required: false }, // Type of transaction
    date: { type: Date, default: Date.now },
    userName: { type: String, required: false },
    userTel: { type: String, required: false },
    ticketContent: { type: String, required: false },
    adminComment: { type: String, required: false },
});

const Tickets = mongoose.model('Tickets', ticketSchema);

module.exports = Tickets;
