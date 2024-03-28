// controllers/userController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();


const User = require('../../models/old/user');

 
const createUser = async (req, res) => {    
    try {

        // Destructure the required fields from the request body
        const { name, secretCode, tel,role} = req.body;
     
        const existingUser = await User.findOne({ tel: tel });

        if (existingUser) {
            // A user with this phone number already exists.
            res.status(400).json({ error: 'Phone number already registered' });
        } else {
            // Create the new user.
            // Check if the user is trying to create an admin role
            if (role && role.toLowerCase() !== 'client') {
                return res.status(400).json({ error: 'Error: Cannot create user with this role' });
            }
            // Rest of your code (hashing, token generation, saving user, and response) remains unchanged
            const saltRounds = 10;
            const hashedSecretCode = await bcrypt.hash(secretCode, saltRounds);


            const user = new User({ name, secretCode: hashedSecretCode, tel});
            // console.log(user);
            const tokenPayload = { userId: user._id, role: user.role, tel: user.tel };
            const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);

            user.token = token;
            // console.log(token);
            await user.save();
            // console.log(user);

            const userResponse = {
                _id: user._id,
                name: user.name,
                token: user.token,
                role: user.role,
                tel: user.tel,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };

            res.status(201).json({ ...userResponse, token });
        }

    } catch (error) {
        // res.status(500).json({ error: error.message });
        res.status(500).json({ error: 'Number already Registered | Cet Numero deja enregister' });
        // res.status(500).json('Number already Registered | Cet Numero deja enregister');
    }
};



// Admin Update user ID

