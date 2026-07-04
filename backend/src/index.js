import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { UserService, AdminService } from './services/UserService.js';
import { EnrollmentService } from './services/EnrollmentService.js';
import { PaymentService } from './services/PaymentService.js';
import { AuthController } from './controllers/AuthController.js';
import { PaymentController } from './controllers/PaymentController.js';
import { CourseController } from './controllers/CourseController.js';
import { ProgressController } from './controllers/ProgressController.js';
import { AdminController } from './controllers/AdminController.js';
import { ContactController } from './controllers/ContactController.js';
import { FaqController } from './controllers/FaqController.js';
import { TestimonialController } from './controllers/TestimonialController.js';
import { ScheduleController } from './controllers/ScheduleController.js';
import { createAuthRoutes } from './routes/authRoutes.js';
import { createPaymentRoutes } from './routes/paymentRoutes.js';
import { createCourseRoutes } from './routes/courseRoutes.js';
import { createProgressRoutes } from './routes/progressRoutes.js';
import { createAdminRoutes } from './routes/adminRoutes.js';
import { createContactRoutes } from './routes/contactRoutes.js';
import { createFaqRoutes } from './routes/faqRoutes.js';
import { createTestimonialRoutes } from './routes/testimonialRoutes.js';
import { createScheduleRoutes } from './routes/scheduleRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

import { env } from './config/env.js';

const app = express();
const PORT = process.env.PORT || 3003;

app.use(helmet());
const allowedOrigins = env.CORS_ORIGIN.split(',').map(o => o.trim());
console.log('[DEBUG] Allowed CORS origins:', JSON.stringify(allowedOrigins));

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const useMySQL = env.USE_MYSQL; 

async function initializeApp() {
  let query, transaction;
  
  if (useMySQL) {
    try {
      const db = await import('./database.js');
      await db.initializeDatabase();
      await db.runMigrations(); // Run progress data migration on startup
      query = db.query;
      transaction = db.transaction;
      console.log('✅ Using MySQL database');
    } catch (error) {
      console.error('❌ MySQL connection failed:', error.message);
      console.error('❌ Please check MySQL server and configuration');
      process.exit(1);
    }
  } else {
    console.error('❌ USE_MYSQL must be true for this application');
    console.error('❌ Please set USE_MYSQL=true in .env file');
    process.exit(1);
  }

  const userService = new UserService(query);
  const adminService = new AdminService(query);
  const enrollmentService = new EnrollmentService(query, transaction);
  const paymentService = new PaymentService(query, enrollmentService, transaction);
  const authController = new AuthController(userService);
  const paymentController = new PaymentController(paymentService, userService);
  const courseController = new CourseController(query, enrollmentService);
  const progressController = new ProgressController(query);
  const adminController = new AdminController(adminService);
  const contactController = new ContactController(query);
  const faqController = new FaqController(query);
  const testimonialController = new TestimonialController(query);
  const scheduleController = new ScheduleController(query);

  // API Routes
  app.use('/api/auth', createAuthRoutes(authController));
  app.use('/api/payments', createPaymentRoutes(paymentController));
  app.use('/api/courses', createCourseRoutes(courseController));
  app.use('/api', createProgressRoutes(progressController));
  app.use('/api/admin', createAdminRoutes(adminController));
  app.use('/api/contacts', createContactRoutes(contactController));
  app.use('/api/faqs', createFaqRoutes(faqController));
  app.use('/api/testimonials', createTestimonialRoutes(testimonialController));
  app.use('/api/schedules', createScheduleRoutes(scheduleController));

  // Health endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      success: true,
      status: 'OK',
      message: 'CodeCatalyst Backend is running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

initializeApp().catch(console.error);
