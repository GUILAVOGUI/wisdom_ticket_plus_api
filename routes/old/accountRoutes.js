// Routes.js

const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountControllers');
const authMiddlewareUsers = require('../../middleware/authMiddlewareUsers');
const authAdminMiddleware = require('../../middleware/authAdminMiddleware')
const autthMiddlewareAdminPasswordChecker = require('../../middleware/autthMiddlewareAdminPasswordChecker');


// Admin Routes
router.get('/accounts', authAdminMiddleware, accountController.getAllAccount)




router.post('/accounts', authMiddlewareUsers,autthMiddlewareAdminPasswordChecker, accountController.createAccount);
router.get('/accounts/:id', accountController.getAccountById);
router.get('/ownaccounts', authMiddlewareUsers, accountController.getAllAccountByUserId)
router.put('/accounts/:id', accountController.updateAccountById);
router.post('/accounts/:id/newtransaction', authMiddlewareUsers, autthMiddlewareAdminPasswordChecker, accountController.createTransaction);
router.get('/accountsinfo', authMiddlewareUsers,  accountController.getAllAccountsInfo);

// Endpoint to add a number to accessList
router.post('/accounts/:id/accessList', accountController.addToAccessList);

// Endpoint to remove a number from accessList
router.delete('/accounts/:id/accessList/:phoneNumber', accountController.removeFromAccessList);


router.delete('/accounts/:id', authMiddlewareUsers,autthMiddlewareAdminPasswordChecker, accountController.deleteAccountById);


// Define routes
router.post('/accounts/:id/members', accountController.addMemberToAccount);
router.delete('/accounts/:id/members/:memberId', authMiddlewareUsers, autthMiddlewareAdminPasswordChecker, accountController.deleteMemberFromAccount);

// Define the route for updating member information
router.put('/accounts/:id/members/:memberId', authMiddlewareUsers, autthMiddlewareAdminPasswordChecker,accountController.updateMemberInfo);


module.exports = router;
