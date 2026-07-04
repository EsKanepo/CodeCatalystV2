import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

export function createCourseRoutes(courseController) {
  const router = express.Router();

  router.get('/', courseController.getCourses);
  router.get('/category/:category', courseController.getCoursesByCategory);
  router.get('/:id', authenticateToken, courseController.getCourseById);
  router.post('/:id/enroll', authenticateToken, courseController.enrollCourse);

  return router;
}
