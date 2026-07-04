import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

export function createAuthRoutes(authController) {
  const router = express.Router();

  router.post('/login', authController.login);
  router.post('/register', authController.register);
  router.get('/profile', authenticateToken, authController.profile);
  router.post('/logout', authenticateToken, authController.logout);
  router.post('/google', authController.googleLogin);
  router.put('/points', authenticateToken, authController.updatePoints);

  return router;
}