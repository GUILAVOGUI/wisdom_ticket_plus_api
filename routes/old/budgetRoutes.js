// routes/userRoutes.js

const express = require('express');
const router = express.Router();


const budgetController = require('../controllers/budgetController');
const authAdminMiddleware = require('../../middleware/authAdminMiddleware')
const authMiddlewareUsers = require('../../middleware/authMiddlewareUsers')
 





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



// Create Budget
router.post('/budget', authMiddlewareUsers,checkAccess('createBudget'),  budgetController.createBudget);

router.get('/budget/list', authMiddlewareUsers, checkAccess('getAllBudget'), budgetController.getAllBudget);
// router.get('/budget/list', budgetController.getAllBudget);


 
 

module.exports = router;
