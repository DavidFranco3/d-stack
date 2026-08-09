import { logger } from './logger.js';

export const errorHandler = (err, req, res, next) => {
  if (err?.name === 'ZodError' || Array.isArray(err?.issues)) {
    const formattedErrors = {};
    (err.issues || []).forEach((issue) => {
      const field = issue.path?.join('.') || 'general';
      formattedErrors[field] = issue.message;
    });

    return res.status(400).json({
      error: true,
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      errors: formattedErrors,
    });
  }

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
