// Base Progress Class
export class Progress {
  constructor(courseId, userId) {
    this.courseId = courseId;
    this.userId = userId;
    this.completedLessons = 0;
    this.totalLessons = 0;
    this.completedModules = [];
    this.currentModule = 1;
    this.currentLesson = 1;
    this.percentage = 0;
    this.startedAt = null;
    this.lastAccessed = new Date();
    this.completedAt = null;
    this.timeSpent = 0; // in minutes
    this.milestones = [];
  }

  // Initialize progress with course data
  initialize(totalLessons, totalModules) {
    this.totalLessons = totalLessons;
    this.totalModules = totalModules;
    this.startedAt = new Date();
    this.calculatePercentage();
    return this;
  }

  // Mark lesson as completed
  completeLesson(lessonId, moduleId) {
    if (!this.completedLessonsData) {
      this.completedLessonsData = [];
    }

    // Check if lesson is already completed
    const isAlreadyCompleted = this.completedLessonsData.some(
      lesson => lesson.lessonId === lessonId && lesson.moduleId === moduleId
    );

    if (!isAlreadyCompleted) {
      this.completedLessonsData.push({
        lessonId,
        moduleId,
        completedAt: new Date()
      });
      this.completedLessons++;
      this.lastAccessed = new Date();
      this.calculatePercentage();
      this.checkMilestones();
      this.checkCompletion();
    }

    return this;
  }

  // Complete entire module
  completeModule(moduleId) {
    if (!this.completedModules.includes(moduleId)) {
      this.completedModules.push(moduleId);
      this.lastAccessed = new Date();
      this.checkMilestones();
      this.checkCompletion();
    }
    return this;
  }

  // Update current position
  updatePosition(moduleId, lessonId) {
    this.currentModule = moduleId;
    this.currentLesson = lessonId;
    this.lastAccessed = new Date();
    return this;
  }

  // Add time spent
  addTimeSpent(minutes) {
    this.timeSpent += minutes;
    return this;
  }

  // Calculate percentage
  calculatePercentage() {
    if (this.totalLessons > 0) {
      this.percentage = Math.round((this.completedLessons / this.totalLessons) * 100);
    } else {
      this.percentage = 0;
    }
    return this.percentage;
  }

  // Check and update milestones
  checkMilestones() {
    const percentage = this.percentage;
    
    if (percentage >= 25 && !this.milestones.includes(25)) {
      this.milestones.push(25);
    }
    if (percentage >= 50 && !this.milestones.includes(50)) {
      this.milestones.push(50);
    }
    if (percentage >= 75 && !this.milestones.includes(75)) {
      this.milestones.push(75);
    }
    if (percentage >= 100 && !this.milestones.includes(100)) {
      this.milestones.push(100);
    }
    
    return this.milestones;
  }

  // Check if course is completed
  checkCompletion() {
    if (this.percentage >= 100 && !this.completedAt) {
      this.completedAt = new Date();
    }
    return this.completedAt !== null;
  }

  // Get progress status
  getStatus() {
    if (this.percentage === 0) return 'Not Started';
    if (this.percentage < 25) return 'Just Started';
    if (this.percentage < 50) return 'In Progress';
    if (this.percentage < 75) return 'Halfway There';
    if (this.percentage < 100) return 'Almost Done';
    return 'Completed';
  }

  // Get progress color based on percentage
  getProgressColor() {
    if (this.percentage < 30) return '#ef4444'; // red
    if (this.percentage < 60) return '#f59e0b'; // yellow
    if (this.percentage < 90) return '#3b82f6'; // blue
    return '#10b981'; // green
  }

  // Get time spent in human readable format
  getTimeSpentFormatted() {
    const hours = Math.floor(this.timeSpent / 60);
    const minutes = this.timeSpent % 60;
    
    if (hours > 0) {
      return `${hours} jam ${minutes} menit`;
    }
    return `${minutes} menit`;
  }

