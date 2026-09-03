import { AuthService } from '../services/authService.js';
import { logger } from '../middleware/logger.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 24 * 60 * 60 * 1000,
};

export class AuthController {
  static async register(req, res, next) {
    const { name, email, password } = req.body;
    try {
      const user = await AuthService.register({ name, email, password });
      const token = await AuthService.generateToken(user);
      res.cookie('token', token, COOKIE_OPTIONS);

      res.status(201).json({
        user: { id: user._id, name: user.name, email: user.email }
      });
    } catch (err) {
      logger.error('Register error: ' + err);
      next(err);
    }
  }

  static async login(req, res, next) {
    const { email, password } = req.body;
    try {
      const user = await AuthService.validateCredentials(email, password);
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = await AuthService.generateToken(user);
      res.cookie('token', token, COOKIE_OPTIONS);

      res.json({
        user: { id: user._id, name: user.name, email: user.email }
      });
    } catch (err) {
      logger.error('Login error: ' + err);
      next(err);
    }
  }

  static async me(req, res, next) {
    try {
      const bearer = req.header('Authorization') || '';
      const token = req.cookies?.token || bearer.replace(/^Bearer\s+/, '') || null;
      const user = await AuthService.getUserFromRequest(token);

      res.json({
        user: user ? { id: user._id, name: user.name, email: user.email } : null
      });
    } catch (err) {
      next(err);
    }
  }

  static async logout(req, res) {
    res.clearCookie('token', { httpOnly: true, sameSite: 'lax' });
    res.json({ message: 'Logged out successfully' });
  }
}