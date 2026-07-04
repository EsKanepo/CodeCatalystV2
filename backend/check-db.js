import { initializeDatabase, query } from './src/database.js';

async function check() {
  await initializeDatabase();
  const users = await query("SELECT id, name, email, role FROM users WHERE email = 'admin@codecatalyst.com'");
  console.log(users);
  process.exit(0);
}

check();
