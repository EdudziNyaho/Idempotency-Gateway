// UserStory3.test.js
// Tests for User Story 3: Tests for Same Idempotency key with different body
// Acceptance Criteria:
// - Same key + different body returns 422 error
// - Error message states key was used for different request body

const request = require('supertest');
const app = require('../index');

// Valid API key for testing
const VALID_API_KEY = 'test-api-key-123';

describe('User Story 3: Conflict Check', () => {

  // Test 1: Same key different amount returns 422
  test('should return 422 for same key with different amount', async () => {

    // First request
    await request(app)
      .post('/process-payment')
      .set('X-API-Key', VALID_API_KEY)
      .set('Idempotency-Key', 'us3-test-key-001')
      .send({ amount: 100, currency: 'GHS' });

    // Second request with same key but different amount
    const response = await request(app)
      .post('/process-payment')
      .set('X-API-Key', VALID_API_KEY)
      .set('Idempotency-Key', 'us3-test-key-001')
      .send({ amount: 500, currency: 'GHS' });

    expect(response.status).toBe(422);
    expect(response.body.error).toBe(
      'Idempotency key already used for a different request body.'
    );
  });

  // Test 2: Same key different currency returns 422
  test('should return 422 for same key with different currency', async () => {

    // First request
    await request(app)
      .post('/process-payment')
      .set('X-API-Key', VALID_API_KEY)
      .set('Idempotency-Key', 'us3-test-key-002')
      .send({ amount: 100, currency: 'GHS' });

    // Second request with same key but different currency
    const response = await request(app)
      .post('/process-payment')
      .set('X-API-Key', VALID_API_KEY)
      .set('Idempotency-Key', 'us3-test-key-002')
      .send({ amount: 100, currency: 'USD' });

    expect(response.status).toBe(422);
    expect(response.body.error).toBe(
      'Idempotency key already used for a different request body.'
    );
  });

});