const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/profile/User');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Set token from cookie
  if (req.cookies?.token) {
    token = req.cookies.token;
  }
  // Or from Authorization header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ErrorResponse('Authentication failed - invalid or expired token', 401));
    }

    // Check if user is active
    if (!user.is_active) {
      return next(new ErrorResponse('Your account is not verified. Please check your email for verification link.', 401));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    // Get user with role
    const user = await User.findById(req.user.id).populate('role_id');

    if (!user || !user.role_id) {
      return next(new ErrorResponse('User role not found', 403));
    }

    // Make role check case-insensitive
    const userRole = (user.role_id.role_name || '').toLowerCase();
    const allowedRoles = roles.map(r => r.toLowerCase());
    if (!allowedRoles.includes(userRole)) {
      return next(
        new ErrorResponse(
          `User role ${user.role_id.role_name} is not authorized to access this route`,
          403
        )
      );
    }

    next();
  });
};

// Check specific permissions
exports.checkPermission = (permission) => {
  return asyncHandler(async (req, res, next) => {
    // Get user with role and permissions
    const user = await User.findById(req.user.id).populate('role_id');

    if (!user || !user.role_id || !user.role_id.permissions) {
      return next(new ErrorResponse('User permissions not found', 403));
    }

    if (!user.role_id.permissions.includes(permission)) {
      return next(
        new ErrorResponse(
          `User does not have permission: ${permission}`,
          403
        )
      );
    }

    next();
  });
};