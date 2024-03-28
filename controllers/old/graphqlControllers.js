
// // controllers/userController.js
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// require('dotenv').config();
// // controller.js
// const Graphql = require('../models/graphql');


// // Controller functions for CRUD operations
// const getFamilyTree = async (req, res) => {
//     try {
//         const graphql = await Graphql.findOne();
//         res.json(graphql);
//     } catch (error) {
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

 

// const login = async (req, res) => {
//     const { tel, secretCode } = req.body;

//     try {
//         const user = await Graphql.findOne({ tel });
//         if (!user) {
//             return res.status(401).json({ error: 'Invalid credentials' });
//         }

//         const isPasswordValid = await bcrypt.compare(secretCode, user.secretCode);
//         if (!isPasswordValid) {
//             return res.status(401).json({ error: 'Invalid credentials' });
//         }

//         const tokenPayload = {
//             userId: user._id,
//             role: user.role,
//             tel: user.tel,
//             signature: user._id + process.env.JWT_SECRET
//         };

//         const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);

//         if (user.role !== 'admin') {
//             user.token = token;
//             await user.save();
//         }

//         // const { _id: userID, name: userName, token: userToken, role: userRole, userSpecialRole, type: userType, imageProfile } = user;

//         // res.header('Authorization', `Bearer ${token}`).json({ userID, userName, userToken, userRole, userType, userSpecialRole, imageProfile });

//         const { _id: userID, name: userName, token: userToken, role: userRole, userSpecialRole, type: userType, imageProfile, accessList } = user;
//         const userIDString = String(userID); // Convert userID to a string
//         const lastSixDigitsOfUserID = userIDString.slice(-6); // Extract the last 6 digits
//         res.header('Authorization', `Bearer ${token}`).json({ userID: lastSixDigitsOfUserID, userName, userToken, userRole, userType, userSpecialRole, imageProfile, accessList });

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: 'Failed to login' });
//     }
// };



// const getFamilyTreeById = async (req, res) => {
//     console.log('getFamilyTreeById');
//     try {
//         const userId  = req.userId;

//         console.log(`userId: ${userId}`);

//         // Find the user by ID
//         const user = await Graphql.findById(userId);

//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         // Optionally, you can populate specific fields that exist in the schema
//         // await user.populate('nodes').execPopulate();
//         // await user.populate('links').execPopulate();

//         res.json(user);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };


// // const getPublicFigureFamilyTreeById = async (req, res) => {
// //     console.log('getPublicFigureFamilyTreeById');
// //     try {
// //         const userId = req.params.id; // Extract userId from params

// //         console.log(`userId: ${userId}`);

// //         // Find the user by ID
// //         const user = await Graphql.findById(userId);

// //         if (!user) {
// //             return res.status(404).json({ error: 'User not found' });
// //         }

// //         // Optionally, you can populate specific fields that exist in the schema
// //         // await user.populate('nodes').execPopulate();
// //         // await user.populate('links').execPopulate();

// //         res.json(user);
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ error: 'Internal Server Error' });
// //     }
// // };




// // const createFamilyTree = async (req, res) => {
// //     try {
// //         const { nodes, links, tel } = req.body;

// //         // Validate that nodes and links are provided
// //         if (!nodes || !links) {
// //             return res.status(400).json({ error: 'Nodes and links are required' });
// //         }

// //         // Find the user by tel
// //         const user = await Graphql.findOne({ tel });

// //         if (!user) {
// //             // If user does not exist, return an error
// //             return res.status(404).json({ error: 'User not found' });
// //         }

// //         // Append only non-existing nodes to the existing nodes
// //         nodes.forEach((newNode) => {
// //             // Check if the node with the same id already exists
// //             const existingNode = user.nodes.find((node) => node.id === newNode.id);
// //             if (!existingNode) {
// //                 user.nodes.push(newNode);
// //             }
// //         });

// //         const willFormClosedRing = (existingLinks=user.links, newLink) => {
// //             // Create an adjacency list to represent the graph
// //             const adjacencyList = {};

// //             // Populate the adjacency list with existing links
// //             existingLinks.forEach((link) => {
// //                 if (!adjacencyList[link.source]) {
// //                     adjacencyList[link.source] = [];
// //                 }
// //                 adjacencyList[link.source].push(link.target);

