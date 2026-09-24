import { sendError } from '../utils/response.js';

export const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errorMessages = result.error.errors.map((err) => err.message).join('. ');
    return sendError(res, errorMessages, 400, result.error.format());
  }
  req.validatedBody = result.data;
  next();
};

export const validateQuery = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query);
  if (!result.success) {
    const errorMessages = result.error.errors.map((err) => err.message).join('. ');
    return sendError(res, errorMessages, 400, result.error.format());
  }
  req.validatedQuery = result.data;
  next();
};
