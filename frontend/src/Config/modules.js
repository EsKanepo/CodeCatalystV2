import { ModuleRegistry } from '../Utils/ModuleSystem';
import { createModule, createService } from '../Utils/ModuleSystem';

// Initialize module registry
const registry = ModuleRegistry.getInstance();

// Configuration Module
registry.registerModule('config', () => ({
  api: {
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3003/api',
    timeout: 10000,
    retryAttempts: 3
  },
  app: {
    name: 'CodeCatalyst',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  },
  cache: {
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 100
  },
  features: {
    enableAnimations: true,
    enableNotifications: true,
    enableAnalytics: process.env.NODE_ENV === 'production'
  }
}));

// Logger Module
registry.registerModule('logger', () => {
  const config = registry.getConfig('config');
  
  return {
    log: (message, ...args) => {
      if (config.app.environment !== 'production') {
        console.log(`[${new Date().toISOString()}] ${message}`, ...args);
      }
    },
    error: (message, ...args) => {
      console.error(`[${new Date().toISOString()}] ERROR: ${message}`, ...args);
    },
    warn: (message, ...args) => {
      console.warn(`[${new Date().toISOString()}] WARN: ${message}`, ...args);
    },
    info: (message, ...args) => {
      console.info(`[${new Date().toISOString()}] INFO: ${message}`, ...args);
    }
  };
}, ['config']);
      try {
        const response = await api.courseApi.getCourseById(courseId);
        if (response.success) {
          return response.data;
        }
        
        // Fallback to local data
        const course = courseManager.getCourseById(courseId);
        return course ? course.toJSON() : null;
      } catch (error) {
        logger.error(`Failed to get course ${courseId}:`, error);
        // Fallback to local data
        const course = courseManager.getCourseById(courseId);
        return course ? course.toJSON() : null;
      }
    },
    
    enrollCourse: async (courseId) => {
      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      try {
        const response = await api.courseApi.enrollCourse(courseId, user.id);
        if (response.success) {
          registry.emit('course:enrolled', { courseId, userId: user.id });
          logger.info(`User ${user.id} enrolled in course ${courseId}`);
        }
        return response;
      } catch (error) {
        logger.error(`Failed to enroll in course ${courseId}:`, error);
        throw error;
      }
    },
    
    getCoursesForUser: (user) => {
      return courseManager.getCoursesForUser(user);
    },
    
    getFreeCourses: () => {
      return courseManager.getFreeCourses().map(course => course.toJSON());
    },
    
    getPaidCourses: () => {
      return courseManager.getPaidCourses().map(course => course.toJSON());
    }
  };
}, ['logger', 'api', 'courseManager', 'authService']);

// Progress Service Module
registry.registerModule('progressService', () => {
  const logger = registry.getService('logger');
  const api = registry.getService('api');
  const progressManager = registry.getService('progressManager');
  const authService = registry.getService('authService');
  
  return {
    updateProgress: async (courseId, progressData) => {
      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      try {
        const response = await api.courseApi.updateProgress(courseId, user.id, progressData);
        if (response.success) {
          registry.emit('progress:updated', { courseId, userId: user.id, progress: response.data });
          logger.info(`Progress updated for course ${courseId}`);
        }
        return response;
      } catch (error) {
        logger.error(`Failed to update progress for course ${courseId}:`, error);
        throw error;
      }
    },
    
    getCourseProgress: async (courseId) => {
      const user = authService.getCurrentUser();
      if (!user) {
        return null;
      }
      
      try {
        const response = await api.courseApi.getCourseProgress(courseId, user.id);
        if (response.success) {
          return response.data;
        }
        
        // Fallback to local data
        return progressManager.getProgress(courseId, user.id);
      } catch (error) {
        logger.error(`Failed to get progress for course ${courseId}:`, error);
        // Fallback to local data
        return progressManager.getProgress(courseId, user.id);
      }
    },
    
    getUserProgressSummary: (userId) => {
      return progressManager.getUserProgressSummary(userId);
    },
    
    getCourseProgressStats: (courseId) => {
      return progressManager.getCourseProgressStats(courseId);
    }
  };
}, ['logger', 'api', 'progressManager', 'authService']);

// Notification Service Module
registry.registerModule('notificationService', () => {
  const logger = registry.getService('logger');
  const config = registry.getConfig('config');
  
  if (!config.features.enableNotifications) {
    return {
      show: () => {},
      success: () => {},
      error: () => {},
      warning: () => {},
      info: () => {}
    };
  }
  
  return {
    show: (message, type = 'info', duration = 5000) => {
      // This would integrate with a notification library like react-toastify
      console.log(`[${type.toUpperCase()}] ${message}`);
    },
    
    success: (message, duration) => {
      return this.show(message, 'success', duration);
    },
    
    error: (message, duration) => {
      return this.show(message, 'error', duration);
    },
    
    warning: (message, duration) => {
      return this.show(message, 'warning', duration);
    },
    
    info: (message, duration) => {
      return this.show(message, 'info', duration);
    }
  };
}, ['logger']);

// Theme Service Module
registry.registerModule('themeService', () => {
  const logger = registry.getService('logger');
  
  return {
    getCurrentTheme: () => {
      return localStorage.getItem('theme') || 'light';
    },
    
    setTheme: (theme) => {
      localStorage.setItem('theme', theme);
      document.body.setAttribute('data-theme', theme);
      registry.emit('theme:changed', theme);
      logger.info(`Theme changed to ${theme}`);
    },
    
    toggleTheme: () => {
      const currentTheme = this.getCurrentTheme();
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      this.setTheme(newTheme);
      return newTheme;
    }
  };
}, ['logger']);

// Analytics Service Module
registry.registerModule('analyticsService', () => {
  const logger = registry.getService('logger');
  const config = registry.getConfig('config');
  
  if (!config.features.enableAnalytics) {
    return {
      track: () => {},
      pageView: () => {},
      event: () => {}
    };
  }
  
  return {
    track: (eventName, properties = {}) => {
      // This would integrate with Google Analytics or similar
      logger.info(`Analytics Event: ${eventName}`, properties);
    },
    
    pageView: (page) => {
      logger.info(`Page View: ${page}`);
    },
    
    event: (category, action, label, value) => {
      logger.info(`Analytics Event: ${category} - ${action} - ${label} - ${value}`);
    }
  };
}, ['logger']);

// Export registry for use in components
export default registry;