// //                 // Assuming the graph is undirected, add the reverse link as well
// //                 if (!adjacencyList[link.target]) {
// //                     adjacencyList[link.target] = [];
// //                 }
// //                 adjacencyList[link.target].push(link.source);
// //             });

// //             // Function to perform DFS and check for cycles
// //             const hasCycle = (node, parent, visited) => {
// //                 visited.add(node);

// //                 for (const neighbor of adjacencyList[node] || []) {
// //                     if (!visited.has(neighbor)) {
// //                         if (hasCycle(neighbor, node, visited)) {
// //                             return true;
// //                         }
// //                     } else if (neighbor !== parent) {
// //                         // If the neighbor is visited and not the parent, then there is a cycle
// //                         return true;
// //                     }
// //                 }

// //                 return false;
// //             };

// //             // Check if adding the new link creates a cycle
// //             if (!adjacencyList[newLink.source]) {
// //                 adjacencyList[newLink.source] = [];
// //             }
// //             adjacencyList[newLink.source].push(newLink.target);

// //             if (!adjacencyList[newLink.target]) {
// //                 adjacencyList[newLink.target] = [];
// //             }
// //             adjacencyList[newLink.target].push(newLink.source);

// //             // Check for a cycle starting from the new link source
// //             const visited = new Set();
// //             if (hasCycle(newLink.source, null, visited)) {
// //                 console.log('Adding the new link would create a closed ring.');
// //                 return { hasCycle: true, message: 'Adding the new link would create a closed ring.' };
// //             }

// //             // Check for a cycle starting from the new link target
// //             visited.clear();
// //             if (hasCycle(newLink.target, null, visited)) {
// //                 console.log('Adding the new link would create a closed ring.');

// //                 return { hasCycle: true, message: 'Adding the new link would create a closed ring.' };
// //             }

// //             // If no cycle is found, return false
// //             console.log('Adding the new link is safe.');
// //             return { hasCycle: false, message: 'Adding the new link is safe.' };
// //         };

// //         // Append only non-existing links to the existing links
// //         links.forEach((newLink ) => {
// //             // Check if the link with the same source and target already exists
// //             const existingLink = user.links.find(
// //                 (link) => link.source === newLink.source && link.target === newLink.target
// //             );
           
// //             // Add the new link only if it doesn't exist and won't create a closed ring
// //             if (!existingLink ) {
// //                 user.links.push(newLink);
// //             }
// //         });

// //         // Save the updated user to the database
// //         await user.save();
// //         res.json(user);
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ error: 'Internal Server Error' });
// //     }
// // };



// // const createFamilyTree = async (req, res) => {
// //     console.log('createFamilyTree');
// //     try {
// //         const { nodes, links, tel } = req.body;

// //         console.log(`nodes: ${JSON.stringify(nodes)} links: ${JSON.stringify(links)} tel: ${tel}`);

// //         // Validate that nodes and links are provided
// //         if (!nodes || !links) {
// //             console.log('No nodes or links not provided');
// //             return res.status(400).json({ error: 'Nodes and links are required' });
// //         }

// //         // Find the user by tel
// //         let user = await Graphql.findOne({ tel });

// //         if (!user) {
// //             // If user does not exist, return an error
// //             return res.status(404).json({ error: 'User not found' });
// //         }

// //         // Initialize user.links if it is not present
// //         if (!user.links) {
// //             user.links = [];
// //         }

// //         // Append only non-existing nodes to the existing nodes
// //         nodes.forEach((newNode) => {
// //             // Check if the node with the same id already exists
// //             const existingNode = user.nodes.find((node) => node.id === newNode.id);
// //             if (!existingNode) {
// //                 user.nodes.push(newNode);
// //             }
// //         });

 
// //         const willFormClosedRing = (existingLinks, newLink) => {
// //             // Create an adjacency list to represent the graph
// //             const adjacencyList = {};

// //             // Populate the adjacency list with existing links
// //             existingLinks.forEach((link) => {
// //                 if (!adjacencyList[link.source]) {
// //                     adjacencyList[link.source] = [];
// //                 }
// //                 adjacencyList[link.source].push(link.target);

