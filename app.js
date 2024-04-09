const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const rateLimit = require('express-rate-limit'); // Import express-rate-limit

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Define a rate limiting configuration
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10000, // Limit each IP to 100 requests per windowMs
});

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(limiter); // Apply the rate limiting middleware

// MongoDB connection
mongoose
    .connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// Routes
const userRoutes = require('./routes/userRoutes');
const shopRoutes = require('./routes/shopRoutes');
const eventRoutes = require('./routes/eventRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const locationRoutes = require('./routes/locationRoutes');
const eventCategoryRoutes = require('./routes/eventCategoryRoutes');
const privacyRoutes = require('./routes/privacyRoutes');

app.use('/api', userRoutes);
app.use('/api', shopRoutes);
app.use('/api', eventRoutes);
app.use('/api', ticketRoutes);
app.use('/api', locationRoutes);
app.use('/api', eventCategoryRoutes);
app.use('/api', privacyRoutes);

 

module.exports = app;
