const ErrorResponse = require('../../utils/errorResponse');
const asyncHandler = require('../../middleware/async');
const ProfileMapping = require('../../models/profile/ProfileMapping');
const Enquiry = require('../../models/enquiry/Enquiry');
const UserActivityLog = require('../../models/profile/UserActivityLog');

// @desc    Get all profile mappings
// @route   GET /api/v1/profile-mappings
// @access  Private
exports.getProfileMappings = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single profile mapping
// @route   GET /api/v1/profile-mappings/:id
// @access  Private
exports.getProfileMapping = asyncHandler(async (req, res, next) => {
  const profileMapping = await ProfileMapping.findById(req.params.id)
    .populate({
      path: 'enquiry_id',
      select: 'name mobile email enquiry_id'
    })
    .populate({
      path: 'created_by',
      select: 'name email'
    });

  if (!profileMapping) {
    return next(
      new ErrorResponse(`Profile mapping not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: profileMapping
  });
});

// @desc    Create new profile mapping
// @route   POST /api/v1/profile-mappings
// @access  Private
exports.createProfileMapping = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.created_by = req.user.id;

  // Check if enquiry exists
  const enquiry = await Enquiry.findById(req.body.enquiry_id);
  if (!enquiry) {
    return next(
      new ErrorResponse(`Enquiry not found with id of ${req.body.enquiry_id}`, 404)
    );
  }

  // Set the correct profile_type_ref based on profile_type
  const profileTypeRefMap = {
    'project': 'ProjectProfile',
    'product': 'ProductProfile',
    'amc': 'AmcProfile',
    'complaint': 'ComplaintProfile',
    'info': 'InfoProfile',
    'job': 'JobProfile',
    'site_visit': 'SiteVisitSchedule'
  };

  req.body.profile_type_ref = profileTypeRefMap[req.body.profile_type];

  if (!req.body.profile_type_ref) {
    return next(
      new ErrorResponse(`Invalid profile type: ${req.body.profile_type}`, 400)
    );
  }

  const profileMapping = await ProfileMapping.create(req.body);

  // Log the activity
  await UserActivityLog.create({
    user_id: req.user.id,
    action_type: 'create',
    entity_type: 'profile_mapping',
    entity_id: profileMapping._id,
    description: `Created profile mapping from enquiry ${enquiry.enquiry_id} to ${req.body.profile_type} profile`,
    ip_address: req.ip,
    user_agent: req.headers['user-agent']
  });

  res.status(201).json({
    success: true,
    data: profileMapping
  });
});

// @desc    Update profile mapping
// @route   PUT /api/v1/profile-mappings/:id
// @access  Private
exports.updateProfileMapping = asyncHandler(async (req, res, next) => {
  let profileMapping = await ProfileMapping.findById(req.params.id);

  if (!profileMapping) {
    return next(
      new ErrorResponse(`Profile mapping not found with id of ${req.params.id}`, 404)
    );
  }

  // If profile_type is being updated, update profile_type_ref as well
  if (req.body.profile_type) {
    const profileTypeRefMap = {
      'project': 'ProjectProfile',
      'product': 'ProductProfile',
      'amc': 'AmcProfile',
      'complaint': 'ComplaintProfile',
      'info': 'InfoProfile',
      'job': 'JobProfile',
      'site_visit': 'SiteVisitSchedule'
    };

    req.body.profile_type_ref = profileTypeRefMap[req.body.profile_type];

    if (!req.body.profile_type_ref) {
      return next(
        new ErrorResponse(`Invalid profile type: ${req.body.profile_type}`, 400)
      );
    }
  }

  // Store previous state for activity log
  const previousState = { ...profileMapping.toObject() };

  profileMapping = await ProfileMapping.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  // Log the activity
  await UserActivityLog.create({
    user_id: req.user.id,
    action_type: 'update',
    entity_type: 'profile_mapping',
    entity_id: profileMapping._id,
    description: `Updated profile mapping ${profileMapping.mapping_id}`,
    previous_state: previousState,
    new_state: profileMapping.toObject(),
    ip_address: req.ip,
    user_agent: req.headers['user-agent']
  });

  res.status(200).json({
    success: true,
    data: profileMapping
  });
});

// @desc    Delete profile mapping
// @route   DELETE /api/v1/profile-mappings/:id
// @access  Private
exports.deleteProfileMapping = asyncHandler(async (req, res, next) => {
  const profileMapping = await ProfileMapping.findById(req.params.id);

  if (!profileMapping) {
    return next(
      new ErrorResponse(`Profile mapping not found with id of ${req.params.id}`, 404)
    );
  }

  // Store the mapping data for activity log
  const deletedMapping = { ...profileMapping.toObject() };

  await profileMapping.remove();

  // Log the activity
  await UserActivityLog.create({
    user_id: req.user.id,
    action_type: 'delete',
    entity_type: 'profile_mapping',
    entity_id: profileMapping._id,
    description: `Deleted profile mapping ${profileMapping.mapping_id}`,
    previous_state: deletedMapping,
    ip_address: req.ip,
    user_agent: req.headers['user-agent']
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get profile mappings by enquiry
// @route   GET /api/v1/enquiries/:enquiryId/profile-mappings
// @access  Private
exports.getProfileMappingsByEnquiry = asyncHandler(async (req, res, next) => {
  const profileMappings = await ProfileMapping.find({ enquiry_id: req.params.enquiryId })
    .populate({
      path: 'profile_id',
      select: 'name description status'
    })
    .populate({
      path: 'created_by',
      select: 'name email'
    });

  res.status(200).json({
    success: true,
    count: profileMappings.length,
    data: profileMappings
  });
});

// @desc    Get profile mappings by profile
// @route   GET /api/v1/profile-mappings/profile/:profileType/:profileId
// @access  Private
exports.getProfileMappingsByProfile = asyncHandler(async (req, res, next) => {
  const { profileType, profileId } = req.params;

  // Validate profile type
  const validProfileTypes = ['project', 'product', 'amc', 'complaint', 'info', 'job', 'site_visit'];
  if (!validProfileTypes.includes(profileType)) {
    return next(
      new ErrorResponse(`Invalid profile type: ${profileType}`, 400)
    );
  }

  const profileMappings = await ProfileMapping.find({
    profile_type: profileType,
    profile_id: profileId
  })
    .populate({
      path: 'enquiry_id',
      select: 'name mobile email enquiry_id'
    })
    .populate({
      path: 'created_by',
      select: 'name email'
    });

  res.status(200).json({
    success: true,
    count: profileMappings.length,
    data: profileMappings
  });
});
