const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/profile/User');
const Role = require('../models/auth/Role');
const Session = require('../models/auth/Session');
const LoginAttempt = require('../models/auth/LoginAttempt');
const EmployeeRoleAssignment = require('../models/auth/EmployeeRoleAssignment');
const sendEmail = require('../utils/sendEmail');

// Helper function to get client IP
function getClientIp(req) {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.ip;
}

// Helper function to validate password policy
function validatePasswordPolicy(password, policy = {}) {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true
  } = policy;

  if (password.length < minLength) return false;
  if (requireUppercase && !/[A-Z]/.test(password)) return false;
  if (requireLowercase && !/[a-z]/.test(password)) return false;
  if (requireNumbers && !/\d/.test(password)) return false;
  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;

  return true;
}

// @desc    Register user (Admin only)
// @route   POST /api/v1/auth/register
// @access  Private/Admin
exports.register = asyncHandler(async (req, res, next) => {
  const { first_name, last_name, email, phone, role_name, password } = req.body;

  // Validate required fields
  if (!first_name || !last_name || !email || !role_name) {
    return next(new ErrorResponse('Please provide first name, last name, email, and role', 400));
  }

  // Check if user already exists
  const existingUser = await User.findOne({ 
    $or: [{ email }, { phone: phone || null }] 
  });

  if (existingUser) {
    return next(new ErrorResponse('User with this email or phone already exists', 400));
  }

  // Find the role (case-insensitive)
  const role = await Role.findOne({ 
    role_name: { $regex: new RegExp(`^${role_name}$`, 'i') } 
  });
  if (!role) {
    console.log(`Role lookup failed for: "${role_name}"`);
    const availableRoles = await Role.find({}, 'role_name');
    console.log('Available roles:', availableRoles.map(r => r.role_name));
    return next(new ErrorResponse(`Invalid role specified: "${role_name}". Available roles: ${availableRoles.map(r => r.role_name).join(', ')}`, 400));
  }

  // Validate password if provided
  if (password && !validatePasswordPolicy(password)) {
    return next(new ErrorResponse('Password does not meet policy requirements', 400));
  }

  // Create user
  const userData = {
    first_name,
    last_name,
    email,
    phone,
    role_id: role._id,
    is_active: false, // User needs email verification
    created_by: req.user._id
  };

  if (password) {
    userData.password = password;
  }

  const user = await User.create(userData);

  // Create role assignment
  await EmployeeRoleAssignment.create({
    user_id: user._id,
    role_id: role._id,
    assigned_by: req.user._id,
    effective_from: new Date(),
    is_active: true
  });

  // Generate email verification token
  const verifyToken = user.getEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  // Create verification URL
  const verifyUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/verify-email/${verifyToken}`;

  // Send verification email
  const message = `
    <h2>Welcome to Our Platform!</h2>
    <p>Hello ${user.name},</p>
    <p>Your account has been created successfully. Please click the link below to verify your email and activate your account:</p>
    <a href="${verifyUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
    <p>If the button doesn't work, copy and paste this link into your browser:</p>
    <p>${verifyUrl}</p>
    <p>This link will expire in 24 hours.</p>
    ${password ? '' : '<p><strong>Note:</strong> You will need to set your password after email verification.</p>'}
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Email Verification - Account Created',
      message
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Verification email sent.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          is_active: user.is_active
        }
      }
    });
  } catch (err) {
    user.email_verification_token = undefined;
    user.email_verification_expire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc    Verify email
// @route   GET /api/v1/auth/verify-email/:token
// @access  Public
exports.verifyEmail = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const emailVerificationToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    email_verification_token: emailVerificationToken,
    email_verification_expire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('Invalid or expired verification token', 400));
  }

  // Activate user
  user.is_active = true;
  user.email_verified = true;
  user.email_verification_token = undefined;
  user.email_verification_expire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Email verified successfully. Your account is now active.'
  });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, phone, password } = req.body;

  // Validate email/phone & password
  if ((!email && !phone) || !password) {
    return next(new ErrorResponse('Please provide an email/phone and password', 400));
  }

  // Check for user by email or phone
  let user;
  if (email) {
    user = await User.findOne({ email }).select('+password');
  } else if (phone) {
    user = await User.findOne({ phone }).select('+password');
  }

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if user is active
  if (!user.is_active) {
    return next(new ErrorResponse('Your account is not verified. Please check your email for verification link.', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    // Log failed login attempt
    await LoginAttempt.create({
      user_id: user._id,
      email: email || user.email,
      ip_address: getClientIp(req),
      device_info: req.headers['user-agent'],
      status: 'failed',
      reason: 'Invalid password'
    });
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Update last login
  user.last_login = Date.now();
  await user.save({ validateBeforeSave: false });

  // Log successful login attempt
  await LoginAttempt.create({
    user_id: user._id,
    email: email || user.email,
    ip_address: getClientIp(req),
    device_info: req.headers['user-agent'],
    status: 'success'
  });

  sendTokenResponse(user, 200, res, req);
});

// @desc    Login with OTP
// @route   POST /api/v1/auth/login/otp
// @access  Public
exports.loginWithOTP = asyncHandler(async (req, res, next) => {
  const { phone, email } = req.body;

  // Validate input - either phone or email must be provided
  if (!phone && !email) {
    return next(new ErrorResponse('Please provide either a phone number or email', 400));
  }

  // Check for user based on provided credentials
  let user;
  let contactMethod;
  let contactValue;

  if (phone) {
    user = await User.findOne({ phone });
    contactMethod = 'phone';
    contactValue = phone;
  } else {
    user = await User.findOne({ email });
    contactMethod = 'email';
    contactValue = email;
  }

  if (!user) {
    return next(new ErrorResponse(`No user found with this ${contactMethod}`, 404));
  }

  // Check if user is active
  if (!user.is_active) {
    return next(new ErrorResponse('Your account is not verified. Please check your email for verification link.', 401));
  }

  // Generate OTP
  const otp = user.generateOTP();
  await user.save({ validateBeforeSave: false });

  // Prepare OTP message
  const otpMessage = `Your OTP for login is: ${otp}. Valid for 10 minutes.`;

  // Send OTP via email (SMS implementation can be added later)
  if (contactMethod === 'email') {
    try {
      await sendEmail({
        email: user.email,
        subject: 'Login OTP Verification',
        message: `<h3>Login Verification</h3><p>Your OTP for login is: <strong>${otp}</strong></p><p>Valid for 10 minutes.</p>`
      });
    } catch (err) {
      return next(new ErrorResponse('OTP could not be sent', 500));
    }
  }

  res.status(200).json({
    success: true,
    message: `OTP sent to your ${contactMethod}`
  });
});

// @desc    Verify OTP and login
// @route   POST /api/v1/auth/verify-otp
// @access  Public
exports.verifyOTP = asyncHandler(async (req, res, next) => {
  const { phone, email, otp } = req.body;

  // Validate input - either phone or email must be provided along with OTP
  if ((!phone && !email) || !otp) {
    return next(new ErrorResponse('Please provide either phone number or email along with OTP', 400));
  }

  // Check for user based on provided credentials
  let user;
  let contactMethod;

  if (phone) {
    user = await User.findOne({ phone });
    contactMethod = 'phone';
  } else {
    user = await User.findOne({ email });
    contactMethod = 'email';
  }

  if (!user) {
    return next(new ErrorResponse(`No user found with this ${contactMethod}`, 404));
  }

  // Check if OTP exists and is valid
  if (!user.otp_token || !user.otp_expiry) {
    return next(new ErrorResponse('No OTP was generated for this user', 400));
  }

  // Check if OTP is expired
  if (user.otp_expiry < Date.now()) {
    return next(new ErrorResponse('OTP has expired', 400));
  }

  // Verify OTP
  const hashedOTP = crypto
    .createHash('sha256')
    .update(otp)
    .digest('hex');

  if (user.otp_token !== hashedOTP) {
    return next(new ErrorResponse('Invalid OTP', 401));
  }

  // Clear OTP fields
  user.otp_token = undefined;
  user.otp_expiry = undefined;
  user.last_login = Date.now();
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res, req);
});

