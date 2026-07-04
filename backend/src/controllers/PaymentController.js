import { z } from 'zod';
import { PaymentService } from '../services/PaymentService.js';

const topupSchema = z.object({
  amount: z.number().int().min(100).max(10000)
});

const purchaseSchema = z.object({
  courseId: z.number().int().positive()
});

export class PaymentController {
  constructor(paymentService, userService) {
    this.paymentService = paymentService;
    this.userService = userService;
  }

  topup = async (req, res) => {
    try {
      const { amount } = topupSchema.parse(req.body);
      const result = await this.paymentService.topup(req.user.id, amount);

      res.json({
        success: true,
        message: 'Topup berhasil',
        data: result
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: error.errors.map(e => e.message).join(', ')
        });
      }
      res.status(400).json({
        success: false,
        message: error.message || 'Topup gagal'
      });
    }
  };

  purchaseCourse = async (req, res) => {
    try {
      const { courseId } = purchaseSchema.parse(req.body);
      const result = await this.paymentService.purchaseCourse(req.user.id, courseId);

      const user = await this.userService.getUserById(req.user.id);

      res.json({
        success: true,
        message: 'Pembelian kursus berhasil',
        data: {
          enrollment: result,
          userPoint: result.userPoint ?? user.userPoint,
          enrolled_courses: user.enrolled_courses
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: error.errors.map(e => e.message).join(', ')
        });
      }

      const statusMap = {
        'Course not found': 404,
        'Already enrolled in this course': 400,
        'Insufficient CodePoints': 402
      };

      res.status(statusMap[error.message] || 400).json({
        success: false,
        error: error.message,
        message: error.message === 'Insufficient CodePoints'
          ? 'CodePoints tidak cukup. Silakan topup terlebih dahulu.'
          : error.message
      });
    }
  };

  upgradePremium = async (req, res) => {
    try {
      const result = await this.paymentService.upgradeToPremium(req.user.id);
      const user = await this.userService.getUserById(req.user.id);

      res.json({
        success: true,
        message: 'Upgrade ke Premium berhasil! Semua kursus terkunci kini dapat diakses.',
        data: {
          ...result,
          user
        }
      });
    } catch (error) {
      const status = error.message.includes('Insufficient') ? 402 : 400;
      res.status(status).json({
        success: false,
        message: error.message
      });
    }
  };

  getPremiumInfo = async (req, res) => {
    const user = await this.userService.getUserById(req.user.id);
    const currentPoints = user.userPoint ?? 0;

    res.json({
      success: true,
      data: {
        cost: PaymentService.getPremiumCost(),
        currentRole: user.role,
        userPoint: currentPoints,
        canUpgrade: user.role === 'student' && currentPoints >= PaymentService.getPremiumCost()
      }
    });
  };
}
