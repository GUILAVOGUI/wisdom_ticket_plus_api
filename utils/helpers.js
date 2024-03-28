// utils/helpers.js

const generateRandomCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

module.exports = {
    generateRandomCode,
};
