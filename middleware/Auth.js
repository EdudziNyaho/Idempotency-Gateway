// Auth.js
// Middleware that checks for a valid API key for Developer's choice

const MemoryStore = require('../store/MemoryStore');

const authMiddleware = (req, res, next) => {

  // Get the API key from the request header
  const apiKey = req.headers['x-api-key'];

  // If no API key provided return 401 Unauthorized
  if (!apiKey) {
    return res.status(401).json({
      error: 'No API key Provided'
    });
  }

  // Check if API key is valid
  if (!MemoryStore.isValidApiKey(apiKey)) {
    return res.status(401).json({
      error: 'Invalid API key'
    });
  }

  // API key is valid - move on to next middleware
  next();
};

module.exports = authMiddleware;