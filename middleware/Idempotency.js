// Idempotency.js
// Middleware code that checks for duplicate payment requests
//  Path 1 addresses User Story 2: The Duplicate Attempt
//  Path 1b: addresses race condition. Under path 1 if condition checks if process is still ongoing
//  waits until it is done before following path 1
//  Path 2 addresses User Story 3: Different Request Same Key (Conflict Check)


const MemoryStore = require('../store/MemoryStore');

const idempotencyMiddleware = async (req, res, next) => {

  // Get the idempotency key from the request header
  const idempotencyKey = req.headers['idempotency-key'];

  // If no key provided, skip to the next middleware
  if (!idempotencyKey) {
    return next();
  }

  // Check if this key has been used before
  if (MemoryStore.hasKey(idempotencyKey)) {

    // Get the saved entry from the store
    const savedEntry = MemoryStore.getKey(idempotencyKey);

    // Bonus: Key is in-flight (being processed by another request)
    if (savedEntry.status === 'pending') {
      
      // Wait and keep checking until it is complete
      const result = await waitForCompletion(idempotencyKey);

      // Return the result of the first request
      res.set('X-Cache-Hit', 'true');
      return res.status(201).json(result.response);
    }

    // User Story 3: Same key but different request body
    if (JSON.stringify(savedEntry.body) !== JSON.stringify(req.body)) {
      return res.status(422).json({
        error: 'Idempotency key already used for a different request body.'
      });
    }

    // User Story 2: Same key and same body - return cached response
    res.set('X-Cache-Hit', 'true');
    return res.status(201).json(savedEntry.response);
  }

  // Key not found - move on to payment route
  next();
};

// Helper function to wait for a pending request to complete
const waitForCompletion = (idempotencyKey) => {
  return new Promise((resolve) => {
    
    // Check every 100ms if the request is complete
    const interval = setInterval(() => {
      const entry = MemoryStore.getKey(idempotencyKey);

      // If complete stop checking and return result
      if (entry && entry.status === 'complete') {
        clearInterval(interval);
        resolve(entry);
      }
    }, 100);
  });
};

module.exports = idempotencyMiddleware;