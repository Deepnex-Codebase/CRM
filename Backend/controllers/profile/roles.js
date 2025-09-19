const asyncHandler = require('../../middleware/async');
const ErrorResponse = require('../../utils/errorResponse');
const Role = require('../../models/auth/Role');

// @desc    Get all roles
// @route   GET /api/v1/profile/roles
// @access  Private
exports.getRoles = asyncHandler(async (req, res, next) => {
  const roles = await Role.find().sort({ created_at: -1 });

  res.status(200).json({
    success: true,
    count: roles.length,
    data: roles
  });
});

// @desc    Get single role
// @route   GET /api/v1/profile/roles/:id
// @access  Private
exports.getRole = asyncHandler(async (req, res, next) => {
  const role = await Role.findById(req.params.id);

  if (!role) {
    return next(new ErrorResponse(`Role not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: role
  });
});

// @desc    Create role
// @route   POST /api/v1/profile/roles
// @access  Private
exports.createRole = asyncHandler(async (req, res, next) => {
  const role = await Role.create(req.body);

  res.status(201).json({
    success: true,
    data: role
  });
});

// @desc    Update role
// @route   PUT /api/v1/profile/roles/:id
// @access  Private
exports.updateRole = asyncHandler(async (req, res, next) => {
  const role = await Role.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!role) {
    return next(new ErrorResponse(`Role not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: role
  });
});

// @desc    Delete role
// @route   DELETE /api/v1/profile/roles/:id
// @access  Private
exports.deleteRole = asyncHandler(async (req, res, next) => {
  const role = await Role.findById(req.params.id);

  if (!role) {
    return next(new ErrorResponse(`Role not found with id of ${req.params.id}`, 404));
  }

  await role.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
