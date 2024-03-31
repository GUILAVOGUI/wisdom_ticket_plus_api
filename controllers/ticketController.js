// ticketController.js
const Ticket = require('../models/ticketModel');

 
// Controller for creating a new ticket
exports.createTicket = async (req, res) => {
    try {
        const {
            listOfTicket,
            event,
            items,
            onResell,
            promoCode
        } = req.body;

        // Calculate totalAmount by summing up all prices in the listOfTicket array
        const totalAmount = listOfTicket.reduce((acc, ticket) => acc + ticket.price, 0);

        // Calculate totalShoppingAmount by summing up all prices in the items array
        const totalShoppingAmount = items.reduce((acc, item) => acc + item.price*item.quantity, 0);

        // Extract ticketOwner information from req.id and req.userName
        const ticketOwner = {
            userId: req.id,
            userName: req.userName
        };

        const newTicket = new Ticket({
            listOfTicket,
            ticketOwner,
            totalAmount,
            event,
            items,
            totalShoppingAmount,
            onResell,
            promoCode
        });

        const savedTicket = await newTicket.save();

        res.status(201).json({ status: 'success', data: savedTicket });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};


// Controller function for updating a ticket inside the listOfTicket array
exports.updateTicket = async (req, res) => {
    try {
        const ticketId = req.params.ticketId;
        const guestId = req.params.guestId;
        const updatedTicketData = req.body;

        // Find the ticket by ID and update its properties
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({ status: 'fail', message: 'Ticket not found' });
        }

        // Find the guest inside the listOfTicket array by ID and update its properties
        const guestIndex = ticket.listOfTicket.findIndex(guest => guest._id.toString() === guestId);

        if (guestIndex === -1) {
            return res.status(404).json({ status: 'fail', message: 'Guest not found in the ticket' });
        }

        // Update the guest properties
        ticket.listOfTicket[guestIndex] = {
            ...ticket.listOfTicket[guestIndex],
            ...updatedTicketData
        };

        // Save the updated ticket
        const updatedTicket = await ticket.save();

        res.status(200).json({ status: 'success', data: updatedTicket });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