  // Get estimated time remaining
  getEstimatedTimeRemaining() {
    if (this.percentage === 0 || this.timeSpent === 0) {
      return 'Unknown';
    }
    
    const avgTimePerLesson = this.timeSpent / this.completedLessons;
    const remainingLessons = this.totalLessons - this.completedLessons;
    const estimatedMinutes = remainingLessons * avgTimePerLesson;
    
    const hours = Math.floor(estimatedMinutes / 60);
    const minutes = Math.round(estimatedMinutes % 60);
    
    if (hours > 0) {
      return `~${hours} jam ${minutes} menit`;
    }
    return `~${minutes} menit`;
  }

  // Validate progress data
  validate() {
    const errors = [];
    
    if (!this.courseId) {
      errors.push('Course ID is required');
    }
    
    if (!this.userId) {
      errors.push('User ID is required');
    }
    
    if (this.completedLessons < 0) {
      errors.push('Completed lessons cannot be negative');
    }
    
    if (this.totalLessons < 0) {
      errors.push('Total lessons cannot be negative');
    }
    
    if (this.completedLessons > this.totalLessons) {
      errors.push('Completed lessons cannot exceed total lessons');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Convert to JSON
  toJSON() {
    return {
      courseId: this.courseId,
      userId: this.userId,
      completedLessons: this.completedLessons,
      totalLessons: this.totalLessons,
      completedModules: this.completedModules,
      currentModule: this.currentModule,
      currentLesson: this.currentLesson,
      percentage: this.percentage,
      startedAt: this.startedAt,
      lastAccessed: this.lastAccessed,
      completedAt: this.completedAt,
      timeSpent: this.timeSpent,
      milestones: this.milestones,
      completedLessonsData: this.completedLessonsData || []
    };
  }
}

// Course Progress Class (extends Progress)
export class CourseProgress extends Progress {
  constructor(courseId, userId, courseData) {
    super(courseId, userId);
    this.courseTitle = courseData.title;
    this.courseCategory = courseData.category;
    this.courseInstructor = courseData.instructor;
    this.initialize(courseData.lessons || 0, courseData.modules || 0);
  }

  // Get course summary
  getCourseSummary() {
    return {
      courseId: this.courseId,
      title: this.courseTitle,
      category: this.courseCategory,
      instructor: this.courseInstructor,
      progress: this.percentage,
      status: this.getStatus(),
      timeSpent: this.getTimeSpentFormatted(),
      estimatedRemaining: this.getEstimatedTimeRemaining(),
      startedAt: this.startedAt,
      lastAccessed: this.lastAccessed,
      completedAt: this.completedAt
    };
  }

  // Get detailed progress report
  getDetailedReport() {
    return {
      ...this.getCourseSummary(),
      completedLessons: this.completedLessons,
      totalLessons: this.totalLessons,
      completedModules: this.completedModules.length,
      totalModules: this.totalModules,
      currentModule: this.currentModule,
      currentLesson: this.currentLesson,
      milestones: this.milestones,
      color: this.getProgressColor()
    };
  }
}

// Progress Manager Class
export class ProgressManager {
  constructor() {
    this.progressRecords = new Map(); // Map of userId -> Map of courseId -> Progress
  }

  // Create or get progress for user
  getOrCreateProgress(courseId, userId, courseData) {
    if (!this.progressRecords.has(userId)) {
      this.progressRecords.set(userId, new Map());
    }

    const userProgress = this.progressRecords.get(userId);
    
    if (!userProgress.has(courseId)) {
      const progress = new CourseProgress(courseId, userId, courseData);
      userProgress.set(courseId, progress);
    }

    return userProgress.get(courseId);
  }

  // Update progress
  updateProgress(courseId, userId, updateData) {
    const progress = this.getOrCreateProgress(courseId, userId, updateData.courseData || {});
    
    if (updateData.completedLesson) {
      progress.completeLesson(updateData.completedLesson.lessonId, updateData.completedLesson.moduleId);
    }
    
    if (updateData.completedModule) {
      progress.completeModule(updateData.completedModule);
    }
    
    if (updateData.position) {
      progress.updatePosition(updateData.position.moduleId, updateData.position.lessonId);
    }
    
    if (updateData.timeSpent) {
      progress.addTimeSpent(updateData.timeSpent);
    }
    
    return progress;
  }

  // Get progress for specific course
  getProgress(courseId, userId) {
    const userProgress = this.progressRecords.get(userId);
    if (userProgress) {
      return userProgress.get(courseId);
    }
    return null;
  }

  // Get all progress for user
  getUserProgress(userId) {
    const userProgress = this.progressRecords.get(userId);
    if (userProgress) {
      return Array.from(userProgress.values());
    }
    return [];
  }

  // Get user progress summary
  getUserProgressSummary(userId) {
    const userProgressList = this.getUserProgress(userId);
    
    return {
      totalCourses: userProgressList.length,
      inProgress: userProgressList.filter(p => p.percentage > 0 && p.percentage < 100).length,
      completed: userProgressList.filter(p => p.percentage === 100).length,
      notStarted: userProgressList.filter(p => p.percentage === 0).length,
      overallCompletion: userProgressList.length > 0 
        ? Math.round(userProgressList.reduce((sum, p) => sum + p.percentage, 0) / userProgressList.length)
        : 0,
      totalTimeSpent: userProgressList.reduce((sum, p) => sum + p.timeSpent, 0),
      courses: userProgressList.map(p => p.getCourseSummary())
    };
  }

  // Get course progress statistics
  getCourseProgressStats(courseId) {
    const courseProgressList = [];
    
    for (let userProgress of this.progressRecords.values()) {
      const progress = userProgress.get(courseId);
      if (progress) {
        courseProgressList.push(progress);
      }
    }
    
    if (courseProgressList.length === 0) {
      return null;
    }
    
    return {
      courseId,
      totalEnrolled: courseProgressList.length,
      completed: courseProgressList.filter(p => p.percentage === 100).length,
      inProgress: courseProgressList.filter(p => p.percentage > 0 && p.percentage < 100).length,
      notStarted: courseProgressList.filter(p => p.percentage === 0).length,
      averageProgress: Math.round(courseProgressList.reduce((sum, p) => sum + p.percentage, 0) / courseProgressList.length),
      averageTimeSpent: Math.round(courseProgressList.reduce((sum, p) => sum + p.timeSpent, 0) / courseProgressList.length),
      completionRate: Math.round((courseProgressList.filter(p => p.percentage === 100).length / courseProgressList.length) * 100)
    };
  }

  // Delete progress record
  deleteProgress(courseId, userId) {
    const userProgress = this.progressRecords.get(userId);
    if (userProgress) {
      return userProgress.delete(courseId);
    }
    return false;
  }

  // Get leaderboards
  getLeaderboards(type = 'completion') {
    const allUsers = new Map();
    
    // Collect all user progress
    for (let [userId, userProgress] of this.progressRecords.entries()) {
      const progressList = Array.from(userProgress.values());
      
      if (progressList.length > 0) {
        let score = 0;
        
        switch (type) {
          case 'completion':
            score = progressList.filter(p => p.percentage === 100).length;
            break;
          case 'progress':
            score = Math.round(progressList.reduce((sum, p) => sum + p.percentage, 0) / progressList.length);
            break;
          case 'time':
            score = progressList.reduce((sum, p) => sum + p.timeSpent, 0);
            break;
          case 'courses':
            score = progressList.length;
            break;
        }
        
        allUsers.set(userId, {
          userId,
          score,
          progressCount: progressList.length,
          completedCount: progressList.filter(p => p.percentage === 100).length
        });
      }
    }
    
    // Sort by score
    const sorted = Array.from(allUsers.values()).sort((a, b) => b.score - a.score);
    
    return sorted.slice(0, 10); // Top 10
  }
}
