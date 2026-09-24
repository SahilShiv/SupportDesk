import { sendError } from '../utils/response.js';

export function errorHandler(err, req, res, next) {
  console.error('[API Error]:', err);

  if (err.code === 'P2002') {
    return sendError(res, 'A ticket with this unique identifier already exists.', 409);
  }

  if (err.code === 'P2025') {
    return sendError(res, 'Record not found.', 404);
  }

  if (err.code === 'P1001') {
    return sendError(
      res,
      'Unable to connect to database server. Please verify your DATABASE_URL in Vercel environment variables.',
      503
    );
  }

  if (err.code === 'P2021') {
    return sendError(
      res,
      'Database tables not initialized. Please run prisma db push against your production database.',
      500
    );
  }

  if (!process.env.DATABASE_URL) {
    return sendError(
      res,
      'DATABASE_URL environment variable is missing. Please configure it in your Vercel project settings.',
      500
    );
  }

  const statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
  const message = err.message || 'Internal server error occurred.';

  return sendError(res, message, statusCode);
}

export function notFoundHandler(req, res) {
  return sendError(res, `Route ${req.originalUrl} not found`, 404);
}
