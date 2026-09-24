import { sendError } from '../utils/response.js';

export function errorHandler(err, req, res, next) {
  if (err.code === 'P2002') {
    return sendError(res, 'A ticket with this unique identifier already exists.', 409);
  }

  if (err.code === 'P2025') {
    return sendError(res, 'Record not found.', 404);
  }

  const statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
  const message = err.message || 'Internal server error occurred.';

  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    return sendError(res, 'Internal server error', 500);
  }

  return sendError(res, message, statusCode);
}

export function notFoundHandler(req, res) {
  return sendError(res, `Route ${req.originalUrl} not found`, 404);
}
