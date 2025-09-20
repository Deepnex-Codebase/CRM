const asyncHandler = require('../../middleware/async');
const ErrorResponse = require('../../utils/errorResponse');
const Role = require('../../models/auth/Role');
const User = require('../../models/profile/User');

// @desc    Get all roles
// @route   GET /api/v1/profile/roles
// @access  Private
exports.getRoles = asyncHandler(async (req, res, next) => {
  const roles = await Role.find().sort({ created_at: -1 });

  // Get user count for each role
  const rolesWithUserCount = await Promise.all(
    roles.map(async (role) => {
      const userCount = await User.countDocuments({ role_id: role._id });
      return {
        ...role.toObject(),
        user_count: userCount
      };
    })
  );

  res.status(200).json({
    success: true,
    count: rolesWithUserCount.length,
    data: rolesWithUserCount
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
  const { role_name, description, permissions } = req.body;

  // Validate required fields
  if (!role_name || !description) {
    return next(new ErrorResponse('Please provide role name and description', 400));
  }

  // Check if role already exists (case-insensitive)
  const existingRole = await Role.findOne({ 
    role_name: { $regex: new RegExp(`^${role_name}$`, 'i') } 
  });

  if (existingRole) {
    return next(new ErrorResponse(`Role with name '${role_name}' already exists`, 400));
  }

  // Validate permissions array if provided
  if (permissions && !Array.isArray(permissions)) {
    return next(new ErrorResponse('Permissions must be an array', 400));
  }

  // Available permissions list for validation
  const availablePermissions = [
    'user_view', 'user_create', 'user_update', 'user_delete',
    'enquiry_view', 'enquiry_create', 'enquiry_update', 'enquiry_delete',
    'call_view', 'call_create', 'call_update', 'call_delete',
    'role_view', 'role_create', 'role_update', 'role_delete',
    'report_view', 'report_generate',
    'settings_view', 'settings_update'
  ];

  // Validate each permission if provided
  if (permissions && permissions.length > 0) {
    const invalidPermissions = permissions.filter(perm => !availablePermissions.includes(perm));
    if (invalidPermissions.length > 0) {
      return next(new ErrorResponse(`Invalid permissions: ${invalidPermissions.join(', ')}. Available permissions: ${availablePermissions.join(', ')}`, 400));
    }
  }

  const roleData = {
    role_name: role_name.trim(),
    description: description.trim(),
    permissions: permissions || []
  };

  const role = await Role.create(roleData);

  res.status(201).json({
    success: true,
    message: `Role '${role.role_name}' created successfully`,
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
