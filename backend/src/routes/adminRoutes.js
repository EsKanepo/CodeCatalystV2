import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

export function createAdminRoutes(adminController) {
  const router = express.Router();

  router.get('/users', authenticateToken, adminController.getUsers);
  router.put('/users/:id/role', authenticateToken, adminController.updateUserRole);
  router.delete('/users/:id', authenticateToken, adminController.deleteUser);
  router.get('/stats', authenticateToken, adminController.getSystemStats);
  router.get('/sales', authenticateToken, adminController.getCourseSales);
  router.get('/users-progress', authenticateToken, adminController.getUsersProgress);
  router.get('/users/:id/progress', authenticateToken, adminController.getUserProgress);

  return router;
}
