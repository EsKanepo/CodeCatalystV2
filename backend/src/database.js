import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from './config/env.js';

const dbConfig = {
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

export async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    
    await connection.query('CREATE DATABASE IF NOT EXISTS codecatalyst_lms');
    await connection.query('USE codecatalyst_lms');
    
    await createTables(connection);
    await insertSampleData(connection);
    
    connection.release();
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

async function createTables(connection) {
  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255),
      role ENUM('student', 'premium', 'admin') DEFAULT 'student',
      enrolled_courses JSON,
      userPoint INT DEFAULT 500,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS courses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(255) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      category VARCHAR(100) NOT NULL,
      instructor VARCHAR(255) NOT NULL,
      duration VARCHAR(50) NOT NULL,
      level ENUM('Beginner', 'Intermediate', 'Advanced') NOT NULL,
      modules INT DEFAULT 0,
      lessons INT DEFAULT 0,
      projects INT DEFAULT 0,
      price DECIMAL(10,2) DEFAULT 0,
      original_price DECIMAL(10,2) DEFAULT 0,
      rating DECIMAL(3,2) DEFAULT 0,
      students INT DEFAULT 0,
      is_locked BOOLEAN DEFAULT FALSE,
      is_free BOOLEAN DEFAULT FALSE,
      topics JSON,
      thumbnail_url VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS enrollments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      course_id INT,
      enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      status ENUM('active', 'completed', 'suspended') DEFAULT 'active',
      UNIQUE KEY unique_enrollment (user_id, course_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS progress (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      course_id INT,
      completed_lessons INT DEFAULT 0,
      total_lessons INT DEFAULT 0,
      percentage DECIMAL(5,2) DEFAULT 0,
      started_at TIMESTAMP NULL,
      last_accessed TIMESTAMP NULL,
      completed_at TIMESTAMP NULL,
      completed_lessons_data JSON,
      time_spent INT DEFAULT 0,
      UNIQUE KEY unique_progress (user_id, course_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS testimonials (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NULL,
      course_id INT NULL,
      name VARCHAR(255) NOT NULL DEFAULT 'Anonymous',
      email VARCHAR(255) NULL,
      role_title VARCHAR(255) DEFAULT 'Student',
      course_category VARCHAR(100) DEFAULT 'General',
      rating INT CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
      testimonial TEXT NOT NULL,
      is_approved BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
    )`,
    `CREATE TABLE IF NOT EXISTS faqs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      question VARCHAR(255) NOT NULL,
      answer TEXT NOT NULL,
      category VARCHAR(100) DEFAULT 'general',
      is_active BOOLEAN DEFAULT TRUE,
      order_index INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS contacts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      subject VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      is_read BOOLEAN DEFAULT FALSE,
      is_replied BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      replied_at TIMESTAMP NULL
    )`,
    `CREATE TABLE IF NOT EXISTS schedules (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      instructor VARCHAR(255),
      day_of_week VARCHAR(20),
      start_time TIME,
      end_time TIME,
      course_id INT NULL,
      is_premium BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
    )`,
    `CREATE TABLE IF NOT EXISTS point_transactions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      type ENUM('topup', 'purchase', 'premium_upgrade', 'refund', 'admin_adjust') NOT NULL,
      amount INT NOT NULL,
      balance_after INT NOT NULL,
      reference_id INT NULL,
      description VARCHAR(500) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`
  ];

  for (const table of tables) {
    await connection.query(table);
  }

  const alterStatements = [
    `ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS name VARCHAR(255) NOT NULL DEFAULT 'Anonymous'`,
    `ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS email VARCHAR(255) NULL`,
    `ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS role_title VARCHAR(255) DEFAULT 'Student'`,
    `ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS course_category VARCHAR(100) DEFAULT 'General'`,
    `ALTER TABLE users MODIFY COLUMN role ENUM('student', 'premium', 'admin') DEFAULT 'student'`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS userPoint INT DEFAULT 500`,
    `ALTER TABLE testimonials MODIFY COLUMN IF EXISTS is_approved BOOLEAN DEFAULT TRUE`,
    `ALTER TABLE testimonials MODIFY COLUMN IF EXISTS user_id INT NULL`,
    `ALTER TABLE testimonials MODIFY COLUMN IF EXISTS course_id INT NULL`,
  ];

  for (const alter of alterStatements) {
    try {
      await connection.query(alter);
    } catch (e) {
    }
  }
}

async function insertSampleData(connection) {
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const users = [
    ['Admin User', 'admin@codecatalyst.com', passwordHash, 'admin', JSON.stringify([1, 2, 3, 4, 5, 6]), 5000],
    ['John Doe', 'john@example.com', passwordHash, 'student', JSON.stringify([]), 500],
    ['Jane Smith', 'jane@example.com', passwordHash, 'premium', JSON.stringify([1, 2, 3]), 500]
  ];

  // modules = jumlah minggu/bulan, lessons = jumlah total materi
  // courses: [id, slug, title, description, category, instructor, duration, level, modules, lessons, projects, ...]
  const courses = [
    [1, 'html-fundamentals', 'HTML Fundamental', 'Pelajari dasar-dasar HTML5 dari struktur dokumen hingga semantic elements', 'html', 'Nicholian Tjuarsa', '8 minggu', 'Beginner', 8, 48, 5, 0, 299000, 4.8, 1250, false, true, JSON.stringify(['HTML5 Structure & Syntax', 'Semantic HTML Elements', 'Forms & Input Validation', 'Tables & Data Presentation']), 'https://via.placeholder.com/400x300/ff6b6b/ffffff?text=HTML'],
    [2, 'css-styling', 'CSS Styling & Layout', 'Master CSS3 dari basic styling hingga advanced layout techniques', 'css', 'Anggara Adelee', '8 minggu', 'Beginner', 8, 48, 6, 0, 349000, 4.9, 980, false, true, JSON.stringify(['CSS Fundamentals & Selectors', 'Box Model & Typography', 'Flexbox Layout', 'CSS Grid Layout']), 'https://via.placeholder.com/400x300/4ecdc4/ffffff?text=CSS'],
    [3, 'javascript-basics', 'JavaScript Dasar', 'Pelajari JavaScript dari nol hingga intermediate', 'js', 'Ethan Wilbert', '8 minggu', 'Intermediate', 7, 48, 8, 499000, 649000, 4.7, 750, true, false, JSON.stringify(['JavaScript Fundamentals', 'Functions & Scope', 'DOM Manipulation', 'Event Handling', 'ES6+ Features']), 'https://via.placeholder.com/400x300/45b7d1/ffffff?text=JavaScript'],
    [4, 'bootstrap-intro', 'Bootstrap Framework', 'Master Bootstrap 5 untuk rapid development', 'bootstrap', 'Devin Owen Sanusi', '3 minggu', 'Intermediate', 3, 18, 3, 249000, 349000, 4.6, 620, true, false, JSON.stringify(['Bootstrap Setup & Basics', 'Layout System & Grid', 'Bootstrap Components', 'Utilities & Helpers']), 'https://via.placeholder.com/400x300/96ceb4/ffffff?text=Bootstrap'],
    [5, 'react-development', 'React Development', 'Pelajari React dari dasar hingga advanced', 'react', 'Ethan Wilbert', '8 minggu', 'Advanced', 5, 60, 10, 699000, 899000, 4.8, 450, true, false, JSON.stringify(['React Fundamentals', 'Components & Props', 'State & Lifecycle', 'React Hooks Deep Dive']), 'https://via.placeholder.com/400x300/6c5ce7/ffffff?text=React'],
    [6, 'nodejs-backend', 'Node.js Backend Development', 'Pelajari server-side JavaScript dengan Node.js. REST API, database, authentication, dan deployment ke cloud platforms.', 'nodejs', 'Ethan Wilbert', '8 minggu', 'Advanced', 8, 60, 7, 599000, 799000, 4.7, 320, true, false, JSON.stringify(['Node.js Fundamentals', 'Express.js Framework', 'RESTful API Design', 'Database Integration', 'Authentication & Security', 'Testing & Debugging', 'Deployment & DevOps', 'Performance Optimization']), 'https://via.placeholder.com/400x300/333333/ffffff?text=NodeJS'],
    [7, 'vue-development', 'Vue.js Modern Development', 'Master Vue.js 3 dengan Composition API. Pelajari reactive programming, component architecture, dan modern Vue ecosystem.', 'vue', 'Anggara Adelee', '8 minggu', 'Advanced', 8, 48, 6, 549000, 699000, 4.6, 280, true, false, JSON.stringify(['Vue.js Fundamentals', 'Composition API', 'Reactivity System', 'Components & Props', 'Vue Router', 'State Management with Pinia', 'Vue Ecosystem', 'Testing & Deployment']), 'https://via.placeholder.com/400x300/42b883/ffffff?text=Vue'],
    [8, 'typescript-masterclass', 'TypeScript Masterclass', 'Master TypeScript untuk JavaScript development', 'typescript', 'Michael Johnson', '6 minggu', 'Advanced', 6, 36, 5, 399000, 549000, 4.7, 520, true, false, JSON.stringify(['TypeScript Basics', 'Advanced Types', 'Generics & Utility Types', 'Integration with Frameworks']), 'https://via.placeholder.com/400x300/3178c6/ffffff?text=TypeScript'],
    [9, 'git-github-workflow', 'Git & GitHub Workflow', 'Master version control dengan Git. Collaboration, branching strategies, CI/CD, dan open source contribution best practices.', 'git', 'Nicholian Tjuarsa', '3 minggu', 'Beginner', 3, 18, 3, 0, 199000, 4.5, 890, false, true, JSON.stringify(['Git Fundamentals', 'Branching & Merging', 'Remote Repositories', 'Collaboration Workflow', 'GitHub Features', 'CI/CD Basics', 'Open Source Contribution', 'Best Practices']), 'https://via.placeholder.com/400x300/f05032/ffffff?text=GitHub'],
    [10, 'docker-containerization', 'Docker Containerization', 'Pelajari containerization dengan Docker. Build, ship, dan run applications dengan Docker containers dan orchestration.', 'docker', 'Ethan Wilbert', '4 minggu', 'Advanced', 4, 24, 4, 449000, 599000, 4.7, 150, true, false, JSON.stringify(['Docker Fundamentals', 'Container Management', 'Dockerfile Best Practices', 'Docker Compose', 'Networking & Volumes', 'Multi-stage Builds', 'Container Orchestration', 'Production Deployment']), 'https://via.placeholder.com/400x300/2496ed/ffffff?text=Docker']
  ];

  for (const user of users) {
    await connection.query('INSERT INTO users (name, email, password_hash, role, enrolled_courses, userPoint) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE userPoint = VALUES(userPoint)', user);
  }

  for (const course of courses) {
    await connection.query('INSERT INTO courses (id, slug, title, description, category, instructor, duration, level, modules, lessons, projects, price, original_price, rating, students, is_locked, is_free, topics, thumbnail_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE slug = VALUES(slug), title = VALUES(title), description = VALUES(description), category = VALUES(category), instructor = VALUES(instructor), duration = VALUES(duration), level = VALUES(level), modules = VALUES(modules), lessons = VALUES(lessons), projects = VALUES(projects), price = VALUES(price), original_price = VALUES(original_price), rating = VALUES(rating), students = VALUES(students), is_locked = VALUES(is_locked), is_free = VALUES(is_free), topics = VALUES(topics), thumbnail_url = VALUES(thumbnail_url)', course);
  }
}

// Migration function to recalculate progress based on weeks (modules)
export async function migrateProgressData() {
  try {
    console.log('[Migration] Starting progress data migration...');

    // Get all progress records with their course info
    const progressRecords = await query(`
      SELECT p.*, c.modules
      FROM progress p
      JOIN courses c ON p.course_id = c.id
    `);

    console.log(`[Migration] Found ${progressRecords.length} progress records to update`);

    for (const progress of progressRecords) {
      const totalWeeks = progress.modules || 8;
      const completedWeeks = Math.min(progress.completed_lessons, totalWeeks);

      // Calculate percentage (max 100%)
      let percentage = totalWeeks > 0
        ? Math.round((completedWeeks / totalWeeks) * 100)
        : 0;
      if (percentage > 100) percentage = 100;

      // Update the progress record
      await query(
        `UPDATE progress SET total_lessons = ?, percentage = ? WHERE id = ?`,
        [totalWeeks, percentage, progress.id]
      );

      console.log(`[Migration] Updated progress ${progress.id}: ${completedWeeks}/${totalWeeks} weeks = ${percentage}%`);
    }

    console.log('[Migration] Progress data migration completed successfully');
    return { success: true, updated: progressRecords.length };
  } catch (error) {
    console.error('[Migration] Error during progress data migration:', error);
    throw error;
  }
}

// Run migration on startup if needed
export async function runMigrations() {
  try {
    // Check if migration is needed (by checking if total_lessons doesn't match modules)
    const progressNeedsMigration = await query(`
      SELECT COUNT(*) as count FROM progress p
      JOIN courses c ON p.course_id = c.id
      WHERE p.total_lessons != c.modules OR p.percentage > 100
    `);

    if (progressNeedsMigration[0].count > 0) {
      console.log(`[Migration] ${progressNeedsMigration[0].count} progress records need migration`);
      await migrateProgressData();
    } else {
      console.log('[Migration] No migration needed for progress data');
    }
  } catch (error) {
    console.error('[Migration] Migration check failed:', error);
    // Don't throw - migrations shouldn't block the app
  }
}

export async function query(sql, params = []) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
}

export async function transaction(callback) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
