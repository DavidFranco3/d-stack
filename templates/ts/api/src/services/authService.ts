import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class AuthService {
  static async generateToken(user: IUser): Promise<string> {
    return jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
  }

  static async validateCredentials(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) return null;

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return null;

    return user;
  }

  static async register(data: { name: string; email: string; password: string }) {
    const existing = await User.findOne({ email: data.email });
    if (existing) {
      const err: any = new Error('Email is already registered');
      err.statusCode = 409;
      throw err;
    }
    const user = new User(data);
    return await user.save();
  }

  static async getUserFromRequest(token: string | null) {
    if (!token) return null;
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
      return await User.findById(decoded.id);
    } catch {
      return null;
    }
  }
}