import { BaseModel } from './BaseModel.js';

export class Progress extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.user_id = data.user_id || null;
    this.course_id = data.course_id || null;
    this.completed_lessons = data.completed_lessons || 0;
    this.total_lessons = data.total_lessons || 0;
    this.percentage = data.percentage || 0;
    this.started_at = data.started_at || null;
    this.last_accessed = data.last_accessed || new Date().toISOString();
    this.completed_at = data.completed_at || null;
    this.completed_lessons_data = data.completed_lessons_data || [];
    this.time_spent = data.time_spent || 0;
  }

  validate() {
    super.validate();
    
    if (!this.user_id) {
      throw new Error('User ID is required');
    }
    
    if (!this.course_id) {
      throw new Error('Course ID is required');
    }
    
    if (this.completed_lessons < 0) {
      throw new Error('Completed lessons cannot be negative');
    }
    
    if (this.total_lessons < 0) {
      throw new Error('Total lessons cannot be negative');
    }
    
    if (this.completed_lessons > this.total_lessons) {
      throw new Error('Completed lessons cannot exceed total lessons');
    }
    
    if (this.percentage < 0 || this.percentage > 100) {
      throw new Error('Percentage must be between 0 and 100');
    }
    
    return true;
  }

  updateProgress(completedLessons) {
    this.completed_lessons = Math.min(completedLessons, this.total_lessons);
    this.percentage = this.total_lessons > 0 ? Math.round((this.completed_lessons / this.total_lessons) * 100) : 0;
    this.last_accessed = new Date().toISOString();
    
    if (this.percentage === 100 && !this.completed_at) {
      this.completed_at = new Date().toISOString();
    }
  }


  addCompletedLesson(lessonId, moduleId) {
    const lessonData = {
      lessonId,
      moduleId,
      completedAt: new Date().toISOString()
    };
    
    const exists = this.completed_lessons_data.some(
      lesson => lesson.lessonId === lessonId && lesson.moduleId === moduleId
    );
    
    if (!exists) {
      this.completed_lessons_data.push(lessonData);
      this.updateProgress(this.completed_lessons + 1);
    }
  }

  isCompleted() {
    return this.percentage === 100;
  }

  isLessonCompleted(lessonId, moduleId) {
    return this.completed_lessons_data.some(
      lesson => lesson.lessonId === lessonId && lesson.moduleId === moduleId
    );
  }

  getCompletionStatus() {
    if (this.percentage === 0) return 'Not Started';
    if (this.percentage === 100) return 'Completed';
    return 'In Progress';
  }

  toJSON() {
    const data = super.toJSON();
    return {
      ...data,
      user_id: this.user_id,
      course_id: this.course_id,
      completed_lessons: this.completed_lessons,
      total_lessons: this.total_lessons,
      percentage: this.percentage,
      started_at: this.started_at,
      last_accessed: this.last_accessed,
      completed_at: this.completed_at,
      completed_lessons_data: this.completed_lessons_data,
      time_spent: this.time_spent,
      status: this.getCompletionStatus()
    };
  }

  static create(progressData) {
    const progress = new Progress(progressData);
    progress.validate();
    return progress;
  }
}
