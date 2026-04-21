// index.js

const express = require('express');

// Import routes
const paymentRoute = require('./routes/Payment');

const transactionRoute = require('./routes/Transactions');
const authMiddleware = require('./middleware/Auth');

// Import middleware
const idempotencyMiddleware = require('./middleware/Idempotency');

// Initialize Express app
const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// Apply auth middleware to all routes
app.use(authMiddleware);

// Apply idempotency middleware to payment route only
app.use('/process-payment', idempotencyMiddleware);

// Routes
app.use('/process-payment', paymentRoute);
app.use('/transactions', transactionRoute);

// Test route to confirm server is running
app.get('/', (req, res) => {
  res.json({ message: 'Idempotency Backend is Running!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;