const adminUpdateUserById = async (req, res) => {
    try {
        const updates = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if 'accessList' exists in the updates object and it's an array
        if (updates.accessList && Array.isArray(updates.accessList)) {
            // Append new values to the existing 'user.accessList' if it exists, or initialize it if it doesn't
            user.accessList = user.accessList ? [...user.accessList, ...updates.accessList] : updates.accessList;
        }

        // console.log('User.accessList (before update):', user.accessList);
        // console.log('Updates.accessList:', updates.accessList);

        if (updates.secretCode) {
            // If 'secretCode' field is present in req.body, hash it and save it to the user
            const saltRounds = 10;
            const hashedSecretCode = await bcrypt.hash(secretCode, saltRounds);
            user.secretCode = hashedSecretCode;
        }

        // Update the user with the new data (excluding 'accessList')
        delete updates.accessList; // Exclude 'accessList' from updates
        Object.assign(user, updates);
        await user.save();

        // Prepare the response object including the updated 'accessList'
        const responseUser = {
            _id: user._id,
            name: user.name,
            role: user.role,
            accessList: user.accessList, // Include the updated accessList
        };

        res.json(responseUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const removeAccessListItem = async (req, res) => {
    try {
        const tel = req.body.userTel // Assuming you pass the user ID in the URL or request parameters
        const itemIdToRemove = req.body.itemIdToRemove; // Assuming you send the item ID to remove in the request body
        // console.log(`userTel ${tel}, itemIdToRemove ${itemIdToRemove}`);
        // console.log('Removing item');
        // Use User.findOne() to find a user by their telephone number
        const user = await User.findOne({ tel });
        // console.log(user);

        if (!user) {
        
            return res.status(404).json({ error: 'User not found' });
        }

        // console.log('Removing item phase 2');

        // Check if 'accessList' exists in the user object and it's an array
        if (user.accessList && Array.isArray(user.accessList)) {
            // Find the index of the item to remove
            const indexToRemove = user.accessList.indexOf(itemIdToRemove);

            // If the item exists in the array, remove it
            if (indexToRemove !== -1) {
                user.accessList.splice(indexToRemove, 1);
            }
        }

        // Save the user with the updated 'accessList'
        await user.save();

        // Respond with the updated user object
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




// User Update their profile

const validateFields = (obj) => {
    const allowedFields = ['imageProfile', 'oldPassword', 'newPassword'];
    for (const key in obj) {
        if (!allowedFields.includes(key)) {
            return false; // Found an invalid field
        }
    }
    return true; // All fields are valid
};




// User udpate their information (profile Image, and secretCode)
const userUpdateOwnInfoById = async (req, res) => {
    // console.log('use userUpdateOwnInfo');
    try {
        const { imageProfile, oldPassword, newPassword } = req.body;
        const userId = req.id;


        // console.log(`olPassword ${oldPassword}, newPassword ${newPassword}, userId ${userId}`);

        const user = await User.findById(userId);

        // Validate the request body fields
        const isValidFields = validateFields(req.body);

        // console.log(`isValidFields ${isValidFields}`);

        if (!isValidFields) {
            return res.status(400).json({ error: 'Invalid fields in the request body.' });
        }


        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare the provided oldPassword with the hashed oldPassword in the database
        const isPasswordValid = await bcrypt.compare(oldPassword, user.secretCode);

        // console.log(`isPasswordValid: ${isPasswordValid}`);
     
        // Update user information
        if (imageProfile) {
            // If 'image' field is present in req.body, save it to the user
            user.imageProfile = imageProfile;
            // console.log('image profile updated');

        } 
           

        if (newPassword) {
            if (isPasswordValid) {
                 // If 'secretCode' field is present in req.body, hash it and save it to the user
            const saltRounds = 10;
            const hashedSecretCode = await bcrypt.hash(newPassword, saltRounds);
            user.secretCode = hashedSecretCode;
            // console.log('New password hashed successfully');
            } else {
                // console.log('invalid password');
                return res.status(401).json({ error: 'Invalid credentials' });

            }
           
        }  

        await user.save();

        // Prepare the response object including the updated 'accessList'
        const responseUser = {
            name: user.name,
            // secretCode: user.secretCode,
            // Include other user properties as needed
        };


        res.status(200).json({ success: 'User information updated successfully.' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

const userUpdateOwnImageById = async (req, res) => {
    // console.log('use userUpdateOwnInfo');
    try {
        const { imageProfile } = req.body;
        const userId = req.id;
        console.log(imageProfile);


        const user = await User.findById(userId);

        // Validate the request body fields
        const isValidFields = validateFields(req.body);

        // console.log(`isValidFields ${isValidFields}`);

        if (!isValidFields) {
            return res.status(400).json({ error: 'Invalid fields in the request body.' });
        }


        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Update user information
        if (imageProfile) {
            // If 'image' field is present in req.body, save it to the user
            user.imageProfile = imageProfile;
            // console.log('image profile updated');

        }
        await user.save();
        console.log(`user image ${user.imageProfile}`);


        res.status(200).json({ success: 'User information updated successfully.' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};




// Private : User Informations
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
 
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
        res.status(500).json({ error: error.message });
    }
};

// Admin Display all uses Informations
const getAllUsers = async (req, res) => {
    // console.log('getAllUsers');
    try {
   
        const users = await User.find()

        res.json({

            users,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




// Delete a user by ID (requires admin role)
const deleteUserById = async (req, res) => {
    try {
       
 
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            // console.log('User not found:', req.params.id);
            return res.status(404).json({ error: 'User not found' });
        }

        // console.log('User deleted successfully:', deletedUser._id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        // console.error('Error during delete user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};




// Login

const login = async (req, res) => {
    const { tel, secretCode } = req.body;

    // console.log('trying to login');

    try {
        // Check if the user with the provided phone number exists
        const user = await User.findOne({ tel });
        if (!user) {
            // console.log('Invalid credentials: User not found');
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare the provided secretCode with the hashed secretCode in the database
        const isPasswordValid = await bcrypt.compare(secretCode, user.secretCode);
        if (!isPasswordValid) {
            // console.log('Invalid credentials: Incorrect secret code');
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // If the credentials are valid, generate a new JWT token
        const tokenPayload = {
            userId: user._id,
            role: user.role,
            tel: user.tel, // Include the user's phone number in the token payload
            signature: user._id + process.env.JWT_SECRET // Include the custom signature
        };

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);

        // Save the token to the user object and update the user in the database
        user.token = token;
        await user.save();

        // console.log('User successfully logged in:', user._id);
        // console.log('Generated Token:', token); // Log the generated token

        const userID = user._id;
        const userName = user.name; // Include the user's name in the response
        const userToken = user.token; // Include the user's token in the response
        const userRole = user.role; // Include the user's role in the response
        const userSpecialRole = user.userSpecialRole; // Include the user's role in the response
        const userType = user.type; // Include the user's role in the response
        
        const imageProfile = user.imageProfile; // Include the user's role in the response


        res.header('Authorization', `Bearer ${token}`).json({ userID, userName, userToken, userRole, userType, userSpecialRole, imageProfile });
    } catch (error) {
        // console.log(error);
        // console.error('Error during login:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
};




// ADMIN to change the user's password
const changePasswordByAdmin = async (req, res) => {

    // console.log('changePasswordByAdmin');
    try {
        const { tel, newPassword, adminPassword } = req.body;


        // Check if valid Admin password
        const admin = req.user; // The authenticated user object should be available due to the authMiddleware

        const existingAdmin = await User.findById(admin._id);


        // Compare the provided secretCode with the hashed secretCode in the database
        const isPasswordValid = await bcrypt.compare(adminPassword, existingAdmin.secretCode);
        if (!isPasswordValid) {
            // console.log('Invalid credentials: Incorrect secret code');
            return res.status(401).json({ error: 'Not authorized' });
        }



        const user = await User.findOne({ tel });
        // console.log(user);
        if (!user) {
            // console.log('Invalid credentials: User not found');
            return res.status(401).json({ error: 'Invalid credentials' });
        }


        // Hash the newPassword using bcrypt before saving it to the database
        const saltRounds = 10; // You can adjust the number of salt rounds as per your preference
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update the user's password
        user.secretCode = hashedNewPassword;
        await user.save();

        res.json({ message: 'Password successfully changed' });
    } catch (error) {
        // console.error('Error during password change:', error);
        res.status(500).json({ error: 'Failed to change password' });
    }
};








module.exports = {
    createUser,
    adminUpdateUserById, 
    getUserById,
    getAllUsers,
    userUpdateOwnInfoById,
     deleteUserById,
    login,
    removeAccessListItem,
    changePasswordByAdmin, userUpdateOwnImageById

};
