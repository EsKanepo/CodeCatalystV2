// Base User Class
export class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.enrolledCourses = [];
    this.progress = {};
    this.createdAt = new Date();
    this.lastLogin = new Date();
  }

  // Enroll in a course
  enrollCourse(courseId) {
    if (!this.enrolledCourses.includes(courseId)) {
      this.enrolledCourses.push(courseId);
      this.progress[courseId] = {
        completedLessons: 0,
        totalLessons: 0,
        percentage: 0,
        startedAt: new Date(),
        lastAccessed: new Date()
      };
      return true;
    }
    return false;
  }

  // Update course progress
  updateProgress(courseId, completedLessons, totalLessons) {
    if (!this.progress[courseId]) {
      this.progress[courseId] = {
        completedLessons: 0,
        totalLessons: totalLessons || 0,
        percentage: 0,
        startedAt: new Date(),
        lastAccessed: new Date()
      };
    }

    this.progress[courseId].completedLessons = completedLessons;
    this.progress[courseId].totalLessons = totalLessons || this.progress[courseId].totalLessons;
    this.progress[courseId].percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    this.progress[courseId].lastAccessed = new Date();

    return this.progress[courseId];
  }

  // Get course progress
  getCourseProgress(courseId) {
    return this.progress[courseId] || {
      completedLessons: 0,
      totalLessons: 0,
      percentage: 0,
      startedAt: null,
      lastAccessed: null
    };
  }

  // Check if user has access to course
  hasAccessToCourse(courseId) {
    return this.enrolledCourses.includes(courseId);
  }

  // Get all enrolled courses
  getEnrolledCourses() {
    return this.enrolledCourses;
  }

  // Get courses in progress
  getCoursesInProgress() {
    return this.enrolledCourses.filter(courseId => {
      const progress = this.progress[courseId];
      return progress && progress.percentage > 0 && progress.percentage < 100;
    });
  }

  // Get completed courses
  getCompletedCourses() {
    return this.enrolledCourses.filter(courseId => {
      const progress = this.progress[courseId];
      return progress && progress.percentage === 100;
    });
  }

  // Get overall progress statistics
  getProgressStats() {
    const totalCourses = this.enrolledCourses.length;
    const inProgress = this.getCoursesInProgress().length;
    const completed = this.getCompletedCourses().length;
    const notStarted = totalCourses - inProgress - completed;

    return {
      totalCourses,
      inProgress,
      completed,
      notStarted,
      completionRate: totalCourses > 0 ? Math.round((completed / totalCourses) * 100) : 0
    };
  }

  // Validate user data
  validate() {
    const errors = [];
    
    if (!this.name || this.name.trim().length === 0) {
      errors.push('Name is required');
    }
    
    if (!this.email || this.email.trim().length === 0) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(this.email)) {
      errors.push('Invalid email format');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Email validation helper
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      enrolledCourses: this.enrolledCourses,
      progress: this.progress,
      createdAt: this.createdAt,
      lastLogin: this.lastLogin
    };
  }
}

// Premium User Class (inherits from User)
export class PremiumUser extends User {
  constructor(id, name, email, subscriptionLevel = 'premium') {
    super(id, name, email);
    this.subscriptionLevel = subscriptionLevel;
    this.subscriptionStart = new Date();
    this.features = [
      'Access to all courses',
      'Priority support',
      'Certificate of completion',
      'Downloadable resources',
      '1-on-1 mentorship',
      'Career guidance'
    ];
  }

  // Override hasAccessToCourse - premium users have access to all courses
  hasAccessToCourse(courseId) {
    return true; // Premium users have access to all courses
  }

  // Get subscription benefits
  getSubscriptionBenefits() {
    return this.features;
  }

  // Check if subscription is active
  isSubscriptionActive() {
    // For demo purposes, assume subscription is always active
    return true;
  }

  // Get subscription status
  getSubscriptionStatus() {
    return {
      level: this.subscriptionLevel,
      start: this.subscriptionStart,
      active: this.isSubscriptionActive(),
      features: this.features
    };
  }
}

// User Factory Class
export class UserFactory {
  static createUser(userData, isPremium = false) {
    const { id, name, email, subscriptionLevel } = userData;
    
    if (isPremium || userData.subscriptionLevel) {
      return new PremiumUser(id, name, email, subscriptionLevel);
    }
    
    return new User(id, name, email);
  }

  static createFromJSON(jsonData) {
    const { id, name, email, subscriptionLevel } = jsonData;
    
    if (subscriptionLevel && subscriptionLevel !== 'basic') {
      const user = new PremiumUser(id, name, email, subscriptionLevel);
      user.enrolledCourses = jsonData.enrolledCourses || [];
      user.progress = jsonData.progress || {};
      user.createdAt = new Date(jsonData.createdAt);
      user.lastLogin = new Date(jsonData.lastLogin);
      return user;
    }
    
    const user = new User(id, name, email);
    user.enrolledCourses = jsonData.enrolledCourses || [];
    user.progress = jsonData.progress || {};
    user.createdAt = new Date(jsonData.createdAt);
    user.lastLogin = new Date(jsonData.lastLogin);
    return user;
  }
}

// User Manager Class
export class UserManager {
  constructor() {
    this.users = new Map();
    this.currentUser = null;
  }

  // Register new user
  registerUser(userData) {
    const user = UserFactory.createUser(userData);
    const validation = user.validate();
    
    if (!validation.isValid) {
      throw new Error(`Invalid user data: ${validation.errors.join(', ')}`);
    }
    
    this.users.set(user.id, user);
    return user;
  }

  // Login user
  loginUser(email, password) {
    // In a real app, this would verify password
    for (let user of this.users.values()) {
      if (user.email === email) {
        user.lastLogin = new Date();
        this.currentUser = user;
        return user;
      }
    }
    
    throw new Error('User not found');
  }

  // Logout user
  logoutUser() {
    this.currentUser = null;
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Get user by ID
  getUserById(id) {
    return this.users.get(id);
  }

  // Get user by email
  getUserByEmail(email) {
    for (let user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  // Update user
  updateUser(userId, updates) {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    Object.assign(user, updates);
    return user;
  }

  // Delete user
  deleteUser(userId) {
    const deleted = this.users.delete(userId);
    if (!deleted) {
      throw new Error('User not found');
    }
    
    if (this.currentUser && this.currentUser.id === userId) {
      this.currentUser = null;
    }
    
    return true;
  }

  // Get all users
  getAllUsers() {
    return Array.from(this.users.values());
  }

  // Get user statistics
  getUserStatistics() {
    const users = this.getAllUsers();
    const premiumUsers = users.filter(user => user instanceof PremiumUser);
    
    return {
      totalUsers: users.length,
      premiumUsers: premiumUsers.length,
      basicUsers: users.length - premiumUsers.length,
      averageCoursesPerUser: users.reduce((sum, user) => sum + user.enrolledCourses.length, 0) / users.length
    };
  }
}
