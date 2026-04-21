// MemoryStore.js
// In-memory storage for the Idempotency Gateway
// Uses JavaScript Maps and Sets to store data

// Stores idempotency keys and their responses
const idempotencyStore = new Map();

// Stores all completed transactions
const transactionStore = new Map();

// Pre-defined valid API keys
// In a real system these would be stored in a database
const validApiKeys = new Set([
  "test-api-key-123",
  "client-api-key-456"
]);

const MemoryStore = {
  // ─── IDEMPOTENCY ────────────────────────────────

  // Get a saved response by idempotency key
  getKey: (key) => idempotencyStore.get(key),

  // Save a response against an idempotency key
  setKey: (key, value) => idempotencyStore.set(key, value),

  // Check if an idempotency key already exists
  hasKey: (key) => idempotencyStore.has(key),

  // ─── AUTH ───────────────────────────────────────

  // Check if an API key is valid
  isValidApiKey: (key) => validApiKeys.has(key),

  // ─── TRANSACTIONS ───────────────────────────────

  // Save a completed transaction
  saveTransaction: (id, data) => transactionStore.set(id, data),

  // Get all transactions belonging to a specific API key
  getTransactions: (apiKey) => {
    return Array.from(transactionStore.values())
      .filter(transaction => transaction.apiKey === apiKey);
  },
};

module.exports = MemoryStore;