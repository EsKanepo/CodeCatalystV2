import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

export class AuthController {
  constructor(userService) {
    this.userService = userService;
  }

  login = async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);

      const user = await this.userService.loginUser(
        validatedData.email,
        validatedData.password
      );

      const token = this.userService.generateToken(user);
      const sanitizedUser = this.userService.sanitizeUser(user);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: sanitizedUser
        }
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: error.errors.map(e => e.message).join(', ')
        });
      }

      if (error.message === 'User not found' || error.message === 'Invalid password') {
        return res.status(401).json({
          success: false,
          message: 'Email or password is incorrect'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Login failed'
      });
    }
  };

  register = async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);

      const exists = await this.userService.checkUserExists(validatedData.email);
      if (exists) {
        return res.status(400).json({
          success: false,
          message: 'User already exists'
        });
      }

      const newUser = await this.userService.createUser({ ...validatedData, role: 'student', allowRoleOverride: false });
      const token = this.userService.generateToken(newUser);

      res.status(201).json({
        success: true,
        data: {
          user: newUser,
          token
        }
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: error.errors.map(e => e.message).join(', ')
        });
      }

      console.error('[REGISTER] Error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Register failed'
      });
    }
  };

  profile = async (req, res) => {
    try {
      const user = await this.userService.getUserById(req.user.id);

      res.json({
        success: true,
        data: user
      });

    } catch {
      res.status(500).json({
        success: false
      });
    }
  };

  logout = (req, res) => {
    res.json({
      success: true
    });
  };

  updatePoints = async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Direct point manipulation is disabled. Gunakan /api/payments/topup atau /api/payments/purchase-course.'
        });
      }

      const { points, userId } = req.body;
      const targetUserId = userId || req.user.id;

      if (typeof points !== 'number' || points < 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid points value'
        });
      }

      const updatedUser = await this.userService.updateUserPoints(targetUserId, points);

      res.json({
        success: true,
        message: 'Points updated successfully',
        data: {
          userPoint: updatedUser.userPoint
        }
      });
    } catch (error) {
      console.error('[POINTS UPDATE] Error updating points:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update points'
      });
    }
  };

   // ✅ 🔥 INI HARUS DI DALAM CLASS
   googleLogin = async (req, res) => {
     try {
       const { name, email } = req.body;

       let user = await this.userService.findByEmail(email);

       if (!user) {
         await this.userService.createUser({
           name,
           email,
           password: null,
           role: 'student'
         });

         user = await this.userService.findByEmail(email);
       }
       
       // Generate token using the same method as regular login
       const token = this.userService.generateToken(user);
       const sanitizedUser = this.userService.sanitizeUser(user);

       res.json({
         success: true,
         message: 'Google login successful',
         data: {
           user: sanitizedUser,
           token
         }
       });

     } catch (error) {
       console.error("Google login error:", error);
       res.status(500).json({
         success: false,
         message: "Google login failed"
       });
     }
   };
}