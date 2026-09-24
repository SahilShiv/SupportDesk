export const sendSuccess = (res, data, statusCode = 200, pagination = null) => {
  const payload = {
    success: true,
    data,
  };
  if (pagination) {
    payload.pagination = pagination;
  }
  return res.status(statusCode).json(payload);
};

export const sendError = (res, message, statusCode = 500, errors = null) => {
  const payload = {
    success: false,
    message,
  };
  if (errors && process.env.NODE_ENV === 'development') {
    payload.errors = errors;
  }
  return res.status(statusCode).json(payload);
};
