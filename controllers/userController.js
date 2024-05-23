const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Event = require('../models/eventModel');

// Controller for creating a new user

exports.createUser = async (req, res) => {

    console.log('createUser');
    try {
        const { email, phoneNumber, name, gender, dateOfBirth, password } = req.body;
        const type = 'Normal_User'
        // Check if a user with the same phone number already exists
        const existingUser = await User.findOne({ phoneNumber: phoneNumber });
        const existingUserByEmail = await User.findOne({ email: email });
        if (existingUser || existingUserByEmail) {
            return res.status(400).json({ error: 'Phone number/Email already registered' });
        }

        // Check if the user is trying to create an admin type
        if (type !== 'Normal_User') {
            return res.status(400).json({ error: 'Error: Cannot create user with this type' });
        }

        // Hash Password code and PIN code
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        // console.log(`hashedPassword ${hashedPassword}`);
        // Create user instance
        const user = new User({
            email,
            phoneNumber,
            name,
            gender,
            dateOfBirth,
            password: hashedPassword
        });

        // console.log(`user password ${user.password}`);

        // Generate JWT token
        const tokenPayload = { userId: user._id, type: user.type, phoneNumber: user.phoneNumber };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);

        // Assign token to the user and save
        user.token = token;
        await user.save();

        res.status(201).json({ status: 'success', data: user, token });
    } catch (err) {
        console.log(err);
        res.status(400).json({ status: 'fail', message: err.message });
    }
};


// Controller for login
// exports.login = async (req, res) => {
//     try {
//         const { phoneNumber, password } = req.body;

//         // Check if a user with the provided phone number exists
//         const user = await User.findOne({ phoneNumber });

//         if (!user) {
//             return res.status(401).json({ error: 'User not found' });
//         }

//         console.log('Stored Password Hash:', user.password); // Debugging statement
 
//         // Check if the provided password hash matches the stored password hash
//         const passwordMatch = await bcrypt.compare(password, user.password);
//         console.log(`passwordMatch ${passwordMatch}`);
//         if (!passwordMatch) {
//             return res.status(401).json({ error: 'Invalid password' });
//         }

//         // Generate JWT token
//         const tokenPayload = { userId: user._id, type: user.type, phoneNumber: user.phoneNumber };
//         const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);

//         // Update user's token and save
//         user.token = token;
//         await user.save();

//                 // Prepare response
//                 const { _id: userID, name: userName, token: userToken, role: userRole, userSpecialRole, type: userType, imageProfile } = user;
//                 const userIDString = String(userID); // Convert userID to a string
//                 const lastSixDigitsOfUserID = userIDString.slice(-6); // Extract the last 6 digits
//                 res.header('Authorization', `Bearer ${token}`).json({ userID: lastSixDigitsOfUserID, userName, userToken, userRole, userType, userSpecialRole, imageProfile });


//         res.status(200).json({ status: 'success', data: user, token });
//     } catch (err) {
//         res.status(400).json({ status: 'fail', message: err.message });
//     }
// };


exports.login = async (req, res) => {
    const { phoneNumber, password } = req.body;
    // console.log(`phoneNumber ${phoneNumber}`);
    // console.log(`password ${password}`);
    // console.log('login Endpoint');

    try {
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            // console.log('user not found');
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // console.log(user.password);

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            // console.log('invalid credentials');

            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const tokenPayload = {
            userId: user._id,
            role: user.role,
            phoneNumber: user.phoneNumber,
            signature: user._id + process.env.JWT_SECRET
        };

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);

        // Update user token
        user.token = token;
        await user.save();

        // const firstName = user.name.firstName
        // const lastName = user.name.lastName

        // Prepare response
        const { _id: userID, name, token: userToken, role: userRole, userSpecialRole, type: userType, userProfileImage } = user;
        // const userIDString = String(userID); // Convert userID to a string
        // const lastSixDigitsOfUserID = userIDString.slice(-6); // Extract the last 6 digits
        res.header('Authorization', `Bearer ${token}`).json({ userID: userID, name, userToken, userRole, userType, userSpecialRole, userProfileImage });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to login' });
    }
};



