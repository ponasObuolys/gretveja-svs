// Vercel serverless function for debug API
const app = require('../debug-api');

// Export the handler function for Vercel
module.exports = (req, res) => {
  // Pass the request to the Express app
  return app(req, res);
};
