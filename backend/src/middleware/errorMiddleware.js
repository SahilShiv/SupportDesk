import { sendError } from '../utils/response.js';

export function errorHandler(err, req, res, next) {
  // Check for Prisma unique constraint violation (P2002)
  if (err.code === 'P2002') {
    return sendError(res, 'A ticket with this unique identifier already exists.', 409);
  }

  // Check for Prisma record not found (P2025)
  if (err.code === 'P2025') {
    return sendError(res, 'Record not found.', 404);
  }

  // Custom status code if assigned
  const statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
  const message = err.message || 'Internal server error occurred.';

  // In production, mask 500 internal errors
  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    return sendError(res, 'Internal server error', 500);
  }

  return sendError(res, message, statusCode);
}

export function notFoundHandler(req, res) {
  return sendError(res, `Route ${req.originalUrl} not found`, 404);
}
