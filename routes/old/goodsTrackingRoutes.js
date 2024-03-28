const express = require('express');
const router = express.Router();
const goodsTrackingController = require('../controllers/goodsTrackingController');


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

const checkAccessForEmployee = (requiredEndpoint) => {
    return (req, res, next) => {
        const user = req.user; // Assuming req.user contains user information including accessList
        // console.log(user.type);
        // console.log('trypassing');

       if(!user.type !== 'employee') {
        // console.log('error'); 
           return res.status(403).json({ error: 'Access denied' });


       }

         

        // User has access to the required endpoint, proceed to the next middleware
        next();
    };
};


// Middlewares
const authMiddlewareUsers = require('../../middleware/authMiddlewareUsers')


// Create a new goods tracking entry
router.post('/goods-tracking/create', authMiddlewareUsers, checkAccess('createGoodsTracking'), goodsTrackingController.createGoodsTracking);

// Get all Goods Tracking
router.get('/goods-tracking/displayAll', authMiddlewareUsers, checkAccess('getAllGoods'), goodsTrackingController.getAllGoods);

// Get all Goods Tracking For user
router.get('/goods-tracking/usergoods/displayAll', authMiddlewareUsers, goodsTrackingController.getAllGoodsForUser);


// Get all Goods Tracking For Sender
router.get('/goods-tracking/sendergoods/displayAll', authMiddlewareUsers, goodsTrackingController.getAllGoodsForSender);



// Update an existing goods tracking entry by ID by ADMIN
router.put('/goods-tracking/updateByAdmin/:id', authMiddlewareUsers, checkAccess('updateGoodsTrackingByAdmin'), goodsTrackingController.updateGoodsTrackingByAdmin);


// Update an existing goods tracking entry by ID BY Sender
router.put('/goods-tracking/updateBySender/:id', authMiddlewareUsers, goodsTrackingController.updateGoodsTrackingBySender);



// Delete a goods tracking entry by ID
router.delete('/goods-tracking/delete/:id', authMiddlewareUsers, checkAccess('deleteGoodsTracking'), goodsTrackingController.deleteGoodsTracking);




module.exports = router;
