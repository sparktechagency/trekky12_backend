const express = require('express');
const connectDB = require('./config/db');
const app = express();
const authRoutes = require('./routes/auth.routes'); 
const userRoutes = require('./routes/user.routes');
const rvRoutes = require('./routes/rv.routes');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// DB Connection
connectDB();

// Middleware
app.use(express.json());


// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/rv', rvRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


module.exports = app;
