// Vercel serverless function for simplified API
const app = require('../simplified');

// Export the handler function for Vercel
module.exports = (req, res) => {
  // Pass the request to the Express app
  return app(req, res);
};
