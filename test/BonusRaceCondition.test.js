// BonusRaceCondition.test.js
// Tests for Bonus User Story: The "In-Flight" Check
// Acceptance Criteria:
// - Request B should not start a new process
// - Request B should not return 409 Conflict
// - Request B should wait and return the result of Request A

const request = require('supertest');
const app = require('../index');

// Valid API key for testing
const VALID_API_KEY = 'test-api-key-123';

describe('Bonus: Race Condition Handling', () => {

  // Test 1: Two simultaneous requests return same result
  test('should return same result for simultaneous requests', async () => {

    // Send two requests at the exact same time
    const [first, second] = await Promise.all([
      request(app)
        .post('/process-payment')
        .set('X-API-Key', VALID_API_KEY)
        .set('Idempotency-Key', 'race-test-key-001')
        .send({ amount: 100, currency: 'GHS' }),

      request(app)
        .post('/process-payment')
        .set('X-API-Key', VALID_API_KEY)
        .set('Idempotency-Key', 'race-test-key-001')
        .send({ amount: 100, currency: 'GHS' }),
    ]);

    // Both should succeed
    expect(first.status).toBe(201);
    expect(second.status).toBe(201);

    // Both should return same transactionId
    expect(first.body.transactionId).toBe(second.body.transactionId);

    // One should be a cache hit
    expect(second.headers['x-cache-hit']).toBe('true');
  });

  // Test 2: Request B should not return 409
  test('should not return 409 for simultaneous requests', async () => {

    const [, second] = await Promise.all([
      request(app)
        .post('/process-payment')
        .set('X-API-Key', VALID_API_KEY)
        .set('Idempotency-Key', 'race-test-key-002')
        .send({ amount: 200, currency: 'GHS' }),

      request(app)
        .post('/process-payment')
        .set('X-API-Key', VALID_API_KEY)
        .set('Idempotency-Key', 'race-test-key-002')
        .send({ amount: 200, currency: 'GHS' }),
    ]);

    // Should NOT return 409
    expect(second.status).not.toBe(409);
  });

});