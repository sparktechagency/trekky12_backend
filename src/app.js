const express = require('express');
const connectDB = require('./config/db');
const app = express();
const authRoutes = require('./routes/auth.routes'); // 
const dotenv = require('dotenv');

dotenv.config();


// DB Connection
connectDB();

// Middleware
app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes);

module.exports = app;
