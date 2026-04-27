const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    res.status(res.statusCode && res.statusCode !== 200 ? res.statusCode : 400);
  }

  if (err.code === 11000) {
    res.status(res.statusCode && res.statusCode !== 200 ? res.statusCode : 409);
  }

  const statusCode =
    err.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
};

export { errorHandler, notFoundHandler };
