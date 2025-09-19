const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import database connection
const connectDB = require('./config/db');

// Import middleware
const errorHandler = require('./middleware/error');
const asyncHandler = require('./middleware/async');

// Import profile routes
const projectProfileRoutes = require('./routes/profile/projectProfiles');
const productProfileRoutes = require('./routes/profile/productProfiles');
const amcProfileRoutes = require('./routes/profile/amcProfiles');
const complaintProfileRoutes = require('./routes/profile/complaintProfiles');
const jobProfileRoutes = require('./routes/profile/jobProfiles');
const infoProfileRoutes = require('./routes/profile/infoProfiles');
const siteVisitScheduleRoutes = require('./routes/profile/siteVisitSchedules');
const profileMappingRoutes = require('./routes/profile/profileMappings');
const profileToProfileLinksRoutes = require('./routes/profile/profileToProfileLinks');
const teamsRoutes = require('./routes/profile/teams');
const notificationLogRoutes = require('./routes/profile/notificationLogs');
const userActivityLogRoutes = require('./routes/profile/userActivityLogs');
const customerMasterRoutes = require('./routes/profile/customerMaster');
const employeeRoutes = require('./routes/profile/employees');
const roleRoutes = require('./routes/profile/roles');

const app = express();

// Connect to database
connectDB();

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Enable CORS
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));

// API Routes
app.use('/api/profiles/project', projectProfileRoutes);
app.use('/api/profiles/product', productProfileRoutes);
app.use('/api/profiles/amc', amcProfileRoutes);
app.use('/api/profiles/complaint', complaintProfileRoutes);
app.use('/api/profiles/job', jobProfileRoutes);
app.use('/api/profiles/info', infoProfileRoutes);
app.use('/api/profiles/site-visit', siteVisitScheduleRoutes);
app.use('/api/profiles/mapping', profileMappingRoutes);
app.use('/api/profiles/links', profileToProfileLinksRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/notifications', notificationLogRoutes);
app.use('/api/user-activity-logs', userActivityLogRoutes);
app.use('/api/customers', customerMasterRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/roles', roleRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Profile Backend Server is running!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Profile Management Backend API',
        version: '1.0.0',
        endpoints: {
            profiles: {
                project: '/api/profiles/project',
                product: '/api/profiles/product',
                amc: '/api/profiles/amc',
                complaint: '/api/profiles/complaint',
                job: '/api/profiles/job',
                info: '/api/profiles/info',
                siteVisit: '/api/profiles/site-visit'
            },
            system: {
                mapping: '/api/profiles/mapping',
                links: '/api/profiles/links',
                teams: '/api/teams',
                notifications: '/api/notifications'
            },
            health: '/api/health'
        }
    });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Handle 404 routes
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`🚀 Profile Backend Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📋 API Documentation: http://localhost:${PORT}/`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => {
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    process.exit(1);
});

module.exports = app;