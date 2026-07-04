/**
 * Integration tests for payment and admin endpoints
 * Run: node src/tests/payment-admin.test.js (from BackEnd directory)
 */
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const BASE_URL = process.env.API_URL || 'http://localhost:3003/api';

async function request(method, path, body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

function assert(condition, message) {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`  ✓ ${message}`);
}

async function getToken(email, password) {
  const res = await request('POST', '/auth/login', { email, password });
  if (!res.data.data?.token) throw new Error(`Login failed for ${email}: ${JSON.stringify(res.data)}`);
  return res.data.data.token;
}

async function runTests() {
  console.log('\n=== CodeCatalyst Payment & Admin Tests ===\n');
  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      console.log(`\n[TEST] ${name}`);
      await fn();
      passed++;
      console.log(`[PASS] ${name}`);
    } catch (err) {
      failed++;
      console.error(`[FAIL] ${name}: ${err.message}`);
    }
  };

  await test('Health check', async () => {
    const res = await request('GET', '/health');
    assert(res.status === 200, 'Health endpoint returns 200');
    assert(res.data.success === true, 'Health returns success');
  });

  await test('Register rejects premium role injection', async () => {
    const email = `test_${Date.now()}@test.com`;
    const res = await request('POST', '/auth/register', {
      name: 'Test User',
      email,
      password: 'password123',
      role: 'premium'
    });
    assert(res.status === 201 || res.status === 200, 'Register succeeds');
    const loginRes = await request('POST', '/auth/login', { email, password: 'password123' });
    assert(loginRes.data.data.user.role === 'student', 'New user always gets student role');
  });

  await test('Direct points update blocked for non-admin', async () => {
    const token = await getToken('john@example.com', 'password123');
    const res = await request('PUT', '/auth/points', { points: 99999 }, token);
    assert(res.status === 403, 'Non-admin cannot set arbitrary points');
  });

  await test('Topup via payment API', async () => {
    const token = await getToken('john@example.com', 'password123');
    const profileBefore = await request('GET', '/auth/profile', null, token);
    const before = profileBefore.data.data.userPoint ?? 500;

    const res = await request('POST', '/payments/topup', { amount: 100 }, token);
    assert(res.status === 200, 'Topup returns 200');
    assert(res.data.data.userPoint > before, 'Points increased after topup');
  });

  await test('Admin stats includes premiumUsers', async () => {
    const token = await getToken('admin@codecatalyst.com', 'password123');
    const res = await request('GET', '/admin/stats', null, token);
    assert(res.status === 200, 'Admin stats returns 200');
    assert(res.data.data.premiumUsers !== undefined, 'Stats includes premiumUsers');
    assert(res.data.data.totalCourses !== undefined, 'Stats includes totalCourses');
  });

  await test('Admin course sales', async () => {
    const token = await getToken('admin@codecatalyst.com', 'password123');
    const res = await request('GET', '/admin/sales', null, token);
    assert(res.status === 200, 'Sales endpoint returns 200');
    assert(Array.isArray(res.data.data), 'Sales returns array');
  });

  await test('Admin users progress', async () => {
    const token = await getToken('admin@codecatalyst.com', 'password123');
    const res = await request('GET', '/admin/users-progress', null, token);
    assert(res.status === 200, 'Users progress returns 200');
    assert(Array.isArray(res.data.data), 'Users progress returns array');
  });

  await test('FAQ create requires admin', async () => {
    const studentToken = await getToken('john@example.com', 'password123');
    const res = await request('POST', '/faqs', {
      question: 'Test question from student?',
      answer: 'This should be blocked by admin middleware'
    }, studentToken);
    assert(res.status === 403, 'Student cannot create FAQ');
  });

  await test('FAQ CRUD as admin', async () => {
    const token = await getToken('admin@codecatalyst.com', 'password123');
    const createRes = await request('POST', '/faqs', {
      question: 'Test admin FAQ question?',
      answer: 'This is a test answer from admin integration test',
      category: 'testing'
    }, token);
    assert(createRes.status === 201, 'Admin can create FAQ');
    const faqId = createRes.data.data.id;

    const updateRes = await request('PUT', `/faqs/${faqId}`, {
      question: 'Updated test FAQ question?',
      answer: 'Updated answer from integration test run'
    }, token);
    assert(updateRes.status === 200, 'Admin can update FAQ');

    const deleteRes = await request('DELETE', `/faqs/${faqId}`, null, token);
    assert(deleteRes.status === 200, 'Admin can delete FAQ');
  });

  await test('Premium upgrade flow', async () => {
    const email = `premium_test_${Date.now()}@test.com`;
    await request('POST', '/auth/register', { name: 'Premium Test', email, password: 'password123' });
    let token = await getToken(email, 'password123');

    await request('POST', '/payments/topup', { amount: 5000 }, token);
    token = await getToken(email, 'password123');

    const upgradeRes = await request('POST', '/payments/upgrade-premium', null, token);
    assert(upgradeRes.status === 200, 'Premium upgrade succeeds');
    assert(upgradeRes.data.data.role === 'premium', 'Role updated to premium');

    const profile = await request('GET', '/auth/profile', null, token);
    assert(profile.data.data.role === 'premium', 'Profile reflects premium role');
  });

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Test runner error:', err.message);
  process.exit(1);
});
