const mongoose = require('mongoose');

 
const clientsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    status: { type: String, required: false },
    address: { type: String, required: false },
    tel: { type: String, unique: true, sparse: true },
   
    
});

const Clients = mongoose.model('Clients', clientsSchema);

module.exports = Clients;
