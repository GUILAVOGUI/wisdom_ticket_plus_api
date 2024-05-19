const Event = require('../models/eventModel');
const User = require('../models/userModel');

// Controller for creating a new event
exports.createEvent = async (req, res) => {
    // console.log('createEvent');
    try {
        const {
            eventDetails,
            privacy,
            addons,
            share,
            promo,
            status
        } = req.body;

        const ownerId = req.id; // Assuming the user ID is available in the request object
        const ownerName = req.userName; // Assuming the user name is available in the request object
        const ownerProfileImage = req.ownerProfileImage



        const event = await Event.create({
            eventDetails,
            privacy,
            addons,
            share,
            promo,
            status,
            ownerId,
            ownerName,
            ownerProfileImage,
            numberOfPurchase: 0, // Assuming this field is set to 0 initially
            numberOfLikes: 0, // Assuming this field is set to 0 initially
            shares: 0, // Assuming this field is set to 0 initially
            likes: 0, // Assuming this field is set to 0 initially
            ticketsSold: 0 // Assuming this field is set to 0 initially
        });
        // console.log(`success : data : ${event}`);

        res.status(201).json({ status: 'success', data: event });
    } catch (err) {
        console.log(err);
        res.status(400).json({ status: 'fail', message: err.message });
    }
};



// Controller for getting all events
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json({ status: 'success', data: events });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// Controller for getting a single event by ID
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ status: 'fail', message: 'Event not found' });
        }
        res.status(200).json({ status: 'success', data: event });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// Controller for updating an event by ID
exports.updateEventById = async (req, res) => {
    try {

        const userId = req.id; // Assuming userId is available in req.id
        const user = await User.findById(userId);
     

        const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!event) {
            return res.status(404).json({ status: 'fail', message: 'Event not found' });
        }

        if (String(event.ownerId) !== userId) {
            return res.status(403).json({ status: 'fail', message: 'Unauthorized access' });
        }


        res.status(200).json({ status: 'success', data: event });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Controller for deleting an event by ID
exports.deleteEventById = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ status: 'fail', message: 'Event not found' });
        }
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// Controller for adding attendeesFeedback
exports.addAttendeesFeedback = async (req, res) => {
    try {
        const { userInfo, content } = req.body;
        const eventId = req.params.eventId;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ status: 'fail', message: 'Event not found' });
        }

        event.attendeesFeedback.push({ userInfo, content });
        await event.save();

        res.status(200).json({ status: 'success', data: event });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};


// Controller for deleting attendeesFeedback
exports.deleteAttendeesFeedback = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const feedbackId = req.params.feedbackId;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ status: 'fail', message: 'Event not found' });
        }

        event.attendeesFeedback.pull({ _id: feedbackId });
        await event.save();

        res.status(200).json({ status: 'success', data: event });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};




// Controller for adding attendeesRates
exports.addAttendeesRate = async (req, res) => {
    try {
        const { userInfo, rate } = req.body;
        const eventId = req.params.eventId;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ status: 'fail', message: 'Event not found' });
        }

        event.attendeesRates.push({ userInfo, rate });
        await event.save();

        res.status(200).json({ status: 'success', data: event });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};



// Controller for deleting attendeesFeedback
exports.deleteAttendeesRate = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const rateId = req.params.rateId;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ status: 'fail', message: 'Event not found' });
        }

        event.attendeesRates.pull({ _id: rateId });
        await event.save();

        res.status(200).json({ status: 'success', data: event });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};



// Controller for adding promoCodes
exports.addPromoCode = async (req, res) => {
    try {
        const { code, validity } = req.body;
        const eventId = req.params.eventId;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ status: 'fail', message: 'Event not found' });
        }

        event.promoCodes.push({ code, validity });
        await event.save();

        res.status(200).json({ status: 'success', data: event });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};



