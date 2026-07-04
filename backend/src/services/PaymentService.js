import { BaseService } from './UserService.js';

const PREMIUM_UPGRADE_COST = 1500;

export function getCoinPrice(coursePrice, isFree) {
  if (isFree) return 0;
  const price = parseFloat(coursePrice) || 0;
  if (price <= 299000) return 100;
  if (price <= 499000) return 200;
  if (price <= 699000) return 300;
  if (price <= 899000) return 400;
  return 500;
}

function calculateTopupBonus(amount) {
  if (amount >= 5000) return Math.floor(amount * 0.1);
  if (amount >= 2500) return Math.floor(amount * 0.05);
  if (amount >= 1000) return Math.floor(amount * 0.025);
  if (amount >= 500) return 50;
  if (amount >= 250) return 25;
  return 0;
}

export class PaymentService extends BaseService {
  constructor(database, enrollmentService, transactionFn) {
    super(database);
    this.enrollmentService = enrollmentService;
    this.transaction = transactionFn;
  }

  async logTransaction(userId, type, amount, balanceAfter, referenceId = null, description = null, queryFn = null) {
    const exec = queryFn || ((sql, params) => this.executeQuery(sql, params));
    try {
      await exec(
        `INSERT INTO point_transactions (user_id, type, amount, balance_after, reference_id, description)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, type, amount, balanceAfter, referenceId, description]
      );
    } catch (err) {
      console.warn('[PaymentService] Could not log transaction:', err.message);
    }
  }

  async topup(userId, amount) {
    if (!Number.isInteger(amount) || amount < 100 || amount > 10000) {
      throw new Error('Nominal topup harus antara 100 dan 10.000 CodePoints');
    }

    const bonus = calculateTopupBonus(amount);
    const total = amount + bonus;

    const run = async (exec) => {
      const users = await exec('SELECT userPoint FROM users WHERE id = ? FOR UPDATE', [userId]);
      if (!users || users.length === 0) throw new Error('User not found');

      const currentPoints = users[0].userPoint ?? 0;
      const newBalance = currentPoints + total;

      await exec('UPDATE users SET userPoint = ? WHERE id = ?', [newBalance, userId]);
      await this.logTransaction(userId, 'topup', total, newBalance, null, `Topup ${amount} + bonus ${bonus}`, exec);

      return { userPoint: newBalance, amountAdded: total, bonus, previousBalance: currentPoints };
    };

    return this._withTransaction(run);
  }

  async purchaseCourse(userId, courseId) {
    const run = async (exec) => {
      const courses = await exec('SELECT * FROM courses WHERE id = ?', [courseId]);
      if (courses.length === 0) throw new Error('Course not found');

      const course = courses[0];

      if (course.is_free) {
        return this.enrollmentService.enrollUser(userId, courseId, exec);
      }

      const price = getCoinPrice(course.price, course.is_free);

      const users = await exec('SELECT userPoint, role, enrolled_courses FROM users WHERE id = ? FOR UPDATE', [userId]);
      if (users.length === 0) throw new Error('User not found');

      const user = users[0];
      const currentRole = String(user.role || 'student').toLowerCase();
      if (currentRole === 'premium' || currentRole === 'admin') {
        return this.enrollmentService.enrollUser(userId, courseId, exec);
      }

      const enrolled = typeof user.enrolled_courses === 'string'
        ? JSON.parse(user.enrolled_courses || '[]')
        : (user.enrolled_courses || []);

      if (enrolled.includes(courseId)) {
        throw new Error('Already enrolled in this course');
      }

      const currentPoints = user.userPoint ?? 0;
      if (currentPoints < price) {
        throw new Error('Insufficient CodePoints');
      }

      const newBalance = currentPoints - price;
      await exec('UPDATE users SET userPoint = ? WHERE id = ?', [newBalance, userId]);
      await this.logTransaction(userId, 'purchase', -price, newBalance, courseId, `Beli kursus: ${course.title}`, exec);

      const result = await this.enrollmentService.enrollUser(userId, courseId, exec);
      return { ...result, userPoint: newBalance, coinsSpent: price };
    };

    return this._withTransaction(run);
  }

  async upgradeToPremium(userId) {
    const run = async (exec) => {
      const users = await exec('SELECT userPoint, role FROM users WHERE id = ? FOR UPDATE', [userId]);
      if (!users || users.length === 0) throw new Error('User not found');

      const user = users[0];
      const currentRole = String(user.role || 'student').toLowerCase();
      if (currentRole === 'premium' || currentRole === 'admin') {
        throw new Error('User is already premium');
      }

      if (currentRole !== 'student') {
        throw new Error('Only student accounts can upgrade to premium');
      }

      const currentPoints = user.userPoint ?? 0;
      if (currentPoints < PREMIUM_UPGRADE_COST) {
        throw new Error('Insufficient CodePoints for premium upgrade');
      }

      const newBalance = currentPoints - PREMIUM_UPGRADE_COST;
      await exec('UPDATE users SET userPoint = ?, role = ? WHERE id = ?', [newBalance, 'premium', userId]);
      await this.logTransaction(userId, 'premium_upgrade', -PREMIUM_UPGRADE_COST, newBalance, null, 'Upgrade ke Premium', exec);

      return { role: 'premium', userPoint: newBalance, cost: PREMIUM_UPGRADE_COST };
    };

    return this._withTransaction(run);
  }

  async _withTransaction(callback) {
    if (this.transaction) {
      return this.transaction(async (connection) => {
        const exec = async (sql, params) => {
          const [rows] = await connection.execute(sql, params);
          return rows;
        };
        return callback(exec);
      });
    }

    const exec = (sql, params) => this.executeQuery(sql, params);
    return callback(exec);
  }

  static getPremiumCost() {
    return PREMIUM_UPGRADE_COST;
  }
}
