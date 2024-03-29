// routes/userRoutes.js

const express = require('express');
const router = express.Router();


const userController = require('../controllers/userController');
const authAdminMiddleware = require('../middleware/authAdminMiddleware')
const authMiddlewareUsers = require('../middleware/authMiddlewareUsers')
 


const checkAccess = (requiredEndpoint) => {
    return (req, res, next) => {
        const user = req.user; // Assuming req.user contains user information including accessList

        if (!user || !user.accessList) {
            // User does not have access to the required endpoint
            return res.status(403).json({ error: 'Access denied' });
        }

        if (!user.accessList.includes('allAccess') && !user.accessList.includes(requiredEndpoint)) {
            // User does not have access to the required endpoint
            return res.status(403).json({ error: 'Access denied' });
        }

        // User has access to the required endpoint, proceed to the next middleware
        next();
    };
};


router.post('/users', userController.createUser);
router.get('/users', authMiddlewareUsers, userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', userController.updateUserById);

// Admin
router.delete('/users/:id', authAdminMiddleware, userController.deleteUserById);

// Admin
router.put('/users/:id/adminupdateuser', authAdminMiddleware,userController.updateUserByIdByAdmin)

//   Special Actions
router.post('/users/:id/actions', userController.addAction);
router.delete('/users/:id/actions/:action', userController.removeAction);


// Login route
router.post('/users/login',  userController.login);



 

module.exports = router;
