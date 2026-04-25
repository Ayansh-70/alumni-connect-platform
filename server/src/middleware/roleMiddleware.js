const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized, user context is missing.');
  }

  if (!allowedRoles.includes(req.user.role)) {
    res.status(403);
    throw new Error('Forbidden: insufficient permissions.');
  }

  next();
};

export { authorize };
