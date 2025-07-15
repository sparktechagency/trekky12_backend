const express = require('express');
const connectDB = require('./config/db');
const app = express();
// const authRoutes = require('./routes/auth.routes'); 
// const userRoutes = require('./routes/user.routes');
// const rvRoutes = require('./routes/rv.routes');
// const membershipRoutes = require('./routes/membership.routes')
// const insuranceRoutes = require('./routes/insurance.routes');
// const maintenanceRoutes = require('./routes/maintenance.routes');
// const repairRoutes = require('./routes/repair.routes');
const dotenv = require('dotenv');
// const path = require('path');
// const newExpenseRoutes = require('./routes/newExpense.routes');
// const tripsRoutes = require('./routes/trips.routes');
// const chassisRoutes = require('./routes/chessis.routes');
// const tireRoutes = require('./routes/appliance.routes/tire.routes');

dotenv.config();

// DB Connection
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes
app.use('/api/auth', require('./app/module/Auth/auth.router'));
app.use('/api/user', require('./app/module/User/user.router'));
app.use('/api/rv', require('./app/module/RV/rv.router'));
app.use('/api/chassis', require('./app/module/Chassis/chassis.router'));
app.use('/api/tire', require('./app/module/Tire/tire.router'));
app.use('/api/heater', require('./app/module/Heater/heater.router'));
app.use('/api/air-condition', require('./app/module/Air-condition/air-condition.router'));
app.use('/api/water-pump', require('./app/module/WaterPump/waterPump.router'));

// app.use('/api/auth', authRoutes);
// app.use('/api/user', userRoutes);
// app.use('/api/rv', rvRoutes);
// app.use('/api/membership', membershipRoutes);
// app.use('/api/insurance', insuranceRoutes);
// app.use('/api/maintenance', maintenanceRoutes);
// app.use('/api/repair', repairRoutes);
// app.use('/api/expenses', newExpenseRoutes);
// app.use('/api/trips', tripsRoutes);
// app.use('/api/chassis', chassisRoutes);
// app.use('/api/appliance/tire', tireRoutes);
// app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


module.exports = app;
