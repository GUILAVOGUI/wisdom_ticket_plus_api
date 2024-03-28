const GoodsTracking = require('../../models/old/GoodsTracking');

// Create a new goods tracking entry
exports.createGoodsTracking = async (req, res) => {
    try {
        // console.log('creating new goods tracking entry');
        const goodsTracking = new GoodsTracking(req.body);
        const savedGoodsTracking = await goodsTracking.save();

        // console.log('saved goods tracking entry successfully');
        res.json(savedGoodsTracking);


    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Unable to create goods tracking entry' });
    }
};

// See all the GoodTracking

exports.getAllGoods = async (req, res) => {
    console.log('Getting all GoodTracking');
    try {
        const goods = await GoodsTracking.find(); // Retrieve all goods from the database
        res.status(200).json(goods);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}


// See  the GoodTracking by user
exports.getAllGoodsForUser = async (req, res) => {
    try {
        // console.log('try getAllGoodsForUser');
        const goods = await GoodsTracking.find(); // Retrieve all goods from the database

        // Filter goods to include only items where clientTel matches req.tel
        const filteredGoods = goods.filter((item) => item.clientTel === req.tel);

        // Map the filtered goods data to include only the specified keys
        const simplifiedGoods = filteredGoods.map((item) => ({
            _id: item._id,
            goodsName: item.goodsName,
            goodsDescription: item.goodsDescription,
            goodsCountryOrigin: item.goodsCountryOrigin,
            goodsCountryDestination: item.goodsCountryDestination,
            goodsType: item.goodsType,
            goodsQuantity: item.goodsQuantity,
            goodsTotalWeight: item.goodsTotalWeight,
            goodsTotalCBM: item.goodsTotalCBM,
            goodsImagesLinks: item.goodsImagesLinks,
            goodsShippingMode: item.goodsShippingMode,
            goodsCurrentCountrylocation: item.goodsCurrentCountrylocation,
            clientName: item.clientName,
            clientTel: item.clientTel,
            clientAddress: item.clientAddress,
            clientPaidtAmount: item.clientPaidtAmount,
            clientPaymentStatus: item.clientPaymentStatus,
            clientReceptImagesLinks: item.clientReceptImagesLinks,
            status: item.status,
            adminComment: item.adminComment,
            goodsCreationdate: item.goodsCreationdate,
            deliveredToClientDate: item.deliveredToClientDate,
            receptionInWareHouseDate: item.receptionInWareHouseDate,
        }));

        res.status(200).json(simplifiedGoods);
    } catch (error) {
        // console.log(error)
        res.status(500).json({ error: error.message });
    }
}



// See  the GoodTracking by user
exports.getAllGoodsForSender = async (req, res) => {
    try {
        // console.log('try getAllGoodsForUser');
        const goods = await GoodsTracking.find(); // Retrieve all goods from the database

        // Filter goods to include only items where clientTel matches req.tel
        const filteredGoods = goods.filter((item) => item.senderTel === req.tel);

        // Map the filtered goods data to include only the specified keys
        const simplifiedGoods = filteredGoods.map((item) => ({
            _id: item._id,
            goodsName: item.goodsName,
            goodsDescription: item.goodsDescription,
            goodsCountryDestination: item.goodsCountryDestination,
            goodsType: item.goodsType,
            goodsQuantity: item.goodsQuantity,
            goodsTotalWeight: item.goodsTotalWeight,
            goodsTotalCBM: item.goodsTotalCBM,
            goodsImagesLinks: item.goodsImagesLinks,
            goodsShippingMode: item.goodsShippingMode,
            goodsCurrentCountrylocation: item.goodsCurrentCountrylocation,
            clientName: item.clientName,
            clientTel: item.clientTel,
            status: item.status,
            adminComment: item.adminComment,
            senderPayementStatus: item.senderPayementStatus,
            senderName: item.senderName,
            senderTel: item.senderTel,
            senderPaymentAmount: item.senderPaymentAmount,
            forwarderReceptImagesLinks: item.forwarderReceptImagesLinks,
            goodsCreationdate: item.goodsCreationdate,
            deliveredToClientDate: item.deliveredToClientDate,
            receptionInWareHouseDate: item.receptionInWareHouseDate,
        }));

        res.status(200).json(simplifiedGoods);
    } catch (error) {
        // console.log(error)
        res.status(500).json({ error: error.message });
    }
}


 
// Update an existing goods tracking entry by ID by Admin
exports.updateGoodsTrackingByAdmin = async (req, res) => {
    try {
        // console.log('updating');
        const { goodsImagesLinks, clientReceptImagesLinks, forwarderReceptImagesLinks, ...updates } = req.body;

        const existingGoodsTracking = await GoodsTracking.findById(req.params.id);

        if (!existingGoodsTracking) {
            return res.status(404).json({ error: 'Goods tracking entry not found' });
        }

        // Append the new update links and values to the existing ones
        if (goodsImagesLinks) {
            existingGoodsTracking.goodsImagesLinks = [
                ...existingGoodsTracking.goodsImagesLinks,
                ...goodsImagesLinks,
            ];
        }
        if (clientReceptImagesLinks) {
            existingGoodsTracking.clientReceptImagesLinks = [
                ...existingGoodsTracking.clientReceptImagesLinks,
                ...clientReceptImagesLinks,
            ];
        }
        if (forwarderReceptImagesLinks) {
            existingGoodsTracking.forwarderReceptImagesLinks = [
                ...existingGoodsTracking.forwarderReceptImagesLinks,
                ...forwarderReceptImagesLinks,
            ];
        }

        // Update other fields in the existing document
        Object.assign(existingGoodsTracking, updates);

        const updatedGoodsTracking = await existingGoodsTracking.save();

        // console.log('update success');
        res.json(updatedGoodsTracking);
    } catch (error) {
        console.log(error);
        // console.log('update failed');
        res.status(500).json({ error: 'Unable to update goods tracking entry' });
    }
};




// Update an existing goods tracking entry by ID By Sender

const validateFieldsForSender = (obj) => {
    const allowedFields = [
        'goodsName',
        'status',
        'goodsDescription',
        'goodsType',
        'goodsQuantity',
        'goodsCountryDestination',
        'goodsTotalWeight',
        'goodsTotalCBM',
        'goodsShippingMode',
        'goodsCurrentCountrylocation',
        'senderName',
        'senderTel',
        'senderPaymentAmount',
        'senderPaymentStatus',
        'adminComment',
        'senderComment',
        'client',
        'goodsCreationdate',
        'deliveredToClientDate',
        'receptionInWareHouseDate',
        'forwarderReceptImagesLinks', // Add this field if needed
        'goodsImagesLinks', // Add this field if needed
    ];
    for (const key in obj) {
        if (!allowedFields.includes(key)) {
            return false; // Found an invalid field
        }
    }
    return true; // All fields are valid
};


exports.updateGoodsTrackingBySender = async (req, res) => {
 
    try {
        // console.log('type: updateGoodsTrackingBySender');

        // Validate the request body fields
        const isValidFields = validateFieldsForSender(req.body);

        if (!isValidFields) {
            return res.status(400).json({ error: 'Invalid fields in the request body.' });
        }

        const { goodsImagesLinks, clientReceptImagesLinks, forwarderReceptImagesLinks, ...updates } = req.body;

        const existingGoodsTracking = await GoodsTracking.findById(req.params.id);

        if (!existingGoodsTracking) {
            return res.status(404).json({ error: 'Goods tracking entry not found' });
        }

        // Append the new update links and values to the existing ones
        if (goodsImagesLinks) {
            existingGoodsTracking.goodsImagesLinks = [
                ...existingGoodsTracking.goodsImagesLinks,
                ...goodsImagesLinks,
            ];
        }
        if (clientReceptImagesLinks) {
            existingGoodsTracking.clientReceptImagesLinks = [
                ...existingGoodsTracking.clientReceptImagesLinks,
                ...clientReceptImagesLinks,
            ];
        }
        if (forwarderReceptImagesLinks) {
            existingGoodsTracking.forwarderReceptImagesLinks = [
                ...existingGoodsTracking.forwarderReceptImagesLinks,
                ...forwarderReceptImagesLinks,
            ];
        }

        // Update other fields in the existing document
        Object.assign(existingGoodsTracking, updates);

        const updatedGoodsTracking = await existingGoodsTracking.save();

        // console.log('update success');
        res.json(updatedGoodsTracking);
    } catch (error) {
        // console.log(error);
        // console.log('update failed');
        res.status(500).json({ error: 'Unable to update goods tracking entry' });
    }
};



// Delete a goods tracking entry by ID
exports.deleteGoodsTracking = async (req, res) => {
    try {
        const deletedGoodsTracking = await GoodsTracking.findByIdAndRemove(req.params.id);
        if (!deletedGoodsTracking) {
            return res.status(404).json({ error: 'Goods tracking entry not found' });
        }
        res.json({ message: 'delete successfully' });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Unable to delete goods tracking entry' });
    }
};
