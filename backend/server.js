// server.js - Main backend entry point
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');
const studentRoutes = require('./routes/student');
const tpoRoutes = require('./routes/tpo');
const mentorRoutes = require('./routes/mentor');
const recruiterRoutes = require('./routes/recruiter');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/student', studentRoutes);
app.use('/api/tpo', tpoRoutes);
app.use('/api/mentor', mentorRoutes);
app.use('/api/recruiter', recruiterRoutes);

// Basic test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Campus Connect API Server',
    status: 'Running',
    version: '1.0.0'
  });
});

// Test database connection route
app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    res.json({ 
      message: 'Database connected successfully!',
      result: rows[0].result 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Database connection failed',
      message: error.message 
    });
  }
});

// Import routes
const authRoutes = require('./routes/auth');

// Use routes
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}`);
});