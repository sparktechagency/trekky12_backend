const express = require('express');
const connectDB = require('./config/db');
const app = express();
const authRoutes = require('./routes/auth.routes'); 
const userRoutes = require('./routes/user.routes');
const rvRoutes = require('./routes/rv.routes');
const membershipRoutes = require('./routes/membership.routes')
const insuranceRoutes = require('./routes/insurance.routes');
const maintenanceRoutes = require('./routes/maintenance.routes');
const repairRoutes = require('./routes/repair.routes');
const dotenv = require('dotenv');
const path = require('path');
const newExpenseRoutes = require('./routes/newExpense.routes');
const tripsRoutes = require('./routes/trips.routes');

dotenv.config();

// DB Connection
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/rv', rvRoutes);
app.use('/api/membership', membershipRoutes);
app.use('/api/insurance', insuranceRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/repair', repairRoutes);
app.use('/api/expenses', newExpenseRoutes);
app.use('/api/trips', tripsRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


module.exports = app;
