import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

export function createProgressRoutes(progressController) {
  const router = express.Router();

  router.get('/courses/:id/progress', authenticateToken, progressController.getProgress);
  router.put('/courses/:id/progress', authenticateToken, progressController.updateProgress);
  router.get('/users/:id/progress', authenticateToken, progressController.getUserProgressSummary);

  return router;
}
