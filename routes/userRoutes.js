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
router.get('/users', authAdminMiddleware, userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', userController.updateUserById);



router.get('/user/company',  authMiddlewareUsers,userController.getCompanyInfo);
router.put('/user/company',  authMiddlewareUsers,userController.updateCompanyInfo);



router.get('/user/userpreference', authMiddlewareUsers, userController.getUserPreference);
router.put('/user/userpreference', authMiddlewareUsers, userController.updateUserPreference);

// Admin
router.delete('/users/:id', authAdminMiddleware, userController.deleteUserById);

// Admin
router.put('/users/:id/adminupdateuser', authAdminMiddleware,userController.updateUserByIdByAdmin)

//   Special Actions
router.post('/users/:id/actions', userController.addAction);
router.delete('/users/:id/actions/:action', userController.removeAction);



// Define routes for adminTeamMember operations
router.post('/users/admin-team', authAdminMiddleware,userController.addUserToAdminTeam);

// Define route for fetching all users in the admin team
router.get('/admin/team/members', authAdminMiddleware, userController.getAllAdminTeamMembers);

// Route to remove a user from adminTeamMember
router.delete('/admin/team/member/:memberId', authAdminMiddleware,userController.removeUserFromAdminTeam);

router.put('/users/:userId/admin-team/:memberId', authAdminMiddleware,userController.updateUserInAdminTeam);
// router.delete('/users/:userId/admin-team/:memberId', authAdminMiddleware,userController.deleteUserFromAdminTeam);

// Define route to update user access level
router.put('/users/:userId/access-level', authAdminMiddleware, userController.updateUserAccessLevel);

// Define route to update user access level Abilities
router.put('/users/:userId/access-abilities', authAdminMiddleware, userController.updateUserAccessAbilities);




// Login route
router.post('/users/login',  userController.login);



 

module.exports = router;