// Controller for deleting promoCodes
exports.deletePromoCode = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const promoId = req.params.promoId;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ status: 'fail', message: 'Event not found' });
        }

        event.promoCodes.pull({ _id: promoId });
        await event.save();

        res.status(200).json({ status: 'success', data: event });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Controller for adding shopPartners
exports.addShopPartner = async (req, res) => {
    try {
        const shopId = req.body.shopId;
        const eventId = req.params.eventId;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ status: 'fail', message: 'Event not found' });
        }

        event.shopPartners.push(shopId);
        await event.save();

        res.status(200).json({ status: 'success', data: event });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Controller for deleting shopPartners
exports.deleteShopPartner = async (req, res) => {
    try {
        const shopId = req.params.shopId;
        const eventId = req.params.eventId;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ status: 'fail', message: 'Event not found' });
        }

        event.shopPartners.pull(shopId);
        await event.save();

        res.status(200).json({ status: 'success', data: event });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};



// Controller for adding a ticket to ticketsList
exports.addTicketToList = async (req, res) => {
    try {
        const { ticketId, ticketStatus, userInfo } = req.body;
        const eventId = req.params.eventId;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ status: 'fail', message: 'Event not found' });
        }

        event.ticketsList.push({ ticketId, ticketStatus, userInfo });
        await event.save();

        res.status(200).json({ status: 'success', data: event });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Controller for deleting a ticket from ticketsList
exports.deleteTicketFromList = async (req, res) => {
    try {
        const ticketId = req.params.ticketId;
        const eventId = req.params.eventId;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ status: 'fail', message: 'Event not found' });
        }

        const updatedTicketsList = event.ticketsList.filter(ticket => ticket.ticketId !== ticketId);
        event.ticketsList = updatedTicketsList;
        await event.save();

        res.status(200).json({ status: 'success', message: 'Ticket removed from list' });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Controller for adding a team member
exports.addTeamMember = async (req, res) => {
    try {
        const { memberStatus, memberRole,userInfo } = req.body;
        const eventId = req.params.eventId;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ status: 'fail', message: 'Event not found' });
        }

        event.teamMember.push({ memberStatus, memberRole, userInfo });
        await event.save();

        res.status(200).json({ status: 'success', data: event });
    } catch (err) {
        console.log(err);
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Controller for deleting a team member
exports.deleteTeamMember = async (req, res) => {
    try {
        const userId = req.params.userId;
        const eventId = req.params.eventId;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ status: 'fail', message: 'Event not found' });
        }

        const updatedTeamMembers = event.teamMember.filter(member => member.userInfo.userId !== userId);
        event.teamMember = updatedTeamMembers;
        await event.save();

        res.status(200).json({ status: 'success', message: 'Team member removed' });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Controller for adding a revenue
exports.addRevenue = async (req, res) => {
    try {
        const { amount, currency } = req.body;
        const eventId = req.params.eventId;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ status: 'fail', message: 'Event not found' });
        }

        let existingRevenue = event.revenues.find(revenue => revenue.currency === currency);

        if (existingRevenue) {
            existingRevenue.amount += amount;
        } else {
            event.revenues.push({ amount, currency });
        }

        await event.save();

        res.status(200).json({ status: 'success', data: event });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};


// Controller for deleting a revenue
exports.deleteRevenue = async (req, res) => {
    try {
        const revenueId = req.params.revenueId;
        const eventId = req.params.eventId;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ status: 'fail', message: 'Event not found' });
        }

        const updatedRevenues = event.revenues.filter(revenue => revenue._id !== revenueId);
        event.revenues = updatedRevenues;
        await event.save();

        res.status(200).json({ status: 'success', message: 'Revenue removed' });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};



// New controller function
exports.getUserEvents = async (req, res) => {
    console.log('getUserEvents');
    const userId = req.body.data.userId;
    console.log(userId);

    if (!userId) {
        return res.status(400).json({ status: 'error', message: 'User ID is required' });
    }

    try {
        const userEvents = await Event.find({ ownerId: userId });
        res.status(200).json({ status: 'success', data: userEvents });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};