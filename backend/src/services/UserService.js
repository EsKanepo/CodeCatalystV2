import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const ALLOWED_ROLES = ['student', 'premium', 'admin'];

function normalizeRole(role, fallback = 'student') {
  const normalized = String(role ?? fallback).trim().toLowerCase();
  if (!ALLOWED_ROLES.includes(normalized)) {
    throw new Error('Role must be student, premium, or admin');
  }
  return normalized;
}

export class BaseService {
  constructor(database) {
    this.db = database;
  }

  async executeQuery(sql, params = []) {
    try {
      return await this.db(sql, params);
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }
}

export class UserService extends BaseService {
  constructor(database) {
    super(database);
    this.jwtSecret = env.JWT_SECRET;
  }

  async findByEmail(email) {
    const result = await this.executeQuery(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    
    const user = result[0];
    if (user && typeof user.enrolled_courses === 'string') {
      try {
        user.enrolled_courses = JSON.parse(user.enrolled_courses);
      } catch (e) {
        user.enrolled_courses = [];
      }
    }
    
    return user;
  }

  async loginUser(email, password) {
    const user = await this.findByEmail(email);
    
    if (!user) {
      throw new Error('User not found');
    }

    // If user has no password (Google/Facebook user), they can't login with email/password
    if (!user.password_hash) {
      throw new Error('Invalid password');
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    // Remove password hash from user object for security
    const { password_hash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async createUser(userData) {
    const { name, email, password, role = 'student', allowRoleOverride = false } = userData;
    const normalizedRole = normalizeRole(role, 'student');

    if (!allowRoleOverride && normalizedRole !== 'student') {
      throw new Error('Only student accounts can be created through this flow');
    }

    let hashedPassword = null;

    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const result = await this.executeQuery(
      'INSERT INTO users (name, email, password_hash, role, enrolled_courses, userPoint) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, normalizedRole, JSON.stringify([]), 500]
    );
    
    const users = await this.executeQuery(
      'SELECT * FROM users WHERE id = ?',
      [result.insertId]
    );
    
    // Ensure enrolled_courses is properly formatted
    const user = users[0];
    if (user && typeof user.enrolled_courses === 'string') {
      user.enrolled_courses = JSON.parse(user.enrolled_courses);
    }

    return user;
  }

  async getUserById(userId) {
    const users = await this.executeQuery(
      'SELECT id, name, email, role, enrolled_courses, userPoint, created_at FROM users WHERE id = ?', 
      [userId]
    );
    
    if (users.length === 0) {
      throw new Error('User not found');
    }
    
    const user = users[0];
    return {
      ...user,
      enrolled_courses: typeof user.enrolled_courses === 'string' 
        ? JSON.parse(user.enrolled_courses) 
        : user.enrolled_courses
    };
  }

  async updateUserPoints(userId, newPoints) {
    console.log(`[USER SERVICE] updateUserPoints called with userId: ${userId}, newPoints: ${newPoints}`);
    
    await this.executeQuery(
      'UPDATE users SET userPoint = ? WHERE id = ?',
      [newPoints, userId]
    );
    
    console.log(`[USER SERVICE] Database UPDATE executed for userId: ${userId}`);
    
    const user = await this.getUserById(userId);
    console.log(`[USER SERVICE] getUserById returned userPoint: ${user.userPoint}`);
    return user;
  }

  async checkUserExists(email) {
    const users = await this.executeQuery('SELECT id FROM users WHERE email = ?', [email]);
    return users.length > 0;
  }

  generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      this.jwtSecret,
      { expiresIn: '24h' }
    );
  }

  sanitizeUser(user) {
    const { password_hash: _, ...userWithoutPassword } = user;
    // Ensure enrolled_courses is properly formatted
    if (userWithoutPassword.enrolled_courses && typeof userWithoutPassword.enrolled_courses === 'string') {
      userWithoutPassword.enrolled_courses = JSON.parse(userWithoutPassword.enrolled_courses);
    }
    return userWithoutPassword;
  }
}

export class AdminService extends UserService {
  constructor(database) {
    super(database);
  }

  async getAllUsers() {
    const users = await this.executeQuery('SELECT id, name, email, role, created_at FROM users');
    return users;
  }

  async updateUserRole(userId, newRole) {
    const normalizedRole = normalizeRole(newRole);

    await this.executeQuery(
      'UPDATE users SET role = ? WHERE id = ?',
      [normalizedRole, userId]
    );
    
    return await this.getUserById(userId);
  }

  async deleteUser(userId) {
    const user = await this.getUserById(userId);
    await this.executeQuery('DELETE FROM users WHERE id = ?', [userId]);
    
    return user;
  }

  async getSystemStats() {
    const [userCount] = await this.executeQuery('SELECT COUNT(*) as total FROM users');
    const [courseCount] = await this.executeQuery('SELECT COUNT(*) as total FROM courses');
    const [enrollmentCount] = await this.executeQuery('SELECT COUNT(*) as total FROM enrollments');
    const [premiumCount] = await this.executeQuery("SELECT COUNT(*) as total FROM users WHERE role = 'premium'");
    const [adminCount] = await this.executeQuery("SELECT COUNT(*) as total FROM users WHERE role = 'admin'");
    const [studentCount] = await this.executeQuery("SELECT COUNT(*) as total FROM users WHERE role = 'student'");
    
    return {
      totalUsers: userCount.total,
      totalCourses: courseCount.total,
      totalEnrollments: enrollmentCount.total,
      premiumUsers: premiumCount.total,
      adminUsers: adminCount.total,
      studentUsers: studentCount.total
    };
  }

  async getCourseSales() {
    const sales = await this.executeQuery(`
      SELECT 
        c.id,
        c.title,
        c.category,
        c.price,
        c.is_locked,
        c.is_free,
        COUNT(e.id) as purchase_count,
        COUNT(CASE WHEN e.status = 'active' THEN 1 END) as active_enrollments,
        COUNT(CASE WHEN e.status = 'completed' THEN 1 END) as completed_enrollments
      FROM courses c
      LEFT JOIN enrollments e ON c.id = e.course_id
      GROUP BY c.id, c.title, c.category, c.price, c.is_locked, c.is_free
      ORDER BY purchase_count DESC, c.title ASC
    `);
    return sales;
  }

async getAllUsersWithProgress() {
    const users = await this.executeQuery(`
       SELECT id, name, email, role, enrolled_courses, userPoint, created_at
       FROM users
       ORDER BY created_at DESC
     `);

    // Get all progress data with course info
    const progress = await this.executeQuery(`
        SELECT
          p.user_id,
          p.course_id,
          p.percentage,
          p.completed_lessons,
          p.total_lessons,
          p.last_accessed,
          p.started_at,
          e.status as enrollment_status,
          c.title as course_title,
          c.category as course_category,
          c.duration as course_duration,
          c.modules as course_weeks
        FROM progress p
        JOIN courses c ON p.course_id = c.id
        LEFT JOIN enrollments e ON e.user_id = p.user_id AND e.course_id = p.course_id
        ORDER BY p.user_id, p.course_id
      `);

     return users.map(user => {
       const enrolled = typeof user.enrolled_courses === 'string'
         ? JSON.parse(user.enrolled_courses || '[]')
         : (user.enrolled_courses || []);

       const userProgress = progress.filter(p => p.user_id === user.id);

       return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            userPoint: user.userPoint ?? 0,
            created_at: user.created_at,
            enrolledCourseIds: enrolled,
            courses: userProgress.map(p => {
              // completed_lessons = weeks completed (1-8)
              // total_lessons = total weeks (8)
              const weeksCompleted = parseInt(p.completed_lessons) || 0;
              const totalWeeks = parseInt(p.total_lessons) || parseInt(p.course_weeks) || 8;

              // Calculate percentage (ensure max 100%)
              let percentage = parseFloat(p.percentage) || 0;
              if (percentage > 100) percentage = 100;

              return {
                courseId: p.course_id,
                courseTitle: p.course_title,
                courseCategory: p.course_category,
                courseDuration: p.course_duration,
                weeksCompleted: Math.min(weeksCompleted, totalWeeks),
                totalWeeks: totalWeeks,
                percentage: percentage,
                enrollmentStatus: p.enrollment_status || 'active',
                lastAccessed: p.last_accessed,
                startedAt: p.started_at
              };
            })
          };
     });
   }

  async getUserProgressDetail(userId) {
    const users = await this.getAllUsersWithProgress();
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    return user;
  }
}
