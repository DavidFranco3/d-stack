import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class AuthService {
  static async generateToken(user) {
    return jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
  }

  static async validateCredentials(email, password) {
    const user = await User.findOne({ email });
    if (!user) return null;

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return null;

    return user;
  }
}
