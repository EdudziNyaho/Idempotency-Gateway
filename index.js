// index.js
// index.js

const express = require('express');

// Import routes
const paymentRoute = require('./routes/Payment');

// Initialize Express app
const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// Routes
app.use('/process-payment', paymentRoute);

// Test route to confirm server is running
app.get('/', (req, res) => {
  res.json({ message: 'Idempotency Gateway is running!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;