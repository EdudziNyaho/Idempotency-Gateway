// Idempotency.js
// Middleware code that checks for duplicate payment requests
//  Path 1 addresses User Story 2: The Duplicate Attempt
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

    // User Story 3: Same key but different request body
    if (JSON.stringify(savedEntry.body) !== JSON.stringify(req.body)) {
      return res.status(422).json({
        error: 'Idempotency key already used for a different request.'
      });
    }

    // User Story 2: Same key and same body - return cached response
    res.set('X-Cache-Hit', 'true');
    return res.status(201).json(savedEntry.response);
  }

  // Key not found - move on to payment route
  next();
};

module.exports = idempotencyMiddleware;