// //                 // Assuming the graph is undirected, add the reverse link as well
// //                 if (!adjacencyList[link.target]) {
// //                     adjacencyList[link.target] = [];
// //                 }
// //                 adjacencyList[link.target].push(link.source);
// //             });

// //             // Function to perform DFS and check for cycles
// //             const hasCycle = (node, parent, visited) => {
// //                 visited.add(node);

// //                 for (const neighbor of adjacencyList[node] || []) {
// //                     if (!visited.has(neighbor)) {
// //                         if (hasCycle(neighbor, node, visited)) {
// //                             return true;
// //                         }
// //                     } else if (neighbor !== parent) {
// //                         // If the neighbor is visited and not the parent, then there is a cycle
// //                         return true;
// //                     }
// //                 }

// //                 return false;
// //             };

// //             // Check if adding the new link creates a cycle
// //             if (!adjacencyList[newLink.source]) {
// //                 adjacencyList[newLink.source] = [];
// //             }
// //             adjacencyList[newLink.source].push(newLink.target);

// //             if (!adjacencyList[newLink.target]) {
// //                 adjacencyList[newLink.target] = [];
// //             }
// //             adjacencyList[newLink.target].push(newLink.source);

// //             // Check for a cycle starting from the new link source
// //             const visited = new Set();
// //             if (hasCycle(newLink.source, null, visited)) {
// //                 return { hasCycle: true, message: 'Adding the new link would create a closed ring.' };
// //             }

// //             // Check for a cycle starting from the new link target
// //             visited.clear();
// //             if (hasCycle(newLink.target, null, visited)) {
// //                 return { hasCycle: true, message: 'Adding the new link would create a closed ring.' };
// //             }

// //             // If no cycle is found, return false
// //             return { hasCycle: false, message: 'Adding the new link is safe.' };
// //         };


// //         // Append only non-existing links to the existing links and ensure no closed rings
// //         links.forEach((newLink) => {
// //             // Convert source and target to numbers
// //             newLink.source = parseInt(newLink.source);
// //             newLink.target = parseInt(newLink.target);
// //             console.log(`source: ${newLink.source}, target: ${newLink.target}`);

// //             // Check if the link with the same source and target already exists
// //             const existingLink = user.links.find(
// //                 (link) => Number(link.source) === newLink.source && Number(link.target) === newLink.target
// //             );

// //             console.log('user.links:', user.links);
// //             console.log('existingLink:', existingLink);

// //             if (!existingLink && !willFormClosedRing(user.links, newLink)) {
// //                 user.links.push(newLink);
// //                 console.log('saving new link');
// //                 console.log(newLink);
// //             }
// //         });



// //         // Save the updated user to the database
// //         await user.save();
// //         res.json(user);
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ error: 'Internal Server Error' });
// //     }
// // };

// const getPublicFigureFamilyTreeById = async (req, res) => {
//     console.log('getPublicFigureFamilyTreeById');
//     try {
//         const userId = req.params.id; // Extract userId from params

//         console.log(`userId: ${userId}`);

//         // Find the user by ID
//         const user = await Graphql.findById(userId);

//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         // Check if user.type is 'public'
//         if (user.type !== 'public') {
//             // If user.type is not 'public', return unauthorized error
//             return res.status(401).json({ error: 'Unauthorized access' });
//         }

//         // Return only nodes and links when user.type is 'public'
//         res.json({ nodes: user.nodes, links: user.links });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };


// const getSharedFamilyTreeById = async (req, res) => {
//     console.log('getPublicFigureFamilyTreeById');
//     try {
//         const userId = req.params.id; // Extract userId from params

//         console.log(`userId: ${userId}`);

//         // Find the user by ID
//         const user = await Graphql.findById(userId);

//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

        

//         // Return only nodes and links when user.type is 'public'
//         res.json({ nodes: user.nodes, links: user.links });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };



// const getPublicUsersList = async (req, res) => {
//     console.log('getPublicUsersList');
//     try {
//         // Find users where type is 'public'
//         const publicUsers = await Graphql.find({ type: 'public' }, 'name imageProfile _id');

//         // Return the list of public users with specific fields
//         res.json(publicUsers);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };



