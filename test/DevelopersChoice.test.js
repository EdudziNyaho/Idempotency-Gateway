// DevelopersChoice.test.js
// Tests for Developer's Choice Features:
// 1. API Key Authentication
// 2. Transaction History

const request = require('supertest');
const app = require('../index');

// Valid API keys for testing
const VALID_API_KEY = 'test-api-key-123';
const ANOTHER_VALID_API_KEY = 'client-api-key-456';

describe("Developer's Choice: Authentication", () => {

  // Test 1: No API key returns 401
  test('should return 401 if no API key provided', async () => {
    const response = await request(app)
      .post('/process-payment')
      .set('Idempotency-Key', 'dc-test-key-001')
      .send({ amount: 100, currency: 'GHS' });

    expect(response.status).toBe(401);
    expect(response.body.error).toBeDefined();
  });

  // Test 2: Invalid API key returns 401
  test('should return 401 if invalid API key provided', async () => {
    const response = await request(app)
      .post('/process-payment')
      .set('X-API-Key', 'wrong-key-999')
      .set('Idempotency-Key', 'dc-test-key-002')
      .send({ amount: 100, currency: 'GHS' });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Invalid API key');
  });

  // Test 3: Valid API key allows access
  test('should allow access with valid API key', async () => {
    const response = await request(app)
      .post('/process-payment')
      .set('X-API-Key', VALID_API_KEY)
      .set('Idempotency-Key', 'dc-test-key-003')
      .send({ amount: 100, currency: 'GHS' });

    expect(response.status).toBe(201);
  });

});

describe("Developer's Choice: Transaction History", () => {

  // Test 4: Returns transaction history for valid API key
  test('should return transaction history for valid API key', async () => {
    const response = await request(app)
      .get('/transactions')
      .set('X-API-Key', VALID_API_KEY);

    expect(response.status).toBe(200);
    expect(response.body.transactions).toBeDefined();
    expect(response.body.count).toBeDefined();
  });

  // Test 5: Returns 401 for transactions without API key
  test('should return 401 for transactions without API key', async () => {
    const response = await request(app)
      .get('/transactions');

    expect(response.status).toBe(401);
  });

  // Test 6: Each client only sees their own transactions
  test('should only return transactions for the requesting API key', async () => {

    // Client A makes a payment
    await request(app)
      .post('/process-payment')
      .set('X-API-Key', VALID_API_KEY)
      .set('Idempotency-Key', 'dc-test-key-004')
      .send({ amount: 100, currency: 'GHS' });

    // Client B makes a payment
    await request(app)
      .post('/process-payment')
      .set('X-API-Key', ANOTHER_VALID_API_KEY)
      .set('Idempotency-Key', 'dc-test-key-005')
      .send({ amount: 500, currency: 'GHS' });

    // Client A gets their transactions
    const response = await request(app)
      .get('/transactions')
      .set('X-API-Key', VALID_API_KEY);

    // Client A should NOT see Client B's transactions
    const hasOtherClientTransaction = response.body.transactions
      .some(t => t.apiKey === ANOTHER_VALID_API_KEY);

    expect(hasOtherClientTransaction).toBe(false);
  });

});