// Controller for getting all users
exports.getAllUsers = async (req, res) => {
    try {
        const userId = req.id
        // console.log(userId);
        const users = await User.find();
        res.status(200).json({ status: 'success', data: users });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};


// Controller to add a new event to the eventWishList
exports.addToEventWishList = async (req, res) => {
    try {
        const { eventId } = req.body;
        const userId = req.id;

        if (!eventId) {
            return res.status(400).json({ status: 'error', message: 'Event ID is required' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        // Check if the eventId already exists in the eventWishList
        const eventExists = user.eventWishList.some(event => event.eventId.toString() === eventId);

        if (eventExists) {
            return res.status(409).json({ status: 'error', message: 'Event already in wishlist' });
        }

        user.eventWishList.push({ eventId });
        await user.save();

        res.status(200).json({ status: 'success', data: user.eventWishList });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};


// Controller to remove an event from the eventWishList by eventId
exports.removeFromEventWishList = async (req, res) => {
    try {
        const { eventId } = req.body;
        const userId = req.id;

        if (!eventId) {
            return res.status(400).json({ status: 'error', message: 'Event ID is required' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        // Use MongoDB's $pull operator to remove the event with the given eventId
        await User.updateOne(
            { _id: userId },
            { $pull: { eventWishList: { eventId: eventId } } }
        );

        const updatedUser = await User.findById(userId);

        res.status(200).json({ status: 'success', data: updatedUser.eventWishList });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};



 
// Controller for getting all organizers with their total validated events
exports.getAllOrganizersWithEventCount = async (req, res) => {
    console.log('getAllOrganizersWithEventCount');
    try {
        // Fetch all users with type 'Organizer'
        const organizers = await User.find({ type: 'Organizer' });
        // console.log(organizers);
        // Initialize an array to hold the results
        const results = [];

        // Loop through each organizer and find their validated events
        for (const organizer of organizers) {
            const events = await Event.find({
                ownerId: organizer._id,
                status: 'Validated'
            });
            // console.log(events);

            // Add the organizer's data and the totalEvents count to the results array
            results.push({
                ...organizer.toObject(), // Convert mongoose document to plain object
                totalEvent: events.length
            });
        }

        res.status(200).json({ status: 'success', data: results });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// Controller for getting a single user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }
        res.status(200).json({ status: 'success', data: user });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// Controller for getting a single user by ID
exports.adminGetUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }
        res.status(200).json({ status: 'success', data: user });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// Controller for updating a user by ID
exports.updateUserById = async (req, res) => {
    try {
        const { type, purchaseHistory, notifications, transactionHistory, ...updateData } = req.body;
        // Exclude the fields that should not be updated
        const allowedUpdates = { ...updateData };

        const user = await User.findByIdAndUpdate(req.params.id, allowedUpdates, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }
        
        res.status(200).json({ status: 'success', data: user });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Admin Controller for updating a user by ID
exports.updateUserByIdByAdmin = async (req, res) => {
    console.log('updateUserByIdByAdmin');
    try {
        const updateData = req.body;
        console.log(`updateData ${updateData}`);

        const user = await User.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });
        console.log(`user status ${user ? user.status : 'not found'}`);

        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }
        console.log('updateUserByIdByAdmin Successfully');

        res.status(200).json({ status: 'success', data: user });
    } catch (err) {
        console.log(err);
        res.status(400).json({ status: 'fail', message: err.message });
    }
};


// Controller for deleting a user by ID
exports.deleteUserById = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};



// Controller for adding an action to a user
exports.addAction = async (req, res) => {
    try {
        const userId = req.params.id;
        const { action } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }

        user.actions.push(action);
        await user.save();

        res.status(200).json({ status: 'success', message: 'Action added to the user' });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Controller for removing an action from a user
exports.removeAction = async (req, res) => {
    try {
        const userId = req.params.id;
        const actionToRemove = req.params.action;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }

        user.actions = user.actions.filter(action => action !== actionToRemove);
        await user.save();

        res.status(200).json({ status: 'success', message: 'Action removed from the user' });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
 


// Controller for getting company info
exports.getCompanyInfo = async (req, res) => {
    console.log('getCompanyInfo');
    try {
        const userId = req.id
        // console.log(userId);
        const user = await User.findById(userId);
        if (!user || !user.companyProfile) {
            return res.status(404).json({ status: 'error', message: 'Company info not found for this user' });
        }
        res.status(200).json({ status: 'success', data: user.companyProfile });
        // console.log(user.companyProfile);
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
};


// Controller for getting user preference info
exports.getUserPreference = async (req, res) => {

    console.log('getUserPreference');
    try {
        const userId = req.id
        // console.log(userId);
        const user = await User.findById(userId);
        // if (!user ) {
        //     console.log('Company info not found for this user');
        //     return res.status(404).json({ status: 'error', message: 'Company info not found for this user' });
        // }
        res.status(200).json({ status: 'success', data: user.userPreference });
        // console.log(`data sent ${user.userPreference}`);
    } catch (err) {
        console.log(err);
    
        res.status(500).json({ status: 'error', message: err.message });
    }
};


// Controller for updating user preference info
exports.updateUserPreference = async (req, res) => {

    console.log(`updateUserPreference`);
    try {

        const userId = req.id

        const { language, timezone, region } = req.body;
        // console.log(language);
        const user = await User.findByIdAndUpdate(userId, { userPreference: { language, timezone, region } }, { new: true });
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }
        res.status(200).json({ status: 'success', data: user.userPreference });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// Controller for updating company info
exports.updateCompanyInfo = async (req, res) => {
    try {

        const userId = req.id

        const { logoImageLink, name, address, contactPhone, contactEmail } = req.body;
        // console.log(logoImageLink);
        const user = await User.findByIdAndUpdate(userId, { companyProfile: { logoImageLink, name, address, contactPhone, contactEmail } }, { new: true });
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }
        res.status(200).json({ status: 'success', data: user.companyProfile });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};



// Controller for adding a user to adminTeamMember
exports.addUserToAdminTeam = async (req, res) => {
    console.log('addUserToAdminTeam');
    try {
        const userId = req.userId;

        const { memberStatus, userInfo } = req.body;
        // console.log(userId);

        const user = await User.findById(userId);

        if (!user) {
            console.log('User not found');
            return res.status(404).json({ error: 'User not found' });
        }
        // console.log(memberStatus);
        // console.log(userInfo);

        // Check if the user already exists in the adminTeamMember array
        const existingMember = user.adminTeamMember.find(member => member.userInfo.userId.toString() === userInfo.userId);

        if (existingMember) {
            console.log('User is already in admin team');
            return res.status(400).json({ error: 'User is already in admin team' });
        }

        // If the user doesn't exist in the adminTeamMember array, find them by userId
        const userToAdd = await User.findById(userInfo.userId);

        if (!userToAdd) {
            console.log('User to add not found');
            return res.status(404).json({ error: 'User to add not found' });
        }

        // Update the inAdminTeam field for the user to true
        userToAdd.inAdminTeam = true;
        await userToAdd.save();

        console.log(`userToAdd.inAdminTeam  ${userToAdd.inAdminTeam}`);
        console.log(`userToAdd.name  ${userToAdd.name }`);

        // Add the user to the adminTeamMember array
        user.adminTeamMember.push({ memberStatus, userInfo });
        await user.save();

        res.status(200).json({ status: 'success' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// Controller for removing a user from adminTeamMember
exports.removeUserFromAdminTeam = async (req, res) => {
    console.log('removeUserFromAdminTeam');
    try {
        const userId = req.userId;

        const { memberId } = req.params; // Assuming memberId is passed as a parameter in the URL
        console.log(userId);

        const user = await User.findById(userId);

        if (!user) {
            console.log('User not found');
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the member to remove exists in the adminTeamMember array
        const memberIndex = user.adminTeamMember.findIndex(member => member.userInfo.userId.toString() === memberId);

        if (memberIndex === -1) {
            console.log('Member not found in admin team');
            return res.status(400).json({ error: 'Member not found in admin team' });
        }

        // Retrieve the user to remove from the admin team
        const userToRemove = await User.findById(memberId);

        if (!userToRemove) {
            console.log('User to remove not found');
            return res.status(404).json({ error: 'User to remove not found' });
        }

        // Update the inAdminTeam field for the user to false
        userToRemove.inAdminTeam = false;
        await userToRemove.save();

        // Remove the member from the adminTeamMember array
        user.adminTeamMember.splice(memberIndex, 1);
        await user.save();

        res.status(200).json({ status: 'success' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
};

 

exports.getAllAdminTeamMembers = async (req, res) => {
    try {
        // Fetch the current user's ID from the request
        const userId = req.userId;

        // Find the current user
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Fetch all admin team members
        const adminTeamMembers = user.adminTeamMember;

        // Prepare array to store processed admin team members data
        const processedAdminTeamMembers = [];

        // Iterate through admin team members
        for (const member of adminTeamMembers) {
            // Find user details using userInfo.userId
            const userDetails = await User.findById(member.userInfo.userId);

            if (!userDetails) {
                // Skip if user details not found
                continue;
            }

            // Extract necessary fields from member and userDetails
            const { memberStatus, userInfo } = member;
            const { accessList } = userDetails;

            // Initialize filteredAccessList to store filtered access
            const filteredAccessList = {};

            // Iterate through accessList to find activated access
            for (const [accessKey, accessValue] of Object.entries(accessList)) {
                if (accessValue.isActive) {
                    // Add activated access to filteredAccessList
                    filteredAccessList[accessKey] = accessValue;
                }
            }

            // Add necessary fields and filtered accessList to user details
            const processedMember = {
                memberStatus,
                userInfo,
                accessList: filteredAccessList
            };

            // Push processed member to processedAdminTeamMembers array
            processedAdminTeamMembers.push(processedMember);
        }

        // Return the processed admin team members with necessary fields and filtered accessList
        res.status(200).json({ status: 'success', data: processedAdminTeamMembers });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
};



exports.updateUserAccessLevel = async (req, res) => {
    try {
        // Extract user ID from request parameters
        const { userId } = req.params;

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Extract the access level to activate from request body
        const { accessLevel } = req.body;

        // Check if the requested access level is valid
        if (!['Super_Admin', 'EventManagementAdmin', 'CommunicationAdmin', 'SupportAdmin', 'AnalyticsAdmin', 'FinanceAdmin'].includes(accessLevel)) {
            return res.status(400).json({ error: 'Invalid access level' });
        }

        // Deactivate the current activated access level
        const currentActivatedLevel = Object.keys(user.accessList).find(level => user.accessList[level].isActive);
        if (currentActivatedLevel) {
            user.accessList[currentActivatedLevel].isActive = false;
        }

        // Activate the requested access level in the user's access list
        user.accessList[accessLevel].isActive = true;

        // Save the updated user
        await user.save();

        // Return success response
        res.status(200).json({ status: 'success', message: 'Access level updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
};



exports.updateUserAccessAbilities = async (req, res) => {
    try {
        // Extract user ID from request parameters
        const { userId } = req.params;

        // Extract the level and abilities from request body
        const { level, abilities } = req.body;

        console.log(`userId ${userId}`);
        console.log(`level ${level}`);
        console.log(`abilities ${JSON.stringify(abilities)}`);

        // Update the abilities of the requested level
        const update = {};
        for (const abilityKey in abilities) {
            if (Object.hasOwnProperty.call(abilities, abilityKey)) {
                const newValue = abilities[abilityKey];
                // Construct the update object for nested fields
                update[`accessList.${level}.abilities.${abilityKey}`] = newValue;
            }
        }

        // Use findOneAndUpdate to update the nested fields
        const result = await User.findByIdAndUpdate(
            userId,
            { $set: update },
            { new: true } // Return the updated document
        );

        if (!result) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return success response
        res.status(200).json({ status: 'success', message: 'Access abilities updated successfully' });
    } catch (err) {
        // console.error(err);
        console.log(`err.message ${err.message}`);
        res.status(500).json({ status: 'error', message: err.message });
    }
};



// Controller for updating a user in adminTeamMember
exports.updateUserInAdminTeam = async (req, res) => {
    try {
        const { userId, memberId } = req.params;
        const { memberStatus, userInfo } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const memberIndex = user.adminTeamMember.findIndex(member => member._id == memberId);

        if (memberIndex === -1) {
            return res.status(404).json({ error: 'User not found in adminTeamMember' });
        }

        user.adminTeamMember[memberIndex] = { memberStatus, userInfo };
        await user.save();

        res.status(200).json({ status: 'success', data: user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
};


// Controller for deleting a user from adminTeamMember
exports.deleteUserFromAdminTeam = async (req, res) => {
    try {
        const { userId, memberId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const updatedAdminTeamMember = user.adminTeamMember.filter(member => member._id != memberId);
        user.adminTeamMember = updatedAdminTeamMember;

        await user.save();

        res.status(200).json({ status: 'success', data: user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
};