// const createFamilyTree = async (req, res) => {
//     try {
//         const { nodes, links, tel } = req.body;

//         // Validate that nodes and links are provided
//         if (!nodes || !links) {
//             return res.status(400).json({ error: 'Nodes and links are required' });
//         }

//         // Find the user by tel
//         const user = await Graphql.findOne({ tel });

//         if (!user) {
//             // If user does not exist, return an error
//             return res.status(404).json({ error: 'User not found' });
//         }

//         // Append only non-existing nodes to the existing nodes
//         nodes.forEach((newNode) => {
//             // Check if the node with the same id already exists
//             const existingNode = user.nodes.find((node) => node.id === newNode.id);
//             if (!existingNode) {
//                 user.nodes.push(newNode);
//             }
//         });

//         const willFormClosedRing = (existingLinks = user.links, newLink) => {
//             // Create an adjacency list to represent the graph
//             const adjacencyList = {};

//             // Populate the adjacency list with existing links
//             existingLinks.forEach((link) => {
//                 if (!adjacencyList[link.source]) {
//                     adjacencyList[link.source] = [];
//                 }
//                 adjacencyList[link.source].push(link.target);

//                 // Assuming the graph is undirected, add the reverse link as well
//                 if (!adjacencyList[link.target]) {
//                     adjacencyList[link.target] = [];
//                 }
//                 adjacencyList[link.target].push(link.source);
//             });

//             // Function to perform DFS and check for cycles
//             const hasCycle = (node, parent, visited) => {
//                 visited.add(node);

//                 for (const neighbor of adjacencyList[node] || []) {
//                     if (!visited.has(neighbor)) {
//                         if (hasCycle(neighbor, node, visited)) {
//                             return true;
//                         }
//                     } else if (neighbor !== parent) {
//                         // If the neighbor is visited and not the parent, then there is a cycle
//                         return true;
//                     }
//                 }

//                 return false;
//             };

//             // Loop through all links from req.body and remove hasCycle true from the links array
//             links.forEach((linkToRemove) => {
//                 existingLinks = existingLinks.filter(
//                     (link) => !(link.source === linkToRemove.source && link.target === linkToRemove.target)
//                 );
//             });

//             // Check if adding the new link creates a cycle
//             if (!adjacencyList[newLink.source]) {
//                 adjacencyList[newLink.source] = [];
//             }
//             adjacencyList[newLink.source].push(newLink.target);

//             if (!adjacencyList[newLink.target]) {
//                 adjacencyList[newLink.target] = [];
//             }
//             adjacencyList[newLink.target].push(newLink.source);

//             // Check for a cycle starting from the new link source
//             const visited = new Set();
//             if (hasCycle(newLink.source, null, visited)) {
//                 console.log('Adding the new link would create a closed ring.');
//                 return { hasCycle: true, message: 'Adding the new link would create a closed ring.' };
//             }

//             // Check for a cycle starting from the new link target
//             visited.clear();
//             if (hasCycle(newLink.target, null, visited)) {
//                 console.log('Adding the new link would create a closed ring.');

//                 return { hasCycle: true, message: 'Adding the new link would create a closed ring.' };
//             }

//             // If no cycle is found, return false
//             console.log('Adding the new link is safe.');
//             return { hasCycle: false, message: 'Adding the new link is safe.' };
//         };

//         // Append only non-existing links to the existing links
//         links.forEach((newLink) => {
//             // Check if the link with the same source and target already exists
//             const existingLink = user.links.find(
//                 (link) => link.source === newLink.source && link.target === newLink.target
//             );

//             // Call willFormClosedRing and add the new link only if it doesn't exist and won't create a closed ring
//             const { hasCycle, message } = willFormClosedRing(user.links, newLink);
//             if (!existingLink && !hasCycle) {
//                 user.links.push(newLink);
//             } else {
//                 console.log(message);
//             }
//         });

//         // Save the updated user to the database
//         await user.save();
//         res.json(user);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };




// const createUser = async (req, res) => {
//     try {
//         const { name, secretCode, tel, role, id, information, imageLink, imageProfile, address } = req.body;

