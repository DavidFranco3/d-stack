import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService.js';
import { logger } from '../middleware/logger.js';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    try {
      const user = await AuthService.validateCredentials(email, password);
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = await AuthService.generateToken(user);
      
      res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email }
      });
    } catch (err) {
      logger.error('Login error: ' + err);
      next(err);
    }
  }
}
