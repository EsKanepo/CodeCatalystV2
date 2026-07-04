import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

/**
 * Testimonial Routes
 * GET    /api/testimonials           - Get all testimonials (public)
 * GET    /api/testimonials/:id       - Get by ID (public)
 * POST   /api/testimonials           - Create (admin)
 * PUT    /api/testimonials/:id       - Update (admin)
 * DELETE /api/testimonials/:id       - Delete (admin)
 */
export function createTestimonialRoutes(testimonialController) {
  const router = express.Router();

  router.get('/', testimonialController.getTestimonials);
  router.get('/:id', testimonialController.getTestimonialById);

  router.post('/', authenticateToken, requireAdmin, testimonialController.createTestimonial);
  router.put('/:id', authenticateToken, requireAdmin, testimonialController.updateTestimonial);
  router.delete('/:id', authenticateToken, requireAdmin, testimonialController.deleteTestimonial);

  return router;
}
