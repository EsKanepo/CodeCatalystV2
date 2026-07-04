import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

export function createPaymentRoutes(paymentController) {
  const router = express.Router();

  router.post('/topup', authenticateToken, paymentController.topup);
  router.post('/purchase-course', authenticateToken, paymentController.purchaseCourse);
  router.post('/upgrade-premium', authenticateToken, paymentController.upgradePremium);
  router.get('/premium-info', authenticateToken, paymentController.getPremiumInfo);

  return router;
}
