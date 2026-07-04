export class CourseController {
  constructor(database, enrollmentService) {
    this.db = database;
    this.enrollmentService = enrollmentService;
  }

  async executeQuery(sql, params = []) {
    try {
      return await this.db(sql, params);
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  getCourses = async (req, res, next) => {
    try {
      const { category, page = 1, limit = 10, search } = req.query;
      
      const coursesData = await this.executeQuery('SELECT * FROM courses');
      let courses = Array.isArray(coursesData) ? coursesData : [];
      
      if (category && category !== 'Semua') {
        courses = courses.filter(course => course.category === category);
      }
      
      if (search) {
        courses = courses.filter(course => 
          course.title.toLowerCase().includes(search.toLowerCase()) ||
          course.description.toLowerCase().includes(search.toLowerCase()) ||
          course.instructor.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      courses.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      const total = courses.length;
      const offset = (page - 1) * limit;
      const paginatedCourses = courses.slice(offset, offset + limit);
      
      res.json({
        success: true,
        data: paginatedCourses,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  }

  getCourseById = async (req, res, next) => {
    try {
      const courseId = parseInt(req.params.id);
      const userId = req.user.id;

      if (isNaN(courseId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid course ID'
        });
      }

      const courses = await this.executeQuery(
        'SELECT * FROM courses WHERE id = ?',
        [courseId]
      );

      if (courses.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Course not found'
        });
      }

      const course = courses[0];

      //  AMBIL USER
      const users = await this.executeQuery(
        'SELECT role, enrolled_courses FROM users WHERE id = ?',
        [userId]
      );

      const user = users[0];

      //  PROTEKSI PREMIUM
      if (course.is_locked && user.role !== 'premium' && user.role !== 'admin') {
        const enrolled = typeof user.enrolled_courses === 'string'
          ? JSON.parse(user.enrolled_courses || '[]')
          : (user.enrolled_courses || []);

        if (!enrolled.includes(courseId)) {
          return res.status(403).json({
            success: false,
            error: 'Course locked',
            message: 'Course ini khusus premium'
          });
        }
      }

      res.json({
        success: true,
        data: course
      });

    } catch (error) {
      next(error);
    }
  };

  getCoursesByCategory = async (req, res, next) => {
    try {
      const category = req.params.category;
      const courses = await this.executeQuery('SELECT * FROM courses WHERE category = ? ORDER BY created_at DESC', [category]);

      res.json({
        success: true,
        data: courses
      });
    } catch (error) {
      next(error);
    }
  }

  enrollCourse = async (req, res, next) => {
    try {
      const courseId = parseInt(req.params.id);
      const userId = req.user.id;

      const result = await this.enrollmentService.enrollUser(userId, courseId);

      res.json({
        success: true,
        message: 'Course enrollment successful',
        data: result
      });
    } catch (error) {
      if (error.message === 'Course not found') {
        return res.status(404).json({ 
          success: false, 
          error: 'Course not found',
          message: 'Course with specified ID not found'
        });
      }
      if (error.message === 'Already enrolled in this course') {
        return res.status(400).json({ 
          success: false, 
          error: 'Already enrolled',
          message: 'You are already enrolled in this course'
        });
      }
      next(error);
    }
  }
}
