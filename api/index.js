// Vercel Serverless API handler
const path = require('path');
const fs = require('fs');

// Set up environment for backend
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// Dynamically import the compiled backend server
module.exports = async (req, res) => {
  try {
    // Redirect API requests to the backend server
    const serverModule = require('../backend/dist/server');
    
    // If the server exports a handler function, use it
    if (typeof serverModule.default === 'function') {
      return serverModule.default(req, res);
    }
    
    // Otherwise, respond with a message
    return res.json({
      message: 'Gretvėja-SVS API serveris veikia Vercel platformoje'
    });
  } catch (error) {
    console.error('API klaida:', error);
    return res.status(500).json({
      error: 'Serverio klaida',
      message: error.message
    });
  }
};