// @desc    Log user out / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  // Get token from req.user which is set by the protect middleware
  if (req.user) {
    // Invalidate all sessions for this user
    await Session.updateMany(
      { user_id: req.user.id, is_active: true },
      { is_active: false }
    );
  }

  // Clear the cookie
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    sameSite: 'lax'
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  // Get user with role assignment
  const assignment = await EmployeeRoleAssignment.getActiveAssignment(req.user._id);
  
  const userData = {
    id: req.user._id,
    name: `${req.user.first_name} ${req.user.last_name}`,
    email: req.user.email,
    phone: req.user.phone,
    role: req.user.role_id || 'user', // Default role if role_id is not populated
    is_active: req.user.is_active,
    last_login: req.user.last_login,
    created_at: req.user.created_at
  };

  if (assignment) {
    userData.role_assignment = {
      assignment_id: assignment.assignment_id,
      role_name: assignment.role_id.role_name,
      assigned_at: assignment.assigned_at,
      effective_from: assignment.effective_from,
      effective_until: assignment.effective_until
    };
  }

  res.status(200).json({
    success: true,
    data: userData
  });
});

// @desc    Update user details
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    phone: req.body.phone
  };

  // Remove undefined fields
  Object.keys(fieldsToUpdate).forEach(key => 
    fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
  );

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  // Validate new password
  if (!validatePasswordPolicy(req.body.newPassword)) {
    return next(new ErrorResponse('New password does not meet policy requirements', 400));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res, req);
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `
    <h2>Password Reset Request</h2>
    <p>You are receiving this email because you (or someone else) has requested the reset of a password.</p>
    <p>Please click the link below to reset your password:</p>
    <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
    <p>If the button doesn't work, copy and paste this link into your browser:</p>
    <p>${resetUrl}</p>
    <p>This link will expire in 10 minutes.</p>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Token',
      message
    });

    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    console.log(err);
    user.reset_password_token = undefined;
    user.reset_password_expire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc    Reset password
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    reset_password_token: resetPasswordToken,
    reset_password_expire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('Invalid or expired reset token', 400));
  }

  // Validate new password
  if (!validatePasswordPolicy(req.body.password)) {
    return next(new ErrorResponse('Password does not meet policy requirements', 400));
  }

  // Set new password
  user.password = req.body.password;
  user.reset_password_token = undefined;
  user.reset_password_expire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res, req);
});

// @desc    Get all users (Admin only)
// @route   GET /api/v1/auth/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;

  // Build query
  let query = {};
  
  // Filter by role if specified
  if (req.query.role_name) {
    const role = await Role.findOne({ role_name: req.query.role_name });
    if (role) {
      query.role_id = role._id;
    }
  }

  // Filter by active status if specified
  if (req.query.is_active !== undefined) {
    query.is_active = req.query.is_active === 'true';
  }

  // Search by name or email
  if (req.query.search) {
    query.$or = [
      { first_name: { $regex: req.query.search, $options: 'i' } },
      { last_name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .sort({ created_at: -1 })
    .limit(limit)
    .skip(startIndex)
    .select('-password');

  // Pagination result
  const pagination = {};

  if (startIndex + limit < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    pagination,
    data: users
  });
});

// @desc    Get single user (Admin only)
// @route   GET /api/v1/auth/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  // Get role assignment details
  const assignment = await EmployeeRoleAssignment.getActiveAssignment(user._id);

  const userData = {
    ...user.toObject(),
    role_assignment: assignment ? {
      assignment_id: assignment.assignment_id,
      role_name: assignment.role_id.role_name,
      assigned_at: assignment.assigned_at,
      effective_from: assignment.effective_from,
      effective_until: assignment.effective_until
    } : null
  };

  res.status(200).json({
    success: true,
    data: userData
  });
});

// @desc    Update user (Admin only)
// @route   PUT /api/v1/auth/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  const { role_name, ...otherFields } = req.body;

  // Update user fields
  user = await User.findByIdAndUpdate(req.params.id, otherFields, {
    new: true,
    runValidators: true
  }).select('-password');

  // Handle role change if specified
  if (role_name) {
    const role = await Role.findOne({ role_name });
    if (!role) {
      return next(new ErrorResponse('Invalid role specified', 400));
    }

    // Check if role is actually changing
    if (user.role_id.toString() !== role._id.toString()) {
      // Deactivate current role assignment
      await EmployeeRoleAssignment.updateMany(
        { user_id: user._id, is_active: true },
        { is_active: false, effective_until: new Date() }
      );

      // Create new role assignment
      await EmployeeRoleAssignment.create({
        user_id: user._id,
        role_id: role._id,
        assigned_by: req.user._id,
        effective_from: new Date(),
        is_active: true
      });

      // Update user role_id
      user.role_id = role._id;
      await user.save();
    }
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Deactivate user (Admin only)
// @route   PUT /api/v1/auth/users/:id/deactivate
// @access  Private/Admin
exports.deactivateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  // Prevent admin from deactivating themselves
  if (user._id.toString() === req.user._id.toString()) {
    return next(new ErrorResponse('You cannot deactivate your own account', 400));
  }

  user.is_active = false;
  await user.save();

  // Deactivate all active sessions
  await Session.updateMany(
    { user_id: user._id, is_active: true },
    { is_active: false }
  );

  res.status(200).json({
    success: true,
    message: 'User deactivated successfully'
  });
});

// @desc    Activate user (Admin only)
// @route   PUT /api/v1/auth/users/:id/activate
// @access  Private/Admin
exports.activateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  user.is_active = true;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'User activated successfully'
  });
});

// @desc    Delete user (Admin only)
// @route   DELETE /api/v1/auth/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  // Prevent admin from deleting themselves
  if (user._id.toString() === req.user._id.toString()) {
    return next(new ErrorResponse('You cannot delete your own account', 400));
  }

  await user.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get user login history (Admin only)
// @route   GET /api/v1/auth/users/:id/login-history
// @access  Private/Admin
exports.getUserLoginHistory = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;

  const total = await LoginAttempt.countDocuments({ user_id: user._id });
  const loginHistory = await LoginAttempt.find({ user_id: user._id })
    .sort({ attempted_at: -1 })
    .limit(limit)
    .skip(startIndex);

  // Pagination result
  const pagination = {};

  if (startIndex + limit < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: loginHistory.length,
    total,
    pagination,
    data: loginHistory
  });
});

// @desc    Get active sessions (Admin only)
// @route   GET /api/v1/auth/sessions
// @access  Private/Admin
exports.getActiveSessions = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;

  const total = await Session.countDocuments({ is_active: true });
  const sessions = await Session.find({ is_active: true })
    .populate('user_id', 'name email role')
    .sort({ issued_at: -1 })
    .limit(limit)
    .skip(startIndex);

  // Pagination result
  const pagination = {};

  if (startIndex + limit < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: sessions.length,
    total,
    pagination,
    data: sessions
  });
});

// @desc    Revoke session (Admin only)
// @route   PUT /api/v1/auth/sessions/:id/revoke
// @access  Private/Admin
exports.revokeSession = asyncHandler(async (req, res, next) => {
  const session = await Session.findById(req.params.id);

  if (!session) {
    return next(new ErrorResponse(`Session not found with id of ${req.params.id}`, 404));
  }

  session.is_active = false;
  await session.save();

  res.status(200).json({
    success: true,
    message: 'Session revoked successfully'
  });
});

// Get token from model, create cookie and send response
const sendTokenResponse = async (user, statusCode, res, req = null) => {
  // Create token
  const token = user.getSignedJwtToken();

  // Create session record
  const sessionData = {
    token,
    user_id: user._id,
    device_info: req ? req.headers['user-agent'] : null,
    ip_address: req ? getClientIp(req) : null,
    issued_at: new Date(),
    expires_at: new Date(Date.now() + process.env.JWT_EXPIRE_TIME * 24 * 60 * 60 * 1000),
    is_active: true
  };

  await Session.create(sessionData);

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: 'lax'
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      role: user.role_id || 'user', // Default role if role_id is not populated
      is_active: user.is_active
    }
  });
};