//         console.log(`name: ${name}, 
//         secretCode: ${secretCode}, tel: ${tel}, 
//         role: ${role}, id: ${id}, information: ${information}, 
//         imageLink: ${imageLink}`);



//         // Check if a user with the given phone number already exists
//         const existingUser = await Graphql.findOne({ tel: tel });
//         if (existingUser) {
//             return res.status(400).json({ error: 'Phone number already registered' });
//         }

//         // Check if the user is trying to create an admin role
//         if (role && role.toLowerCase() !== 'client') {
//             return res.status(400).json({ error: 'Error: Cannot create user with this role' });
//         }

//         // Hash the secretCode
//         const saltRounds = 10;
//         const hashedSecretCode = await bcrypt.hash(secretCode, saltRounds);

//         // Create the new node for the family tree
//         const newNode = { id, name, information, imageLink };

//         // Create the new user
//         const newUser = new Graphql({
//             name,
//             secretCode: hashedSecretCode,
//             tel,
//             nodes: [newNode],
//             links: [],
//             imageProfile,
//             address
//         });

//         // Save the new user to the database
//         await newUser.save();

//         // Generate JWT token
//         const tokenPayload = { userId: newUser._id, role: newUser.role, tel: newUser.tel };
//         const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);

//         // Update the user with the generated token
//         newUser.token = token;
//         await newUser.save();

//         // Prepare the response data
//         const userResponse = {
//             _id: newUser._id,
//             name: newUser.name,
//             token: newUser.token,
//             role: newUser.role,
//             tel: newUser.tel,
//             createdAt: newUser.createdAt,
//             updatedAt: newUser.updatedAt,
//         };

//         // Send the response
//         res.status(201).json({ ...userResponse, token });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };


// // User Update their profile

// const validateFields = (obj) => {
//     const allowedFields = ['imageProfile', 'name', 'oldPassword', 'newPassword'];
//     for (const key in obj) {
//         if (!allowedFields.includes(key)) {
//             return false; // Found an invalid field
//         }
//     }
//     return true; // All fields are valid
// };

// const userUpdateOwnInfoById = async (req, res) => {
//     try {
//         const { imageProfile, oldPassword, newPassword, name } = req.body;
//         const userId = req.id;

//         const user = await Graphql.findById(userId);

//         // Validate the request body fields
//         const isValidFields = validateFields(req.body);

//         if (!isValidFields) {
//             return res.status(400).json({ error: 'Invalid fields in the request body.' });
//         }

//         if (!user) {
//             return res.status(404).json({ error: 'Graphql not found' });
//         }

//         // Initialize a flag to track whether newPassword is provided
//         let isPasswordValid = true;

//         if (newPassword) {
//             // If newPassword is provided, perform the password check
//             isPasswordValid = await bcrypt.compare(oldPassword, user.secretCode);

//             if (!isPasswordValid) {
//                 return res.status(401).json({ error: 'Invalid credentials' });
//             }

//             // If 'secretCode' field is present in req.body, hash it and save it to the user
//             const saltRounds = 10;
//             const hashedSecretCode = await bcrypt.hash(newPassword, saltRounds);
//             user.secretCode = hashedSecretCode;
//         }

//         // Update user information
//         if (imageProfile) {
//             // If 'image' field is present in req.body, save it to the user
//             user.imageProfile = imageProfile;
//         }

//         if (name) {
//             // If 'image' field is present in req.body, save it to the user
//             user.name = name;
//         }

//         await user.save();

//         res.status(200).json({ success: 'Graphql information updated successfully.' });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: error.message });
//     }
// };



// const userUpdateOwnImageById = async (req, res) => {
//     console.log('use userUpdateOwnInfo');
//     try {
//         const { imageProfile } = req.body;
//         const userId = req.id;
//         console.log(imageProfile);


//         const user = await Graphql.findById(userId);

//         // Validate the request body fields
//         const isValidFields = validateFields(req.body);

//         // console.log(`isValidFields ${isValidFields}`);

//         if (!isValidFields) {
//             return res.status(400).json({ error: 'Invalid fields in the request body.' });
//         }


//         if (!user) {
//             return res.status(404).json({ error: 'Graphql not found' });
//         }
//         // Update user information
//         if (imageProfile) {
//             // If 'image' field is present in req.body, save it to the user
//             user.imageProfile = imageProfile;
//             // console.log('image profile updated');

