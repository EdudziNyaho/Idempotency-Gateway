// UserStory1.test.js
// Tests for User Story 1: The First Transaction
// Acceptance Criteria:
// - API accepts POST request to /process-payment
// - Request header must contain Idempotency-Key
// - Request body accepts JSON with amount and currency
// - Server returns 201 Created with "Charged 100 GHS"

const request = require('supertest');
const app = require('../index');

// Valid API key for testing
const VALID_API_KEY = 'test-api-key-123';

describe('User Story 1: First Transaction', () => {

  // Test 1: Happy path - successful payment
  test('should process a new payment successfully', async () => {
    const response = await request(app)
      .post('/process-payment')
      .set('X-API-Key', VALID_API_KEY)
      .set('Idempotency-Key', 'us1-test-key-001')
      .send({ amount: 100, currency: 'GHS' });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Charged 100 GHS');
    expect(response.body.transactionId).toBeDefined();
  });

  // Test 2: Missing amount
  test('should return 400 if amount is missing', async () => {
    const response = await request(app)
      .post('/process-payment')
      .set('X-API-Key', VALID_API_KEY)
      .set('Idempotency-Key', 'us1-test-key-002')
      .send({ currency: 'GHS' });

    expect(response.status).toBe(400);
  });

  // Test 3: Missing currency
  test('should return 400 if currency is missing', async () => {
    const response = await request(app)
      .post('/process-payment')
      .set('X-API-Key', VALID_API_KEY)
      .set('Idempotency-Key', 'us1-test-key-003')
      .send({ amount: 100 });

    expect(response.status).toBe(400);
  });

});