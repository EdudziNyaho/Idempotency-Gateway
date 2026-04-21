// Transactions.js
// Handles the GET /transactions endpoint for Developer's Choice

const express = require('express');
const MemoryStore = require('../store/MemoryStore');

const router = express.Router();

// GET /transactions
router.get('/', (req, res) => {

  // Get the API key from the request header
  const apiKey = req.headers['x-api-key'];

  // Get all transactions belonging to this API key
  const transactions = MemoryStore.getTransactions(apiKey);

  // Return the transactions
  return res.status(200).json({
    count: transactions.length,
    transactions,
  });
});

module.exports = router;