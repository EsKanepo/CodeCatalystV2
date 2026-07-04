// Base Course Class
export class Course {
  constructor(id, title, description, category, instructor) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.category = category;
    this.instructor = instructor;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Get course duration in weeks
  getDurationInWeeks() {
    return this.duration || 'Unknown';
  }

  // Get course difficulty level
  getLevel() {
    return this.level || 'Beginner';
  }

  // Check if course is free
  isFree() {
    return this.price === 0 || this.isFreeCourse === true;
  }

  // Check if course is locked
  isLocked() {
    return this.isLockedCourse === true;
  }

  // Get formatted price
  getFormattedPrice() {
    if (this.isFree()) {
      return 'GRATIS';
    }
    return `Rp ${this.price.toLocaleString('id-ID')}`;
  }

  // Get discount percentage
  getDiscountPercentage() {
    if (!this.originalPrice || this.originalPrice <= this.price) {
      return 0;
    }
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }

  // Get course statistics
  getStats() {
    return {
      modules: this.modules || 0,
      lessons: this.lessons || 0,
      projects: this.projects || 0,
      students: this.students || 0,
      rating: this.rating || 0
    };
  }

  // Validate course data
  validate() {
    const errors = [];
    
    if (!this.title || this.title.trim().length === 0) {
      errors.push('Title is required');
    }
    
    if (!this.description || this.description.trim().length === 0) {
      errors.push('Description is required');
    }
    
    if (!this.category) {
      errors.push('Category is required');
    }
    
    if (!this.instructor) {
      errors.push('Instructor is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.id,
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
      originalPrice: this.originalPrice,
      rating: this.rating,
      students: this.students,
      topics: this.topics,
      prerequisites: this.prerequisites,
      isLocked: this.isLocked(),
      isFree: this.isFree(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

// Free Course Class (inherits from Course)
export class FreeCourse extends Course {
  constructor(id, title, description, category, instructor) {
    super(id, title, description, category, instructor);
    this.price = 0;
    this.isFreeCourse = true;
    this.isLockedCourse = false;
  }

  // Override getFormattedPrice
  getFormattedPrice() {
    return 'GRATIS';
  }

  // Override isLocked
  isLocked() {
    return false;
  }

  // Override isFree
  isFree() {
    return true;
  }
}

// Paid Course Class (inherits from Course)
export class PaidCourse extends Course {
  constructor(id, title, description, category, instructor, price, originalPrice) {
    super(id, title, description, category, instructor);
    this.price = price || 0;
    this.originalPrice = originalPrice || price;
    this.isFreeCourse = false;
    this.isLockedCourse = true;
  }

  // Override isLocked
  isLocked() {
    return this.price > 0;
  }

  // Override isFree
  isFree() {
    return false;
  }

  // Get payment methods
  getPaymentMethods() {
    return [
      'Transfer Bank',
      'E-Wallet (GoPay, OVO, Dana)',
      'Credit Card',
      'Virtual Account'
    ];
  }

  // Check if user can access
  canAccess(user) {
    if (!user) return false;
    
    // Check if user has purchased this course
    return user.enrolledCourses && user.enrolledCourses.includes(this.id);
  }
}

// Premium Course Class (inherits from PaidCourse)
export class PremiumCourse extends PaidCourse {
  constructor(id, title, description, category, instructor, price, originalPrice) {
    super(id, title, description, category, instructor, price, originalPrice);
    this.features = [
      'Downloadable resources',
      '1-on-1 mentorship',
      'Certificate of completion',
      'Lifetime access',
      'Career support',
      'Priority support'
    ];
    this.certificateType = 'Premium';
  }

  // Override getPaymentMethods
  getPaymentMethods() {
    return [
      'Transfer Bank',
      'E-Wallet (GoPay, OVO, Dana)',
      'Credit Card',
      'Virtual Account',
      'PayPal',
      'Cryptocurrency'
    ];
  }

  // Get premium benefits
  getPremiumBenefits() {
    return [
      'Exclusive content',
      'Live Q&A sessions',
      'Personalized feedback',
      'Networking opportunities',
      'Job placement assistance'
    ];
  }
}

// Course Factory Class
export class CourseFactory {
  static createCourse(courseData) {
    const { id, title, description, category, instructor, price, isPremium } = courseData;
    
    if (isPremium) {
      return new PremiumCourse(id, title, description, category, instructor, price, courseData.originalPrice);
    }
    
    if (price === 0 || courseData.isFree) {
      return new FreeCourse(id, title, description, category, instructor);
    }
    
    return new PaidCourse(id, title, description, category, instructor, price, courseData.originalPrice);
  }

  static createMultipleCourses(coursesData) {
    return coursesData.map(courseData => this.createCourse(courseData));
  }
}

// Course Manager Class
export class CourseManager {
  constructor() {
    this.courses = [];
    this.categories = new Set();
  }

  // Add course
  addCourse(course) {
    if (!(course instanceof Course)) {
      throw new Error('Invalid course object');
    }
    
    const validation = course.validate();
    if (!validation.isValid) {
      throw new Error(`Invalid course data: ${validation.errors.join(', ')}`);
    }
    
    this.courses.push(course);
    this.categories.add(course.category);
    return course;
  }

  // Get course by ID
  getCourseById(id) {
    return this.courses.find(course => course.id === id);
  }

  // Get courses by category
  getCoursesByCategory(category) {
    return this.courses.filter(course => course.category === category);
  }

  // Get free courses
  getFreeCourses() {
    return this.courses.filter(course => course.isFree());
  }

  // Get paid courses
  getPaidCourses() {
    return this.courses.filter(course => !course.isFree());
  }

  // Get premium courses
  getPremiumCourses() {
    return this.courses.filter(course => course instanceof PremiumCourse);
  }

  // Get all categories
  getCategories() {
    return Array.from(this.categories);
  }

  // Search courses
  searchCourses(query) {
    const lowercaseQuery = query.toLowerCase();
    return this.courses.filter(course => 
      course.title.toLowerCase().includes(lowercaseQuery) ||
      course.description.toLowerCase().includes(lowercaseQuery) ||
      course.instructor.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Get course statistics
  getStatistics() {
    const stats = {
      total: this.courses.length,
      free: this.getFreeCourses().length,
      paid: this.getPaidCourses().length,
      premium: this.getPremiumCourses().length,
      categories: this.getCategories().length,
      totalStudents: this.courses.reduce((sum, course) => sum + (course.students || 0), 0),
      averageRating: this.courses.reduce((sum, course) => sum + (course.rating || 0), 0) / this.courses.length
    };

    return stats;
  }

  // Get courses for user based on access
  getCoursesForUser(user) {
    if (!user) {
      return this.getFreeCourses();
    }

    return this.courses.filter(course => {
      if (course.isFree()) return true;
      return course.canAccess(user);
    });
  }
}
