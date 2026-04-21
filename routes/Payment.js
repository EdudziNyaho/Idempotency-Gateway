// Payment.js
// Handles the POST /process-payment endpoint
// Address User Story 1: The First Transaction

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const MemoryStore = require('../store/MemoryStore');

const router = express.Router();

// POST /process-payment
router.post('/', async (req, res) => {
  
  // Get the idempotency key from the request header
  const idempotencyKey = req.headers['idempotency-key'];

  // Get the request body (amount and currency)
  const { amount, currency } = req.body;

  // Check if idempotency key is missing
  if (!idempotencyKey) {
    return res.status(400).json({
      error: 'Missing Idempotency-Key header'
    });
  }

  // Check if amount and currency are missing
  if (!amount || !currency) {
    return res.status(400).json({
      error: 'Missing amount or currency in request body'
    });
  }

  // Simulate payment processing (2 second delay)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Generate a unique transaction ID
  const transactionId = uuidv4();

  // Build the response
  const response = {
    transactionId,
    status: 'success',
    message: `Charged ${amount} ${currency}`,
  };

  // Save to memory store
  MemoryStore.setKey(idempotencyKey, {
    response,
    body: req.body,
  });

  // Return 201 Created
  return res.status(201).json(response);
});

module.exports = router;