//         }
//         await user.save();
//         console.log(`user image ${user.imageProfile}`);


//         res.status(200).json({ success: 'Graphql information updated successfully.' });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: error.message });
//     }
// };


// // Cheking if Number already exists
// const checkIfUserTelAlreadyRegister = async (req, res) => {
//     console.log('checkIfUserTelAlreadyRegister');
//     try {
//         const tel = req.query.tel // Assuming you pass the user ID in the URL or request parameters
//         const user = await Graphql.findOne({ tel });

//         console.log(`tel ${tel}`);
//         if (!user) {

//             return res.status(200).json('User not Register Yet');
//         } else if (user) {

//             return res.status(200).json('User already Registered');

//         }


//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };


// // familytree.controller.js

// const editNode = async (req, res) => {
//     console.log('editNode');
//     try {
//         const { tel } = req.body;
//         const { id } = req.body;

//         console.log(`tel ${tel}`);

//         // Find the user by tel
//         const user = await Graphql.findOne({ tel });

//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         // Find the node by id
//         const nodeIndex = user.nodes.findIndex((node) => node.id === id);

//         if (nodeIndex === -1) {
//             return res.status(404).json({ error: 'Node not found' });
//         }

//         // Update the node properties except for the id
//         user.nodes[nodeIndex] = {
//             ...user.nodes[nodeIndex],
//             id: req.body.id,
//             name: req.body.name || user.nodes[nodeIndex].name,
//             information: req.body.information || user.nodes[nodeIndex].information,
//             imageLink: req.body.imageLink || user.nodes[nodeIndex].imageLink,
//         };

//         // Save the updated user to the database
//         await user.save();

//         res.json(user);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

// const deleteNode = async (req, res) => {
//     console.log('deleteNode');
//     try {
//         const { tel } = req.body;
//         const { id } = req.body;

//         // Find the user by tel
//         const user = await Graphql.findOne({ tel });

//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         // Find the node by id
//         const nodeIndex = user.nodes.findIndex((node) => node.id === id);

//         if (nodeIndex === -1) {
//             return res.status(404).json({ error: 'Node not found' });
//         }

//         // Remove the node from the nodes array
//         user.nodes.splice(nodeIndex, 1);

//         // Remove any links that have the node id as the source or target
//         user.links = user.links.filter((link) => link.source !== id && link.target !== id);

//         // Save the updated user to the database
//         await user.save();

//         res.json(user);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

// // Admin Display all uses Informations
// const getAllUsers = async (req, res) => {
//     console.log('getAllUsers');
//     try {

//         const users = await Graphql.find()

//         res.json({

//             users,
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };



// // Admin Update user ID

// const adminUpdateUserById = async (req, res) => {
//     console.log('adminUpdateUserById');
//     try {
//         const updates = req.body;
//         const user = await Graphql.findById(req.params.id);

//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         // Check if 'accessList' exists in the updates object and it's an array
//         if (updates.accessList && Array.isArray(updates.accessList)) {
//             // Append new values to the existing 'user.accessList' if it exists, or initialize it if it doesn't
//             user.accessList = user.accessList ? [...user.accessList, ...updates.accessList] : updates.accessList;
//         }

//         // console.log('User.accessList (before update):', user.accessList);
//         // console.log('Updates.accessList:', updates.accessList);

//         if (updates.secretCode) {
//             // If 'secretCode' field is present in req.body, hash it and save it to the user
//             const saltRounds = 10;
//             const hashedSecretCode = await bcrypt.hash(secretCode, saltRounds);
//             user.secretCode = hashedSecretCode;
//         }

//         // Update the user with the new data (excluding 'accessList')
//         delete updates.accessList; // Exclude 'accessList' from updates
//         Object.assign(user, updates);
//         await user.save();

//         // Prepare the response object including the updated 'accessList'
//         const responseUser = {
//             _id: user._id,
//             name: user.name,
//             role: user.role,
//             accessList: user.accessList, // Include the updated accessList
//         };

//         res.json(responseUser);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: error.message });
//     }
// };


// // Delete a user by ID (requires admin role)
// const deleteUserById = async (req, res) => {
//     try {


