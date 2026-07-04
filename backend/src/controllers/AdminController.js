export class AdminController {
  constructor(adminService) {
    this.adminService = adminService;
  }

  getUsers = async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Forbidden',
          message: 'Only admins can access this endpoint'
        });
      }
      
      const users = await this.adminService.getAllUsers();
      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      console.error('Get admin users error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get users',
        message: 'Internal server error'
      });
    }
  }

  updateUserRole = async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Forbidden',
          message: 'Only admins can update user roles'
        });
      }
      
      const userId = parseInt(req.params.id);
      const { role } = req.body;
      
      if (!['student', 'premium', 'admin'].includes(role)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid role',
          message: 'Role must be student, premium, or admin'
        });
      }

      const updatedUser = await this.adminService.updateUserRole(userId, role);
      res.json({
        success: true,
        message: 'User role updated successfully',
        data: updatedUser
      });
    } catch (error) {
      console.error('Update user role error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update user role',
        message: 'Internal server error'
      });
    }
  }

  deleteUser = async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Forbidden',
          message: 'Only admins can delete users'
        });
      }
      
      const userId = parseInt(req.params.id);
      
      if (userId === req.user.id) {
        return res.status(400).json({
          success: false,
          error: 'Invalid operation',
          message: 'You cannot delete your own account'
        });
      }

      await this.adminService.deleteUser(userId);
      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({
          success: false,
          error: 'Not found',
          message: 'User not found'
        });
      }
      console.error('Delete user error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete user',
        message: 'Internal server error'
      });
    }
  }

  getSystemStats = async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Forbidden',
          message: 'Only admins can view system stats'
        });
      }
      
      const stats = await this.adminService.getSystemStats();
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Get system stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get system stats',
        message: 'Internal server error'
      });
    }
  }

  getCourseSales = async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      const sales = await this.adminService.getCourseSales();
      res.json({ success: true, data: sales });
    } catch (error) {
      console.error('Get course sales error:', error);
      res.status(500).json({ success: false, message: 'Failed to get course sales' });
    }
  }

  getUsersProgress = async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      const users = await this.adminService.getAllUsersWithProgress();
      res.json({ success: true, data: users });
    } catch (error) {
      console.error('Get users progress error:', error);
      res.status(500).json({ success: false, message: 'Failed to get users progress' });
    }
  }

  getUserProgress = async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      
      const userId = parseInt(req.params.id);
      const user = await this.adminService.getUserProgressDetail(userId);
      res.json({ success: true, data: user });
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.status(500).json({ success: false, message: 'Failed to get user progress' });
    }
  }
}
