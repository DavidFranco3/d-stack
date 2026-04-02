import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { connectDB } from './src/config/db.js';
import { logger, loggerMiddleware } from './src/middleware/logger.js';
import { User } from './src/models/User.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(loggerMiddleware);

// Default User Seeder
async function seedAdmin() {
  try {
    const adminExists = await User.findOne({ email: 'admin@dstack.com' });
    if (!adminExists) {
      const admin = new User({
        name: 'David Admin',
        email: 'admin@dstack.com',
        password: '12345678',
      });
      await admin.save();
      logger.info('👤 Default admin user created (admin@dstack.com / 12345678)');
    }
  } catch (err) {
    logger.error('Error seeding admin user: ' + err);
  }
}
seedAdmin();

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'D-Stack API is running' });
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    logger.error('Login error: ' + err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Production: Serve Frontend
if (process.env.NODE_ENV === 'production') {
  const staticPath = path.join(__dirname, '../web/dist');
  app.use(express.static(staticPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
});
