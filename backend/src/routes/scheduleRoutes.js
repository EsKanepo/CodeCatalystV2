import express from 'express';

export function createScheduleRoutes(scheduleController) {
  const router = express.Router();

  // Public route to view schedules
  router.get('/', scheduleController.getSchedules);

  return router;
}
