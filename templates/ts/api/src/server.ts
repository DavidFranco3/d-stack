import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { ApiResponse } from '../../shared/types.js';
import { connectDB } from './config/db.js';
import { seedDatabase } from './config/seed.js';
import { logger, loggerMiddleware } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to Database & Seed 4 Initial Collections
connectDB().then(() => {
  seedDatabase();
});

// Security Middleware
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api/', limiter);

// Standard Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(loggerMiddleware);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);

// Health Check & Root API Endpoints
app.get(['/api', '/api/health'], (req: Request, res: Response) => {
  const response: ApiResponse = { status: 'ok', message: 'D-Stack API is running' };
  res.json(response);
});

// Production: Serve Frontend
if (process.env.NODE_ENV === 'production') {
  const staticPath = path.join(__dirname, '../../web/dist');
  app.use(express.static(staticPath));
  
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });
}

// Global Error Handler (Must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`🚀 TS Server running on http://localhost:${PORT}`);
});
