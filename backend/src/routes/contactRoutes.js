import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

export function createContactRoutes(contactController) {
  const router = express.Router();

  router.post('/', contactController.submitContact);
  router.get('/', authenticateToken, contactController.getContacts);

  return router;
}
