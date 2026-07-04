import { z } from 'zod';

const progressSchema = z.object({
  completedLessons: z.number().min(0),
  completedLessonsArray: z.array(z.number()).optional(), // 🔥 pakai array
  moduleId: z.number().optional()
});

export class ProgressController {
  constructor(database) {
    this.db = database;
  }

  async executeQuery(sql, params = []) {
    try {
      return await this.db(sql, params);
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  getProgress = async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const userId = req.user.id;

      const progressData = await this.executeQuery(
        'SELECT * FROM progress WHERE user_id = ? AND course_id = ?',
        [userId, courseId]
      );

      // Get course info for total weeks
      const courses = await this.executeQuery(
        'SELECT modules FROM courses WHERE id = ?',
        [courseId]
      );

      const totalWeeks = courses.length > 0 ? courses[0].modules : 8;

      if (progressData.length === 0) {
        return res.json({
          success: true,
          data: {
            course_id: courseId,
            user_id: userId,
            completed_lessons: 0,
            total_lessons: totalWeeks,
            percentage: 0,
            weeks_completed: 0,
            total_weeks: totalWeeks,
            started_at: null,
            last_accessed: null,
            completed_lessons_data: []
          }
        });
      }

      const progress = progressData[0];

      res.json({
        success: true,
        data: {
          ...progress,
          weeks_completed: progress.completed_lessons,
          total_weeks: totalWeeks
        }
      });
    } catch (error) {
      console.error('Get progress error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get progress'
      });
    }
  };

  updateProgress = async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const userId = req.user.id;

      console.log("REQ BODY:", req.body);

      const validatedData = progressSchema.parse(req.body);

      // Get course info - use modules (weeks) as total for progress tracking
      const courses = await this.executeQuery(
        'SELECT modules FROM courses WHERE id = ?',
        [courseId]
      );

      if (courses.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Course not found'
        });
      }

      // For progress tracking: total_lessons = modules (weeks)
      const totalWeeks = courses[0].modules || 8;

      // 🔥 HANDLE ARRAY LANGSUNG
      let completedLessonsData = [];

      if (validatedData.completedLessonsArray) {
        completedLessonsData = validatedData.completedLessonsArray.map(id => ({
          lessonId: id,
          moduleId: validatedData.moduleId,
          completedAt: new Date()
        }));
      }

      // completedLessons from frontend = number of weeks completed (1-8)
      const completedWeeks = validatedData.completedLessons;

      // Calculate percentage based on weeks (max 100%)
      let percentage = totalWeeks > 0
        ? Math.round((completedWeeks / totalWeeks) * 100)
        : 0;
      if (percentage > 100) percentage = 100;

      // cek existing
      const existing = await this.executeQuery(
        'SELECT * FROM progress WHERE user_id = ? AND course_id = ?',
        [userId, courseId]
      );

      if (existing.length === 0) {
        // 🔥 INSERT
        await this.executeQuery(
          `INSERT INTO progress
          (user_id, course_id, completed_lessons, total_lessons, completed_lessons_data, percentage, last_accessed, started_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            userId,
            courseId,
            completedWeeks,
            totalWeeks,
            JSON.stringify(completedLessonsData),
            percentage,
            new Date(),
            new Date()
          ]
        );
      } else {
        // 🔥 UPDATE
        await this.executeQuery(
          `UPDATE progress
           SET completed_lessons = ?, total_lessons = ?, completed_lessons_data = ?, percentage = ?, last_accessed = ?
           WHERE user_id = ? AND course_id = ?`,
          [
            completedWeeks,
            totalWeeks,
            JSON.stringify(completedLessonsData),
            percentage,
            new Date(),
            userId,
            courseId
          ]
        );
      }

      const updatedProgress = await this.executeQuery(
        'SELECT * FROM progress WHERE user_id = ? AND course_id = ?',
        [userId, courseId]
      );

      res.json({
        success: true,
        message: 'Progress updated successfully',
        data: {
          ...updatedProgress[0],
          weeks_completed: completedWeeks,
          total_weeks: totalWeeks
        }
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          message: error.errors.map(e => e.message).join(', ')
        });
      }

      console.error('🔥 Update progress error:', error);

      res.status(500).json({
        success: false,
        error: 'Failed to update progress'
      });
    }
  };

  getUserProgressSummary = async (req, res) => {
    try {
      const userId = parseInt(req.params.id);

      if (req.user.role !== 'admin' && req.user.id !== userId) {
        return res.status(403).json({
          success: false,
          error: 'Forbidden',
          message: 'You can only view your own progress'
        });
      }

      const userProgress = await this.executeQuery(
        'SELECT * FROM progress WHERE user_id = ?',
        [userId]
      );

      // Get course info for accurate week calculation
      const courseInfoMap = {};
      const courseIds = [...new Set(userProgress.map(p => p.course_id))];
      for (const courseId of courseIds) {
        const courses = await this.executeQuery(
          'SELECT modules, lessons FROM courses WHERE id = ?',
          [courseId]
        );
        if (courses.length > 0) {
          courseInfoMap[courseId] = courses[0];
        }
      }

      const totalCourses = userProgress.length;
      let completed = 0;
      let weeksCompleted = 0;
      let totalWeeks = 0;

      for (const progress of userProgress) {
        if (progress.percentage === 100) {
          completed++;
        }
        const info = courseInfoMap[progress.course_id] || { modules: 1, lessons: 1 };
        totalWeeks += info.modules || 1;
        weeksCompleted += Math.round((progress.completed_lessons / (info.lessons || 1)) * (info.modules || 1));
      }

      res.json({
        success: true,
        data: {
          totalCourses,
          completed,
          weeksCompleted,
          totalWeeks
        }
      });
    } catch (error) {
      console.error('Get user progress error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get user progress'
      });
    }
  };
}