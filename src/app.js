const express = require('express');
const connectDB = require('./config/db');
const app = express();
const {authRoutes, userRoutes } = require('./routes/auth.routes'); 
const dotenv = require('dotenv');
const insuranceRoutes = require('./routes/insurance.routes');
const path = require('path');
const membershipRoutes = require('./routes/membership.routes');

// const userRoutes = require('./routes/user.routes');

dotenv.config();

// DB Connection
connectDB();

// Middleware
app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/insurance', insuranceRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


module.exports = app;
