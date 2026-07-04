// Base API Service Class
export class ApiService {
  constructor(baseURL = 'http://localhost:3003/api') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
    this.interceptors = {
      request: [],
      response: []
    };
  }

  setAuthToken(token) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Remove authentication token
  removeAuthToken() {
    delete this.defaultHeaders['Authorization'];
  }

  // Add request interceptor
  addRequestInterceptor(interceptor) {
    this.interceptors.request.push(interceptor);
  }

  // Add response interceptor
  addResponseInterceptor(interceptor) {
    this.interceptors.response.push(interceptor);
  }

  // Apply request interceptors
  async applyRequestInterceptors(config) {
    let modifiedConfig = { ...config };
    
    for (const interceptor of this.interceptors.request) {
      modifiedConfig = await interceptor(modifiedConfig);
    }
    
    return modifiedConfig;
  }

  // Apply response interceptors
  async applyResponseInterceptors(response) {
    let modifiedResponse = response;
    
    for (const interceptor of this.interceptors.response) {
      modifiedResponse = await interceptor(modifiedResponse);
    }
    
    return modifiedResponse;
  }

  // Make HTTP request with timeout and retry logic
  async request(endpoint, options = {}) {
    const config = {
      method: 'GET',
      headers: { ...this.defaultHeaders },
      ...options,
      url: `${this.baseURL}${endpoint}`
    };

    // Apply request interceptors
    const finalConfig = await this.applyRequestInterceptors(config);

    // Add timeout
    const timeout = options.timeout || 10000;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(finalConfig.url, {
        ...finalConfig,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Apply response interceptors
      const finalResponse = await this.applyResponseInterceptors({
        data,
        status: response.status,
        headers: response.headers,
        ok: response.ok
      });

      return finalResponse;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}, options = {}) {
    const url = new URL(`${this.baseURL}${endpoint}`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    
    return this.request(url.pathname + url.search, {
      method: 'GET',
      ...options
    });
  }

  // POST request
  async post(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
  }

  // PUT request
  async put(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options
    });
  }

  // PATCH request
  async patch(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...options
    });
  }

  // DELETE request
  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'DELETE',
      ...options
    });
  }

  // Upload file
  async upload(endpoint, file, options = {}) {
    const formData = new FormData();
    formData.append('file', file);

    return this.request(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData
        ...this.defaultHeaders,
        'Content-Type': undefined
      },
      ...options
    });
  }

  // Batch requests
  async batch(requests) {
    const promises = requests.map(req => 
      this.request(req.endpoint, req.options)
    );
    
    return Promise.allSettled(promises);
  }

  // Request with retry logic
  async requestWithRetry(endpoint, options = {}, maxRetries = 3, retryDelay = 1000) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.request(endpoint, options);
      } catch (error) {
        lastError = error;
        
        if (attempt < maxRetries) {
          // Exponential backoff
          const delay = retryDelay * Math.pow(2, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  }
}

// Course API Service
export class CourseApiService extends ApiService {
  constructor(baseURL) {
    super(baseURL);
  }

  // Get all courses
  async getCourses(params = {}) {
    try {
      const response = await this.get('/courses', params);
      return {
        success: true,
        data: response.data,
        message: 'Courses retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve courses'
      };
    }
  }

  // Get course by ID
  async getCourseById(courseId) {
    try {
      const response = await this.get(`/courses/${courseId}`);
      return {
        success: true,
        data: response.data,
        message: 'Course retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve course'
      };
    }
  }

  // Get courses by category
  async getCoursesByCategory(category, params = {}) {
    try {
      const response = await this.get(`/courses/category/${category}`, params);
      return {
        success: true,
        data: response.data,
        message: 'Category courses retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve category courses'
      };
    }
  }

  // Enroll in course
  async enrollCourse(courseId, userId) {
    try {
      const response = await this.post(`/courses/${courseId}/enroll`, { userId });
      return {
        success: true,
        data: response.data,
        message: 'Course enrollment successful'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to enroll in course'
      };
    }
  }

  // Update course progress
  async updateProgress(courseId, userId, progressData) {
    try {
      const response = await this.put(`/courses/${courseId}/progress`, {
        userId,
        ...progressData
      });
      return {
        success: true,
        data: response.data,
        message: 'Progress updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to update progress'
      };
    }
  }

  // Get course progress
  async getCourseProgress(courseId, userId) {
    try {
      const response = await this.get(`/courses/${courseId}/progress`, { userId });
      return {
        success: true,
        data: response.data,
        message: 'Progress retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve progress'
      };
    }
  }
}

// User API Service
export class UserApiService extends ApiService {
  constructor(baseURL) {
    super(baseURL);
  }

  // Login user
  async login(credentials) {
    try {
      const response = await this.post('/auth/login', credentials);
      
      if (response.data.token) {
        this.setAuthToken(response.data.token);
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Login successful'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Login failed'
      };
    }
  }

  // Register user
  async register(userData) {
    try {
      const response = await this.post('/auth/register', userData);
      return {
        success: true,
        data: response.data,
        message: 'Registration successful'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Registration failed'
      };
    }
  }

  // Logout user
  async logout() {
    try {
      await this.post('/auth/logout');
      this.removeAuthToken();
      return {
        success: true,
        message: 'Logout successful'
      };
    } catch (error) {
      this.removeAuthToken();
      return {
        success: false,
        error: error.message,
        message: 'Logout failed'
      };
    }
  }

  // Get user profile
  async getProfile() {
    try {
      const response = await this.get('/auth/profile');
      return {
        success: true,
        data: response.data,
        message: 'Profile retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve profile'
      };
    }
  }

  // Update user profile
  async updateProfile(userData) {
    try {
      const response = await this.put('/auth/profile', userData);
      return {
        success: true,
        data: response.data,
        message: 'Profile updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to update profile'
      };
    }
  }

  // Get user progress summary
  async getProgressSummary(userId) {
    try {
      const response = await this.get(`/users/${userId}/progress`);
      return {
        success: true,
        data: response.data,
        message: 'Progress summary retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve progress summary'
      };
    }
  }
}

// Cache Manager for API responses
export class ApiCacheManager {
  constructor(maxSize = 100, ttl = 5 * 60 * 1000) { // 5 minutes TTL
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  // Generate cache key
  generateKey(endpoint, params = {}) {
    const paramString = JSON.stringify(params);
    return `${endpoint}:${paramString}`;
  }

  get(endpoint, params = {}) {
    const key = this.generateKey(endpoint, params);
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  set(endpoint, params = {}, data) {
    const key = this.generateKey(endpoint, params);
    
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clear() {
    this.cache.clear();
  }

  clearExpired() {
    const now = Date.now();
    
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

export class CachedApiService extends ApiService {
  constructor(baseURL, cacheManager) {
    super(baseURL);
    this.cache = cacheManager;
  }

  async get(endpoint, params = {}, options = {}) {
    const cacheKey = this.cache.generateKey(endpoint, params);
    
    if (!options.bypassCache) {
      const cachedData = this.cache.get(endpoint, params);
      if (cachedData) {
        return {
          data: cachedData,
          fromCache: true
        };
      }
    }

    try {
      const response = await super.get(endpoint, params, options);

      this.cache.set(endpoint, params, response.data);
      
      return {
        ...response,
        fromCache: false
      };
    } catch (error) {
      throw error;
    }
  }
}

export const createApiServices = (baseURL = 'http://localhost:3003/api') => {
  const cacheManager = new ApiCacheManager();
  
  return {
    courseApi: new CourseApiService(baseURL),
    userApi: new UserApiService(baseURL),
    cachedApi: new CachedApiService(baseURL, cacheManager),
    cache: cacheManager
  };
};

export default ApiService;
