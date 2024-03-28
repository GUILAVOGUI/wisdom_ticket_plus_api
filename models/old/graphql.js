// model.js
const mongoose = require('mongoose');

// Node schema
const NodeSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    information: { type: String, required: false },
    imageLink: { type: String, required: true },
});

// Linked schema
const LinkedSchema = new mongoose.Schema({
    source: { type: Number, required: true },
    target: { type: Number, required: true },
    relationship: { type: String, required: true },
});

// Main User schema containing nodes and links
const GraphqlSchema = new mongoose.Schema({
    nodes: [NodeSchema],
    links: [LinkedSchema],
    name: { type: String, required: true },
    imageProfile: { type: String, required: false },
    address: { type: String, required: false },
    role: { type: String, default: 'client', required: false },
    type: { type: String, default: 'private', required: false },
    status: { type: String, default: 'active', required: false },
    secretCode: { type: String, required: true },
    tel: { type: String, unique: true, sparse: true },
    token: { type: String, default: null },
    avatarLink: { type: String, required: false },
    accessList: [{
        type: String,
        required: false,
    }],
    sharedGraphAccessUserList: [{
        type: String,
        required: false,
    }],
});

const GraphqlModel = mongoose.model('Graphql', GraphqlSchema);

module.exports = GraphqlModel;
