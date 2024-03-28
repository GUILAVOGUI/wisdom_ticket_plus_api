// routes/userRoutes.js

const express = require('express');
const router = express.Router();


const tasksController = require('../controllers/tasksController');
const authMiddlewareUsers = require('../../middleware/authMiddlewareUsers')
const authAdminMiddleware = require('../../middleware/authAdminMiddleware')
 





const checkAccess = (requiredEndpoint) => {
    console.log('check access');
    return (req, res, next) => {
        const user = req.user; // Assuming req.user contains user information including accessList

        if (!user || !user.accessList) {
            console.log(`user not authorized , not have ${requiredEndpoint}`);

            // User does not have access to the required endpoint
            return res.status(403).json({ error: 'Access denied' });
        }

        if (!user.accessList.includes('allAccess') && !user.accessList.includes(requiredEndpoint)) {
            // User does not have access to the required endpoint
            console.log('user not authorized , not have all access');

            return res.status(403).json({ error: 'Access denied' });
        }

        console.log(`user authorized for ${requiredEndpoint}`);


        // User has access to the required endpoint, proceed to the next middleware
        next();
    };
};


// Create task
router.post('/task/new', authMiddlewareUsers, checkAccess('createTask'), tasksController.createTasks);

 

// get by admin
router.get('/task/allTasks', authMiddlewareUsers, checkAccess('getAllTasks'), tasksController.getAllTasks);



// Admin update task
router.put('/task/update/:id', authMiddlewareUsers, checkAccess('updateTaskById'), tasksController.updateTaskById);




// Delete a goods tracking entry by ID
router.delete('/task/delete/:id', authMiddlewareUsers, checkAccess('deleteTaskTracking'), tasksController.deleteTakById);




 

module.exports = router;
