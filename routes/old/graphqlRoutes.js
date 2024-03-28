// route.js
const express = require('express');
const router = express.Router();

const authAdminMiddleware = require('../../middleware/authAdminMiddleware')
const authMiddlewareUsers = require('../../middleware/authMiddlewareUsers')
const autthMiddlewareAdminPasswordChecker = require('../../middleware/autthMiddlewareAdminPasswordChecker')



const { getFamilyTree, createFamilyTree, createUser,
     getFamilyTreeById, login, 
     userUpdateOwnInfoById,
    userUpdateOwnImageById, editNode,
    deleteNode, deleteUserById,
    checkIfUserTelAlreadyRegister,
    addUserToSharedGraphAccessList,
    removeUserFromSharedGraphAccessList,
    getPublicFigureFamilyTreeById,
    getPublicUsersList, getSharedFamilyTreeById,
    getUserListWithNames,
    getAllUsers, adminUpdateUserById, getUserNodesAndLinks
        
    } = require('../controllers/graphqlControllers');

// Define routes
router.get('/familytree', getFamilyTree);

router.get('/familytree/byId', authMiddlewareUsers, getFamilyTreeById);

router.get('/familytree/public/:id', getPublicFigureFamilyTreeById);


router.get('/familytree/shared/:id', getSharedFamilyTreeById);


router.get('/familytree/publicList', getPublicUsersList);

//-- Admin display all users informations
router.get('/allusers/info', authMiddlewareUsers, getAllUsers);


// --- Admin update user informations
router.put('/user/update/:id', authAdminMiddleware, adminUpdateUserById);



// --- Admin delete a User
router.delete('/user/delete/:id', authMiddlewareUsers, deleteUserById);




// Login route
router.post('/login', login);




router.post('/familytree', createFamilyTree);
router.post('/users', createUser); // Add this line for the createUser endpoint

// Add user to sharedGraphAccessUserList
router.post('/addUserToSharedGraph', authMiddlewareUsers, addUserToSharedGraphAccessList);

// Remove user from sharedGraphAccessUserList
router.post('/removeUserFromSharedGraph', authMiddlewareUsers, removeUserFromSharedGraphAccessList);


// get User List With Names from sharedGraphAccessUserList
router.get('/getUserListWithNames', authMiddlewareUsers, getUserListWithNames);



// getUserNodesAndLinks sharedGraphAccessUserList
router.get('/getUserNodesAndLinks', authMiddlewareUsers, getUserNodesAndLinks);





// User update own Info
router.put('/user/updateOwn', authMiddlewareUsers, userUpdateOwnInfoById);

router.put('/user/updateOwnImage', authMiddlewareUsers, userUpdateOwnImageById);

router.post('/checkIfUserTelAlreadyRegister', checkIfUserTelAlreadyRegister);

router.put('/editNode',  editNode);
router.delete('/deleteNode', autthMiddlewareAdminPasswordChecker, deleteNode);

// Add more routes for updating and deleting family tree

module.exports = router;
