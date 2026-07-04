import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

/**
 * FAQ Routes
 * GET    /api/faqs                  - Get all FAQs (public)
 * GET    /api/faqs/:id              - Get FAQ by ID (public)
 * GET    /api/faqs/categories/list  - Get categories (public)
 * POST   /api/faqs                  - Create FAQ (admin)
 * PUT    /api/faqs/:id              - Update FAQ (admin)
 * DELETE /api/faqs/:id              - Delete FAQ (admin)
 */
export function createFaqRoutes(faqController) {
  const router = express.Router();

  router.get('/categories/list', faqController.getCategories);
  router.get('/', faqController.getFaqs);
  router.get('/:id', faqController.getFaqById);

  router.post('/', authenticateToken, requireAdmin, faqController.createFaq);
  router.put('/:id', authenticateToken, requireAdmin, faqController.updateFaq);
  router.delete('/:id', authenticateToken, requireAdmin, faqController.deleteFaq);

  return router;
}
