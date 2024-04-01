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


// Controller for getting all tickets
exports.getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find();
        res.status(200).json({ status: 'success', data: tickets });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

 
// Controller for finding tickets by user ID in listOfTicket guest _id
exports.findTicketsByUserId = async (req, res) => {
    try {
        const userId = String(req.id); // Convert req.id to string
        console.log(`userId ${userId}`);

        let tickets = await Ticket.find({ 'listOfTicket.guest.userId': userId });

        // Remove guest info where userId does not exist in listOfTicket
        tickets = tickets.map(ticket => {
            const filteredListOfTicket = ticket.listOfTicket.filter(ticket => String(ticket.guest.userId) === userId); // Convert ticket.guest.userId to string
            const filteredItems = ticket.items.filter(item => String(item.userInfo.userId) === userId); // Convert item.userInfo.userId to string
            return {
                _id: ticket._id,
                listOfTicket: filteredListOfTicket,
                event: ticket.event,
                items: filteredItems
            };
        });

        res.status(200).json({ status: 'success', data: tickets });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
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


// // Controller for replacing a guest in a ticket and updating associated items
// exports.replaceGuestInTicket = async (req, res) => {
//     try {
//         const { ticketId, guestId } = req.params;
//         const { guest } = req.body;

//         // Find the ticket by ID
//         const ticket = await Ticket.findById(ticketId);
//         if (!ticket) {
//             return res.status(404).json({ status: 'fail', message: 'Ticket not found' });
//         }

//         // Update the guest in the ticket
//         const updatedTicket = await Ticket.findOneAndUpdate(
//             { _id: ticketId, 'listOfTicket._id': guestId },
//             { $set: { 'listOfTicket.$.guest': guest } },
//             { new: true }
//         );

//         // Update associated items with the new guest information
//         if (updatedTicket.items && updatedTicket.items.length > 0) {
//             updatedTicket.items.forEach(item => {
//                 if (item.userInfo.userId === guestId) {
//                     item.userInfo = guest;
//                 }
//             });
//         }

//         // Save the updated ticket
//         const savedTicket = await updatedTicket.save();

//         res.status(200).json({ status: 'success', data: savedTicket });
//     } catch (err) {
//         console.log(err);
//         res.status(400).json({ status: 'fail', message: err.message });
//     }
// };


// Controller to find and replace a guest by ticket ID and user ID
exports.findAndReplaceGuest = async (req, res) => {
    try {
        const ticketId = req.params.ticketId;
        const userId = req.params.userId; // Get userId from req.params
        const newGuestInfo = req.body;

        // Find the ticket by its ID
        let ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({ status: 'fail', message: 'Ticket not found' });
        }

        // Find the index of the ticket guest with the given userId
        const index = ticket.listOfTicket.findIndex(ticket => String(ticket.guest.userId) === userId);

        if (index === -1) {
            return res.status(404).json({ status: 'fail', message: 'Guest not found in ticket' });
        }

        // Check if isTicketScannedSuccess is true for the guest
        if (ticket.listOfTicket[index].isTicketScannedSuccess) {
            return res.status(401).json({ status: 'fail', message: 'Not authorized to replace scanned guest' });
        }

        // Replace the guest info with the new guest info
        ticket.listOfTicket[index].guest = newGuestInfo;

        // Save the updated ticket
        await ticket.save();

        res.status(200).json({ status: 'success', data: ticket });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};
