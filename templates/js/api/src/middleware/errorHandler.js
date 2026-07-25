import { logger } from './logger.js';

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';

  logger.error(`${req.method} ${req.url} - ${statusCode} - ${err.message}`);

  res.status(statusCode).json({
    error: true,
    code: errorCode,
    message: err.message || 'An unexpected error occurred',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
