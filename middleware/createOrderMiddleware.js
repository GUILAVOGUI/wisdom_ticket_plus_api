const Product = require('../models/old/product'); // Import your Product model here

const createOrderMiddleware = async (req, res, next) => {
    const { listOfProducts } = req.body;
    const { orderType } = req.body;

    try {
        // Create an array to store the validation results
        const validationResults = [];

        // Loop through each product in the listOfProducts
        for (const productInfo of listOfProducts) {
            const { product, price, details } = productInfo;

            // Find the product in the database by its ID
            const realProduct = await Product.findById(product);

            if (!realProduct) {
                // If the product doesn't exist in the database, push an error message to the validationResults
                validationResults.push(`Product with ID ${product} not found.`);
            } else {
                // Check the order type
                if (orderType === 'food') {
                    // If the order is for food, check if the received price matches the DB price
                    if (realProduct.price !== price) {
                        validationResults.push(`Price for food product ${realProduct.name} does not match.`);
                    }
                } else if (orderType === 'shopping') {
                    // Check if details exist and if shippingMode is defined before attempting to destructure
                    if (details && details.shippingMode !== undefined) {
                        const { shippingMode } = details;

                        if (shippingMode === 'Air' && realProduct.priceWeight !== price) {
                            // If shipping by air, check if the received price matches the DB priceWeight
                            validationResults.push(`Price for product ${realProduct.name} (Air) does not match.`);
                        } else if (shippingMode === 'Sea' && realProduct.priceCBM !== price) {
                            // If shipping by sea, check if the received price matches the DB priceCBM
                            validationResults.push(`Price for product ${realProduct.name} (Sea) does not match.`);
                        }
                    } else {
                        validationResults.push(`Product details missing or shippingMode undefined for product ${realProduct.name}.`);
                    }
                }
            }
        }

        // Check if there are any validation errors
        if (validationResults.length > 0) {
            return res.status(400).json({ errors: validationResults });
        }

        // If there are no errors, continue with the next middleware
        next();
    } catch (error) {
        // Handle any errors that occur during database queries or processing
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = createOrderMiddleware;
