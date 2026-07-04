import { BaseModel } from './BaseModel.js';
import bcrypt from 'bcryptjs';

export class User extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.name = data.name || '';
    this.email = data.email || '';
    this.password_hash = data.password_hash || '';
    this.role = data.role || 'student';
    this.enrolled_courses = data.enrolled_courses || [];
  }

  
  validate() {
    super.validate();
    
    if (!this.name || this.name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }
    
    if (!this.email || !this.email.includes('@')) {
      throw new Error('Valid email is required');
    }
    
    if (this.role && !['student', 'premium', 'admin'].includes(this.role)) {
      throw new Error('Role must be student, premium, or admin');
    }
    
    return true;
  }


  async verifyPassword(password) {
    return await bcrypt.compare(password, this.password_hash);
  }

  async setPassword(password) {
    this.password_hash = await bcrypt.hash(password, 10);
  }

  toJSON() {
    const data = super.toJSON();
    return {
      ...data,
      name: this.name,
      email: this.email,
      role: this.role,
      enrolled_courses: this.enrolled_courses
    };
  }

  enrollInCourse(courseId) {
    if (!this.enrolled_courses.includes(courseId)) {
      this.enrolled_courses.push(courseId);
    }
  }

  isEnrolledInCourse(courseId) {
    return this.enrolled_courses.includes(courseId);
  }

  static async create(userData) {
    const user = new User(userData);
    await user.setPassword(userData.password);
    user.validate();
    return user;
  }
}
