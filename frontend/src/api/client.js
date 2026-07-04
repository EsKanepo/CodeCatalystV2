import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || process.env.REACT_APP_API_BASE_URL || "http://localhost:3003";

export const api = axios.create({
  baseURL: `${baseURL}/api`,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("cc_token") || localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {
    // ignore
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem("cc_token");
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

// Function to clear auth header
export const clearApiAuth = () => {
  delete api.defaults.headers.common['Authorization'];
};

// Helper functions for Testimonials
export const testimonialAPI = {
  getAll: (page = 1, limit = 100, filters = {}) => 
    api.get('/testimonials', { params: { page, limit, ...filters } }),
  
  getById: (id) => 
    api.get(`/testimonials/${id}`),
  
  create: (data) => 
    api.post('/testimonials', data),
  
  update: (id, data) =>
    api.put(`/testimonials/${id}`, data),
  
  delete: (id) => 
    api.delete(`/testimonials/${id}`)
};

// Helper functions for FAQs
export const faqAPI = {
  getAll: (page = 1, limit = 100, filters = {}) => 
    api.get('/faqs', { params: { page, limit, ...filters } }),
  
  getById: (id) => 
    api.get(`/faqs/${id}`),
  
  getCategories: () => 
    api.get('/faqs/categories/list'),
  
  create: (data) => 
    api.post('/faqs', data),
  
  update: (id, data) =>
    api.put(`/faqs/${id}`, data),
  
  delete: (id) => 
    api.delete(`/faqs/${id}`)
};

// Payment API
export const paymentAPI = {
  topup: (amount) => api.post('/payments/topup', { amount }),
  purchaseCourse: (courseId) => api.post('/payments/purchase-course', { courseId }),
  upgradePremium: () => api.post('/payments/upgrade-premium'),
  getPremiumInfo: () => api.get('/payments/premium-info')
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  getCourseSales: () => api.get('/admin/sales'),
  getUsersProgress: () => api.get('/admin/users-progress'),
  getUserProgress: (userId) => api.get(`/admin/users/${userId}/progress`),
  updateUserRole: (userId, role) => api.put(`/admin/users/${userId}/role`, { role }),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`)
};


