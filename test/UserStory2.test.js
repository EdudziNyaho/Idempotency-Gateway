// UserStory2.test.js
// Tests for User Story 2: The Duplicate Attempt
// Acceptance Criteria:
// - Same key + same body returns cached response instantly
// - Server must NOT run processing logic again so no 2s delay
// - Server returns X-Cache-Hit: true header

const request = require('supertest');
const app = require('../index');

// Valid API key for testing
const VALID_API_KEY = 'test-api-key-123';

describe('User Story 2: Duplicate Request', () => {

  // Test 1: Duplicate request returns cached response
  test('should return cached response for duplicate request', async () => {

    // First request - processes payment
    const first = await request(app)
      .post('/process-payment')
      .set('X-API-Key', VALID_API_KEY)
      .set('Idempotency-Key', 'us2-test-key-001')
      .send({ amount: 200, currency: 'GHS' });

    // Second request - should return cached response
    const second = await request(app)
      .post('/process-payment')
      .set('X-API-Key', VALID_API_KEY)
      .set('Idempotency-Key', 'us2-test-key-001')
      .send({ amount: 200, currency: 'GHS' });

    // Should return same status code
    expect(second.status).toBe(201);

    // Should return X-Cache-Hit header
    expect(second.headers['x-cache-hit']).toBe('true');

    // Should return exact same transactionId as first request
    expect(second.body.transactionId).toBe(first.body.transactionId);
  });

  // Test 2: Duplicate request returns instantly (no 2s delay)
  test('should return cached response faster than 2 seconds', async () => {

    // First request
    await request(app)
      .post('/process-payment')
      .set('X-API-Key', VALID_API_KEY)
      .set('Idempotency-Key', 'us2-test-key-002')
      .send({ amount: 300, currency: 'GHS' });

    // Second request - measure time
    const start = Date.now();
    await request(app)
      .post('/process-payment')
      .set('X-API-Key', VALID_API_KEY)
      .set('Idempotency-Key', 'us2-test-key-002')
      .send({ amount: 300, currency: 'GHS' });
    const end = Date.now();

    // Should respond in less than 500ms
    expect(end - start).toBeLessThan(500);
  });

});