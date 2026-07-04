import { BaseModel } from './BaseModel.js';

export class Course extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.slug = data.slug || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.category = data.category || '';
    this.instructor = data.instructor || '';
    this.duration = data.duration || '';
    this.level = data.level || 'Beginner';
    this.modules = data.modules || 0;
    this.lessons = data.lessons || 0;
    this.projects = data.projects || 0;
    this.price = data.price || 0;
    this.original_price = data.original_price || 0;
    this.rating = data.rating || 0;
    this.students = data.students || 0;
    this.is_locked = data.is_locked || false;
    this.is_free = data.is_free || false;
    this.topics = data.topics || [];
    this.thumbnail_url = data.thumbnail_url || '';
  }

  validate() {
    super.validate();
    
    if (!this.title || this.title.trim().length < 3) {
      throw new Error('Title must be at least 3 characters long');
    }
    
    if (!this.description || this.description.trim().length < 10) {
      throw new Error('Description must be at least 10 characters long');
    }
    
    if (!this.category) {
      throw new Error('Category is required');
    }
    
    if (!['html', 'css', 'js', 'bootstrap', 'react'].includes(this.category)) {
      throw new Error('Category must be html, css, js, bootstrap, or react');
    }
    
    if (!['Beginner', 'Intermediate', 'Advanced'].includes(this.level)) {
      throw new Error('Level must be Beginner, Intermediate, or Advanced');
    }
    
    return true;
  }

  isAccessible(userRole = 'student') {
    if (this.is_free) return true;
    if (userRole === 'admin') return true;
    if (userRole === 'premium' && !this.is_locked) return true;
    return false;
  }

  getDiscountPercentage() {
    if (this.original_price <= 0) return 0;
    return Math.round(((this.original_price - this.price) / this.original_price) * 100);
  }

  addStudent() {
    this.students += 1;
  }

  toJSON() {
    const data = super.toJSON();
    return {
      ...data,
      slug: this.slug,
      title: this.title,
      description: this.description,
      category: this.category,
      instructor: this.instructor,
      duration: this.duration,
      level: this.level,
      modules: this.modules,
      lessons: this.lessons,
      projects: this.projects,
      price: this.price,
      original_price: this.original_price,
      discount_percentage: this.getDiscountPercentage(),
      rating: this.rating,
      students: this.students,
      is_locked: this.is_locked,
      is_free: this.is_free,
      topics: this.topics,
      thumbnail_url: this.thumbnail_url
    };
  }

  static create(courseData) {
    const course = new Course(courseData);
    course.validate();
    return course;
  }
}