//         const deletedUser = await Graphql.findByIdAndDelete(req.params.id);
//         if (!deletedUser) {
//             // console.log('User not found:', req.params.id);
//             return res.status(404).json({ error: 'User not found' });
//         }

//         // console.log('User deleted successfully:', deletedUser._id);
//         res.status(200).json({ message: 'User deleted successfully' });
//     } catch (error) {
//         // console.error('Error during delete user:', error);
//         res.status(500).json({ error: 'Failed to delete user' });
//     }
// };



// const addUserToSharedGraphAccessList = async (req, res) => {
//     console.log('addUserToSharedGraphAccessList');
//     try {
//         const { userTelToAdd } = req.body;
//         const userId = req.userId;

//         const user = await Graphql.findById(userId);

//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         // Check if the userTel to add is already in the list
//         if (user.sharedGraphAccessUserList.includes(userTelToAdd)) {
//             return res.status(400).json({ error: 'User is already in the list' });
//         }

//         // Add the userTel to the sharedGraphAccessUserList
//         user.sharedGraphAccessUserList.push(userTelToAdd);
//         await user.save();

//         res.json({ message: 'User added to the shared Graph Access UserList successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };


// const removeUserFromSharedGraphAccessList = async (req, res) => {
//     try {
//         const { userTelToRemove } = req.body;
//         const userId = req.userId;

//         const user = await Graphql.findById(userId);

//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         // Check if the userTel to remove is in the list
//         if (!user.sharedGraphAccessUserList.includes(userTelToRemove)) {
//             return res.status(400).json({ error: 'User is not in the list' });
//         }

//         // Remove the userTel from the sharedGraphAccessUserList
//         user.sharedGraphAccessUserList = user.sharedGraphAccessUserList.filter(tel => tel !== userTelToRemove);
//         await user.save();

//         res.json({ message: 'User removed from the shared Graph Access UserList successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };


// const getUserListWithNames = async (req, res) => {
//     console.log('getUserListWithNames');
//     try {
//         const userId = req.userId;

//         const user = await Graphql.findById(userId);

//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         const userListWithNames = await Promise.all(
//             user.sharedGraphAccessUserList.map(async (userTel) => {
//                 try {
//                     // Find the user by telephone number and get their name
//                     const foundUser = await Graphql.findOne({ tel: userTel });
//                     // console.log(`userTel: ${userTel}`);
//                     // console.log(`foundUser: ${JSON.stringify(foundUser)}`);
//                     const userName = foundUser ? foundUser.name : null;

//                     return { userTel, userName };
//                 } catch (error) {
//                     console.error('Error finding user:', error);
//                     return { userTel, userName: null };
//                 }
//             })
//         );

//         // console.log(`userListWithNames: ${JSON.stringify(userListWithNames)}`);

//         res.status(200).json({ userListWithNames }); // Updated the response status to 200
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };





// const getUserNodesAndLinks = async (req, res) => {
//     console.log('Shared getUserNodesAndLinks');
//     try {
//         const userTel = req.tel;

//         // Find all users in Graphql whose sharedGraphAccessUserList includes userTel
//         const users = await Graphql.find({ sharedGraphAccessUserList: userTel });

//         // Collect nodes and links for each user
//         const nodesAndLinksList = users.map((user) => ({
//             userTel: user.tel,
//             userId: user._id,
//             imageProfile: user.imageProfile,
//             userName: user.name,
//             nodes: user.nodes || [],
//             links: user.links || [],
//         }));

//         console.log('shared done');

//         res.status(200).json({ nodesAndLinksList });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };




// module.exports = { getFamilyTree,
//     userUpdateOwnInfoById,
//     addUserToSharedGraphAccessList, getSharedFamilyTreeById,
// removeUserFromSharedGraphAccessList,
//     userUpdateOwnImageById, getUserNodesAndLinks,
//     getUserListWithNames,
//     checkIfUserTelAlreadyRegister, editNode,
//     deleteNode, getPublicFigureFamilyTreeById, deleteUserById,
//     getPublicUsersList, getAllUsers, adminUpdateUserById,
//  getFamilyTreeById, login,createFamilyTree, createUser };