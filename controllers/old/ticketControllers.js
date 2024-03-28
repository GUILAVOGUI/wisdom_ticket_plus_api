// controllers/userController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();


const Tickets = require('../../models/old/tikets');

 
const createTickets = async (req, res) => {    
    try {    

        // const {user} = req.user

        const userName = req.userName 
        const userTel = req.tel      


        const ticketData = {
            ...req.body, // Spread the properties from req.body
            userName: userName,
            userTel: userTel,
        };

        const ticket = new Tickets(ticketData);

        // console.log(ticket);

        await ticket.save();

        // console.log(ticket);

            const ticketResponse = {
                _id: ticket._id,
                name: ticket.name,
                createdAt: ticket.createdAt,
            };

            res.status(201).json({ ...ticketResponse });
    

    } catch (error) {
        // res.status(500).json({ error: error.message });
        // console.log(error);
        res.status(500).json({ error: 'error creating the ticket' });
        // res.status(500).json('Number already Registered | Cet Numero deja enregister');
    }
};




// const createForgetPasswordTickets = async (req, res) => {

    // console.log('submitForgetPasswordTickets...');
//     try {

//         // const {user} = req.user

       
//         const typeOfTicket = "forgotPassword"
//         const name = "forgot Password"


//         const ticketData = {
//             ...req.body, // Spread the properties from req.body
//             typeOfTicket: typeOfTicket,
//             name: name,
//         };

//         const ticket = new Tickets(ticketData);

        // console.log(ticket);

//         await ticket.save();

        // console.log(ticket);

//         const ticketResponse = {
//             _id: ticket._id,
//             name: ticket.name,
//             createdAt: ticket.createdAt,
//         };

        // console.log('ticket forgot password submitted successfully');

//         res.status(201).json({ ...ticketResponse });




//     } catch (error) {
//         // res.status(500).json({ error: error.message });
        // console.log(error);
//         res.status(500).json({ error: 'error creating the ticket' });
//         // res.status(500).json('Number already Registered | Cet Numero deja enregister');
//     }
// };

const createForgetPasswordTickets = async (req, res) => {
    // console.log('submitForgetPasswordTickets...');
    try {
        const typeOfTicket = "forgotPassword";
        const name = "forgot Password";
        // console.log(req.body);
        // console.log(req.body.userTel);
        const existingTicket = await Tickets.findOne({
            userTel: req.body.userTel, // Assuming userTel is the field you want to check
            typeOfTicket: typeOfTicket,
            date: {
                $gte: new Date(Date.now() - 60 * 60 * 1000).toISOString() // Within the last hour
            }
        });

        // console.log(existingTicket);

        if (existingTicket) {
            // Found an existing ticket within the last hour
            // console.log('Existing "forgot password" ticket found within the last hour.');
            return res.status(400).json({ error: 'An existing "forgot password" ticket was submitted within the last hour.' });
        }

        const ticketData = {
            ...req.body, // Spread the properties from req.body
            typeOfTicket: typeOfTicket,
            name: name,
        };

        const ticket = new Tickets(ticketData);

        // console.log(ticket);

        await ticket.save();

        // console.log(ticket);

        const ticketResponse = {
            _id: ticket._id,
            name: ticket.name,
            createdAt: ticket.createdAt,
        };

        // console.log('Ticket "forgot password" submitted successfully');

        res.status(201).json({ ...ticketResponse });
    } catch (error) {
        // console.log(error);
        res.status(500).json({ error: 'Error creating the ticket' });
    }
};



// Get all Budgets By admin
const getAllTicketByAdmin = async (req, res) => {
    try {
       
        const tickets = await Tickets.find()

        res.json({

            tickets,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Get all Budgets for a User
const getAllTicketByUser = async (req, res) => {
    // console.log('getAllTicketByUser');
    try {

        const tickets = await Tickets.find()
        const userTickets = tickets.filter((item) => item.userTel === req.tel);

        res.json({

            userTickets,
        });
    } catch (error) {
        // console.log(error);
        res.status(500).json({ error: error.message });
    }
};


// Update a ticket by ID
const updateTicketById = async (req, res) => {

    console.log('Updating a ticket by ID');
    try {
        const { id } = req.params; // Get the ticket ID from request parameters

        // Check if the ticket exists
        const ticket = await Tickets.findById(id);

        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        // Update the ticket data
        ticket.name = req.body.name || ticket.name;
        ticket.status = req.body.status || ticket.status;
        ticket.typeOfTicket = req.body.typeOfTicket || ticket.typeOfTicket;
        ticket.adminComment = req.body.adminComment || ticket.adminComment;
        // Update other properties as needed

        // Save the updated ticket
        await ticket.save();

        // Return the updated ticket data
        res.json({ ticket });
    } catch (error) {
        // console.log(error);
        res.status(500).json({ error: 'Error updating the ticket' });
    }
};

// Delete a Ticket tracking entry by ID

const deleteTicket = async (req, res) => {
    try {
        const deleteTicket = await Tickets.findByIdAndRemove(req.params.id);
        if (!deleteTicket) {
            return res.status(404).json({ error: 'Ticket  entry not found' });
        }
        res.json({ message: 'delete successfully' });
        res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Unable to delete Ticket  entry' });
    }
};



// ... (other functions)

module.exports = {
    createTickets,
    getAllTicketByAdmin,
    getAllTicketByUser,
    updateTicketById, // Add the new function for updating a ticket
    createForgetPasswordTickets,
    deleteTicket
};