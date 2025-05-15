const express = require('express');
const connectDB = require('./config/db');
const app = express();
const authRoutes = require('./routes/auth.routes'); 
const dotenv = require('dotenv');
const path = require('path');
const userRoutes = require('./routes/user.routes');

dotenv.config();

// DB Connection
connectDB();

// Middleware
app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


module.exports = app;
