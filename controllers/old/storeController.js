const Store = require('../models/storeModel');

const createStore = async (req, res) => {
    try {
        const { name, address, accessListOfUsersTel, designatedStoreManagerTel, products, imagebannerLink } = req.body;
        const store = new Store({ name, address, accessListOfUsersTel, designatedStoreManagerTel, products, imagebannerLink });
        await store.save();
        res.status(201).json(store);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

 
const getAllStores = async (req, res) => {
    try {
        if (req.accessList && req.accessList.includes('allAccess')) {
            // If user has allAccess, respond with all stores
            const stores = await Store.find();
            res.status(200).json(stores);
        } else if (req.tel) {
            // If user has specific tel, filter stores based on accessListOfUsersTel
            const stores = await Store.find({
                accessListOfUsersTel: req.tel
            });
            res.status(200).json(stores);
        } else {
            res.status(400).json({ error: 'Invalid request' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getStoreById = async (req, res) => {
    try {
        const store = await Store.findById(req.params.id);
        if (!store) {
            return res.status(404).json({ error: 'Store not found' });
        }
        res.status(200).json(store);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


 const updateStoreById = async (req, res) => {
    try {
        const { name, address, accessListOfUsersTel, designatedStoreManagerTel, products, editedRemoveAccessListOfUsersTel } = req.body;

        // Find the store by ID and update
        const store = await Store.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    name,
                    address,
                    designatedStoreManagerTel,
                    products,
                },
                $push: {
                    accessListOfUsersTel: accessListOfUsersTel,
                },
            },
            { new: true }
        );

        if (!store) {
            return res.status(404).json({ error: 'Store not found' });
        }

        // Check if editedRemoveAccessListOfUsersTel exists and remove it
        if (editedRemoveAccessListOfUsersTel) {
            await Store.findByIdAndUpdate(
                req.params.id,
                {
                    $pull: {
                        accessListOfUsersTel: editedRemoveAccessListOfUsersTel,
                    },
                },
                { new: true }
            );
        }

        res.status(200).json(store);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




const deleteStoreById = async (req, res) => {
    // console.log('deleteStoreById');
    try {
        const store = await Store.findByIdAndDelete(req.params.id);
        if (!store) {
            return res.status(404).json({ error: 'Store not found' });
        }
        res.status(204).json();
    } catch (error) {
        // console.log(error);
        res.status(500).json({ error: error.message });
    }
};

 
const createProduct = async (req, res) => {
    try {
        const { productId, productName, unitPrice, quantityInStock, type, status, minQuantityForAlert, expireDate, dateRegisteredInSystem, imagesLinks } = req.body;

        // Check if the product name is unique within the store
        const existingProduct = await Store.findOne({
            _id: req.params.storeId,
            'products.productName': productName,
        });

        if (existingProduct) {
            return res.status(400).json({ error: 'Product name must be unique within the store' });
        }

        const product = {
            productId,
            productName,
            unitPrice,
            quantityInStock,
            type,
            status,
            minQuantityForAlert,
            expireDate,
            dateRegisteredInSystem,
            imagesLinks
        };

        const store = await Store.findById(req.params.storeId);
        if (!store) {
            return res.status(404).json({ error: 'Store not found' });
        }

        store.products.push(product);
        await store.save();

        res.status(201).json(store.products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
 
const updateProductById = async (req, res) => {
    // console.log('updateProductById');
    try {
        const { productName, unitPrice, quantityInStock, type, status, minQuantityForAlert, expireDate, dateRegisteredInSystem, imagesLinks } = req.body;
        const store = await Store.findById(req.params.storeId);

        if (!store) {
            return res.status(404).json({ error: 'Store not found' });
        }

        const product = store.products.id(req.params.productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Create an object with only non-null and existing fields
        const updatedFields = {
            ...(productName !== undefined ? { productName } : {}),
            ...(unitPrice !== undefined ? { unitPrice } : {}),
            ...(quantityInStock !== undefined ? { quantityInStock } : {}),
            ...(type !== undefined ? { type } : {}),
            ...(status !== undefined ? { status } : {}),
            ...(minQuantityForAlert !== undefined ? { minQuantityForAlert } : {}),
            ...(expireDate !== undefined ? { expireDate } : {}),
            ...(dateRegisteredInSystem !== undefined ? { dateRegisteredInSystem } : {}),
            ...(imagesLinks !== undefined ? { imagesLinks } : {}),
        };

        product.set(updatedFields);
        await store.save();

        res.status(200).json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};


 
const deleteProductById = async (req, res) => {
    // console.log('deleteProductById');
    try {
        const store = await Store.findById(req.params.storeId);
        if (!store) {
            return res.status(404).json({ error: 'Store not found' });
        }

        const productIndex = store.products.findIndex(product => product._id == req.params.productId);
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Remove the product from the array
        store.products.splice(productIndex, 1);

        await store.save();
        res.status(204).json();
    } catch (error) {
        // console.log(error);
        res.status(500).json({ error: error.message });
    }
};


// const postStoreProductTransactions = async (req, res) => {
//     try {
//         const { transactions } = req.body;

//         const store = await Store.findById(req.params.storeId);
//         if (!store) {
//             return res.status(404).json({ error: 'Store not found' });
//         }

//         for (const transaction of transactions) {
//             const { productId, action, quantityChanged } = transaction;

//             const product = store.products.id(productId);
//             if (!product) {
//                 return res.status(404).json({ error: `Product with ID ${productId} not found in the store` });
//             }

//             // Update quantity based on action (Sold or Supply)
//             if (action === 'Sold') {
//                 if (product.quantityInStock < quantityChanged) {
//                     return res.status(400).json({ error: 'Insufficient stock for the sold quantity' });
//                 }
//                 product.quantityInStock -= quantityChanged;
//             } else if (action === 'Supply') {
//                 product.quantityInStock += quantityChanged;
//             } else {
//                 return res.status(400).json({ error: 'Invalid action. Use "Sold" or "Supply"' });
//             }

//             // Add history entry
//             store.history.push({
//                 productId,
//                 action,
//                 quantityChanged,
//             });
//         }

//         await store.save();

//         res.status(201).json({ message: 'Product transactions recorded successfully' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };


// const postStoreProductTransactions = async (req, res) => {
//     try {
//         const { transactions, customerName, customerTel } = req.body;

//         const store = await Store.findById(req.params.storeId);
//         if (!store) {
//             return res.status(404).json({ error: 'Store not found' });
//         }

//         for (const transaction of transactions) {
//             const { productId, action, quantityChanged } = transaction;

//             const product = store.products.id(productId);
//             if (!product) {
//                 return res.status(404).json({ error: `Product with ID ${productId} not found in the store` });
//             }

//             // Update quantity based on action (Sold or Supply)
//             if (action === 'Sold') {
//                 if (product.quantityInStock < quantityChanged) {
//                     return res.status(400).json({ error: 'Insufficient stock for the sold quantity' });
//                 }
//                 product.quantityInStock -= quantityChanged;
//             } else if (action === 'Supply') {
//                 product.quantityInStock += quantityChanged;
//             } else {
//                 return res.status(400).json({ error: 'Invalid action. Use "Sold" or "Supply"' });
//             }

//             // Add history entry with transactions
//             const historyEntry = {
//                 productId,
//                 productName: product.productName,
//                 action,
//                 quantityChanged,
//                 date: new Date(),
               
//             };

//             store.history.push({
//                 transactions: [historyEntry], customerName,
//                 customerTel,
// });
//         }

//         await store.save();

//         res.status(200).json(store);

//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

const postStoreProductTransactions = async (req, res) => {
    try {
        const { transactions, customerName, customerTel } = req.body;

        const store = await Store.findById(req.params.storeId);
        if (!store) {
            return res.status(404).json({ error: 'Store not found' });
        }

        for (const transaction of transactions) {
            const { productId, action, quantityChanged } = transaction;

            const parsedQuantity = parseInt(quantityChanged, 10); // Parse quantityChanged to an integer

            if (isNaN(parsedQuantity)) {
                return res.status(400).json({ error: 'Invalid quantity. Quantity must be a number' });
            }

            const product = store.products.id(productId);
            if (!product) {
                return res.status(404).json({ error: `Product with ID ${productId} not found in the store` });
            }

            // Update quantity based on action (Sold or Supply)
            if (action === 'Sold') {
                if (product.quantityInStock < parsedQuantity) {
                    return res.status(400).json({ error: 'Insufficient stock for the sold quantity' });
                }
                product.quantityInStock -= parsedQuantity;
            } else if (action === 'Supply') {
                product.quantityInStock += parsedQuantity;
            } else {
                return res.status(400).json({ error: 'Invalid action. Use "Sold" or "Supply"' });
            }

            // Add history entry with transactions
            const historyEntry = {
                productId,
                productName: product.productName,
                action,
                quantityChanged: parsedQuantity,
                date: new Date(),
            };

            store.history.push({
                transactions: [historyEntry],
                customerName,
                customerTel,
            });
        }

        await store.save();

        res.status(200).json(store);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



module.exports = {
    createStore,
    getAllStores,
    getStoreById,
    updateStoreById,
    deleteStoreById,
    createProduct,
    updateProductById,
    deleteProductById,
    postStoreProductTransactions
};


 