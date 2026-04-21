// MemoryStore.js
// In-memory storage for the Idempotency Gateway
// Uses JavaScript Maps to store idempotency keys and responses

const idempotencyStore = new Map();

const MemoryStore = {
  // Finds a value based on idempotency key
  getKey: (key) => idempotencyStore.get(key),

  // Save a key value set to the Map
  setKey: (key, value) => idempotencyStore.set(key, value),

  // Check if an idempotency key already exists
  hasKey: (key) => idempotencyStore.has(key),
};

module.exports = MemoryStore;