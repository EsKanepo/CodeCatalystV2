import { BaseService } from './UserService.js';

export class EnrollmentService extends BaseService {
  constructor(database, transaction = null) {
    super(database);
    this.transaction = transaction;
  }

  async enrollUser(userId, courseId, queryFn = null) {
    const exec = queryFn || ((sql, params) => this.executeQuery(sql, params));

    try {
      console.log('Enrolling user', userId, 'in course', courseId);

      const courses = await exec('SELECT * FROM courses WHERE id = ?', [courseId]);
      if (courses.length === 0) {
        throw new Error('Course not found');
      }

      const course = courses[0];

      const existingEnrollments = await exec(
        'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
        [userId, courseId]
      );

      if (existingEnrollments.length > 0) {
        throw new Error('Already enrolled in this course');
      }

      await exec(
        'INSERT INTO enrollments (user_id, course_id, status) VALUES (?, ?, ?)',
        [userId, courseId, 'active']
      );

      await exec(
        'INSERT INTO progress (user_id, course_id, completed_lessons, total_lessons, percentage, started_at, last_accessed, completed_lessons_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, courseId, 0, course.lessons || 0, 0, new Date(), new Date(), JSON.stringify([])]
      );

      const users = await exec(
        'SELECT enrolled_courses FROM users WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        throw new Error('User not found');
      }

      const rawEnrolledCourses = users[0].enrolled_courses;
      const enrolledCourses = Array.isArray(rawEnrolledCourses)
        ? rawEnrolledCourses
        : JSON.parse(rawEnrolledCourses || '[]');
      if (!enrolledCourses.includes(courseId)) {
        enrolledCourses.push(courseId);
      }

      await exec(
        'UPDATE users SET enrolled_courses = ? WHERE id = ?',
        [JSON.stringify(enrolledCourses), userId]
      );

      console.log('Successfully enrolled user', userId, 'in course', courseId);

      return {
        userId,
        courseId,
        status: 'active',
        enrolledAt: new Date(),
      };
    } catch (error) {
      console.error('Enrollment error:', error);
      throw error;
    }
  }

  async getUserEnrollments(userId) {
    const enrollments = await this.executeQuery(`
      SELECT e.*, c.title, c.description, c.category, c.instructor, 
             c.thumbnail_url, c.rating, c.lessons
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.user_id = ?
      ORDER BY e.enrolled_at DESC
    `, [userId]);

    return enrollments;
  }

  async getCourseEnrollments(courseId) {
    const enrollments = await this.executeQuery(`
      SELECT e.*, u.name, u.email, u.role
      FROM enrollments e
      JOIN users u ON e.user_id = u.id
      WHERE e.course_id = ?
      ORDER BY e.enrolled_at DESC
    `, [courseId]);

    return enrollments;
  }

  async updateEnrollmentStatus(userId, courseId, status) {
    await this.executeQuery(
      'UPDATE enrollments SET status = ? WHERE user_id = ? AND course_id = ?',
      [status, userId, courseId]
    );

    return { userId, courseId, status, updatedAt: new Date() };
  }

  async unenrollUser(userId, courseId) {
    const enrollment = await this.executeQuery(
      'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );

    if (enrollment.length === 0) {
      throw new Error('Enrollment not found');
    }

    await this.executeQuery(
      'DELETE FROM enrollments WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );

    const [userRows] = await this.executeQuery(
      'SELECT enrolled_courses FROM users WHERE id = ?',
      [userId]
    );
    
    const rawEnrolledCourses = userRows[0].enrolled_courses;
    const enrolledCourses = Array.isArray(rawEnrolledCourses)
      ? rawEnrolledCourses
      : JSON.parse(rawEnrolledCourses || '[]');
    const updatedCourses = enrolledCourses.filter(id => id !== courseId);
    
    await this.executeQuery(
      'UPDATE users SET enrolled_courses = ? WHERE id = ?',
      [JSON.stringify(updatedCourses), userId]
    );

    return enrollment[0];
  }

  async getEnrollmentStats(courseId) {
    const [stats] = await this.executeQuery(`
      SELECT 
        COUNT(*) as total_enrollments,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_enrollments,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_enrollments,
        COUNT(CASE WHEN status = 'suspended' THEN 1 END) as suspended_enrollments
      FROM enrollments 
      WHERE course_id = ?
    `, [courseId]);

    return stats;
  }
}
