const express = require('express');
const connectDB = require('./config/db');
const app = express();
const {authRoutes, userRoutes } = require('./routes/auth.routes'); 
const dotenv = require('dotenv');
// const userRoutes = require('./routes/user.routes');

dotenv.config();


// DB Connection
connectDB();

// Middleware
app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

module.exports = app;
