import test from 'node:test';
import assert from 'node:assert/strict';
import { UserService, AdminService } from '../services/UserService.js';

function createDbStub() {
  const queries = [];
  const db = async (sql, params = []) => {
    queries.push({ sql, params });
    if (sql.includes('INSERT INTO users')) {
      return [{ insertId: 1 }];
    }
    if (sql.includes('SELECT * FROM users WHERE id = ?')) {
      return [{ id: 1, name: 'Test User', email: 'test@example.com', role: 'student', enrolled_courses: '[]', userPoint: 500 }];
    }
    return [];
  };
  return { db, queries };
}

test('createUser rejects role injection attempts', async () => {
  const { db } = createDbStub();
  const service = new UserService(db);

  await assert.rejects(
    () => service.createUser({ name: 'Test', email: 'test@example.com', password: 'secret123', role: 'admin' }),
    /Only student accounts can be created through this flow/
  );
});

test('admin service rejects invalid role values', async () => {
  const { db } = createDbStub();
  const service = new AdminService(db);

  await assert.rejects(
    () => service.updateUserRole(1, 'superadmin'),
    /Role must be student, premium, or admin/
  );
});
