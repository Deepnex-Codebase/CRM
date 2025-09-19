const ErrorResponse = require('../../utils/errorResponse');
const asyncHandler = require('../../middleware/async');
const Team = require('../../models/profile/Team');
const User = require('../../models/profile/User');
const TeamUserMap = require('../../models/profile/TeamUserMap');
const UserActivityLog = require('../../models/profile/UserActivityLog');

// @desc    Get all teams
// @route   GET /api/v1/teams
// @access  Private
exports.getTeams = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single team
// @route   GET /api/v1/teams/:id
// @access  Private
exports.getTeam = asyncHandler(async (req, res, next) => {
  const team = await Team.findById(req.params.id).populate({
    path: 'created_by',
    select: 'name email'
  });

  if (!team) {
    return next(
      new ErrorResponse(`Team not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: team
  });
});

// @desc    Create new team
// @route   POST /api/v1/teams
// @access  Private/Admin
exports.createTeam = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.created_by = req.user.id;

  const team = await Team.create(req.body);

  // Log the activity
  await UserActivityLog.create({
    user_id: req.user.id,
    action_type: 'create',
    entity_type: 'team',
    entity_id: team._id,
    description: `Created team ${team.name} (${team.team_id})`,
    ip_address: req.ip,
    user_agent: req.headers['user-agent']
  });

  res.status(201).json({
    success: true,
    data: team
  });
});

// @desc    Update team
// @route   PUT /api/v1/teams/:id
// @access  Private/Admin
exports.updateTeam = asyncHandler(async (req, res, next) => {
  let team = await Team.findById(req.params.id);

  if (!team) {
    return next(
      new ErrorResponse(`Team not found with id of ${req.params.id}`, 404)
    );
  }

  // Store previous state for activity log
  const previousState = { ...team.toObject() };

  team = await Team.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  // Log the activity
  await UserActivityLog.create({
    user_id: req.user.id,
    action_type: 'update',
    entity_type: 'team',
    entity_id: team._id,
    description: `Updated team ${team.name} (${team.team_id})`,
    previous_state: previousState,
    new_state: team.toObject(),
    ip_address: req.ip,
    user_agent: req.headers['user-agent']
  });

  res.status(200).json({
    success: true,
    data: team
  });
});

// @desc    Delete team
// @route   DELETE /api/v1/teams/:id
// @access  Private/Admin
exports.deleteTeam = asyncHandler(async (req, res, next) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    return next(
      new ErrorResponse(`Team not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if team has members
  const teamMembers = await TeamUserMap.find({ team_id: team._id });
  if (teamMembers.length > 0) {
    return next(
      new ErrorResponse(`Cannot delete team with active members. Remove all members first.`, 400)
    );
  }

  // Store the team data for activity log
  const deletedTeam = { ...team.toObject() };

  await team.remove();

  // Log the activity
  await UserActivityLog.create({
    user_id: req.user.id,
    action_type: 'delete',
    entity_type: 'team',
    entity_id: team._id,
    description: `Deleted team ${team.name} (${team.team_id})`,
    previous_state: deletedTeam,
    ip_address: req.ip,
    user_agent: req.headers['user-agent']
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get team members
// @route   GET /api/v1/teams/:id/members
// @access  Private
exports.getTeamMembers = asyncHandler(async (req, res, next) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    return next(
      new ErrorResponse(`Team not found with id of ${req.params.id}`, 404)
    );
  }

  const teamUserMaps = await TeamUserMap.find({ team_id: team._id })
    .populate({
      path: 'user_id',
      select: 'name email role phone'
    })
    .populate({
      path: 'created_by',
      select: 'name email'
    });

  const members = teamUserMaps.map(map => ({
    id: map._id,
    user: map.user_id,
    role: map.role,
    is_team_lead: map.is_team_lead,
    joined_at: map.created_at
  }));

  res.status(200).json({
    success: true,
    count: members.length,
    data: members
  });
});

// @desc    Add team member
// @route   POST /api/v1/teams/:id/members
// @access  Private/Admin
exports.addTeamMember = asyncHandler(async (req, res, next) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    return next(
      new ErrorResponse(`Team not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if user exists
  const user = await User.findById(req.body.user_id);
  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.body.user_id}`, 404)
    );
  }

  // Check if user is already in the team
  const existingMember = await TeamUserMap.findOne({
    team_id: team._id,
    user_id: user._id
  });

  if (existingMember) {
    return next(
      new ErrorResponse(`User is already a member of this team`, 400)
    );
  }

  // If adding as team lead, check if there's already a team lead
  if (req.body.is_team_lead) {
    const existingTeamLead = await TeamUserMap.findOne({
      team_id: team._id,
      is_team_lead: true
    });

    if (existingTeamLead && !req.body.force_team_lead) {
      return next(
        new ErrorResponse(
          `Team already has a team lead. Set force_team_lead=true to replace.`,
          400
        )
      );
    }

    // If forcing team lead change, update the existing team lead
    if (existingTeamLead && req.body.force_team_lead) {
      await TeamUserMap.findByIdAndUpdate(
        existingTeamLead._id,
        { is_team_lead: false },
        { new: true }
      );

      // Log the team lead change
      await UserActivityLog.create({
        user_id: req.user.id,
        action_type: 'update',
        entity_type: 'team_user_map',
        entity_id: existingTeamLead._id,
        description: `Removed team lead status from user in team ${team.name}`,
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    }
  }

  // Create the team member mapping
  const teamUserMap = await TeamUserMap.create({
    team_id: team._id,
    user_id: user._id,
    role: req.body.role || 'member',
    is_team_lead: req.body.is_team_lead || false,
    created_by: req.user.id
  });

  // Log the activity
  await UserActivityLog.create({
    user_id: req.user.id,
    action_type: 'create',
    entity_type: 'team_user_map',
    entity_id: teamUserMap._id,
    description: `Added user ${user.name} to team ${team.name}${req.body.is_team_lead ? ' as team lead' : ''}`,
    ip_address: req.ip,
    user_agent: req.headers['user-agent']
  });

  res.status(201).json({
    success: true,
    data: teamUserMap
  });
});

// @desc    Update team member
// @route   PUT /api/v1/teams/members/:id
// @access  Private/Admin
exports.updateTeamMember = asyncHandler(async (req, res, next) => {
  let teamUserMap = await TeamUserMap.findById(req.params.id)
    .populate({
      path: 'team_id',
      select: 'name team_id'
    })
    .populate({
      path: 'user_id',
      select: 'name email'
    });

  if (!teamUserMap) {
    return next(
      new ErrorResponse(`Team member mapping not found with id of ${req.params.id}`, 404)
    );
  }

  // If updating to team lead, check if there's already a team lead
  if (req.body.is_team_lead) {
    const existingTeamLead = await TeamUserMap.findOne({
      team_id: teamUserMap.team_id._id,
      is_team_lead: true,
      _id: { $ne: teamUserMap._id }
    });

    if (existingTeamLead && !req.body.force_team_lead) {
      return next(
        new ErrorResponse(
          `Team already has a team lead. Set force_team_lead=true to replace.`,
          400
        )
      );
    }

    // If forcing team lead change, update the existing team lead
    if (existingTeamLead && req.body.force_team_lead) {
      await TeamUserMap.findByIdAndUpdate(
        existingTeamLead._id,
        { is_team_lead: false },
        { new: true }
      );

      // Log the team lead change
      await UserActivityLog.create({
        user_id: req.user.id,
        action_type: 'update',
        entity_type: 'team_user_map',
        entity_id: existingTeamLead._id,
        description: `Removed team lead status from user in team ${teamUserMap.team_id.name}`,
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    }
  }

  // Store previous state for activity log
  const previousState = { ...teamUserMap.toObject() };

  // Update the team member mapping
  teamUserMap = await TeamUserMap.findByIdAndUpdate(
    req.params.id,
    {
      role: req.body.role,
      is_team_lead: req.body.is_team_lead
    },
    {
      new: true,
      runValidators: true
    }
  );

  // Log the activity
  await UserActivityLog.create({
    user_id: req.user.id,
    action_type: 'update',
    entity_type: 'team_user_map',
    entity_id: teamUserMap._id,
    description: `Updated user role in team ${teamUserMap.team_id.name}`,
    previous_state: previousState,
    new_state: teamUserMap.toObject(),
    ip_address: req.ip,
    user_agent: req.headers['user-agent']
  });

  res.status(200).json({
    success: true,
    data: teamUserMap
  });
});

// @desc    Remove team member
// @route   DELETE /api/v1/teams/members/:id
// @access  Private/Admin
exports.removeTeamMember = asyncHandler(async (req, res, next) => {
  const teamUserMap = await TeamUserMap.findById(req.params.id)
    .populate({
      path: 'team_id',
      select: 'name team_id'
    })
    .populate({
      path: 'user_id',
      select: 'name email'
    });

  if (!teamUserMap) {
    return next(
      new ErrorResponse(`Team member mapping not found with id of ${req.params.id}`, 404)
    );
  }

  // Store the mapping data for activity log
  const deletedMapping = { ...teamUserMap.toObject() };

  await teamUserMap.remove();

  // Log the activity
  await UserActivityLog.create({
    user_id: req.user.id,
    action_type: 'delete',
    entity_type: 'team_user_map',
    entity_id: teamUserMap._id,
    description: `Removed user ${teamUserMap.user_id.name} from team ${teamUserMap.team_id.name}`,
    previous_state: deletedMapping,
    ip_address: req.ip,
    user_agent: req.headers['user-agent']
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get user teams
// @route   GET /api/v1/users/:userId/teams
// @access  Private
exports.getUserTeams = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.userId}`, 404)
    );
  }

  const teamUserMaps = await TeamUserMap.find({ user_id: user._id })
    .populate({
      path: 'team_id',
      select: 'name team_id description department team_type is_active'
    });

  const teams = teamUserMaps.map(map => ({
    id: map.team_id._id,
    team: map.team_id,
    role: map.role,
    is_team_lead: map.is_team_lead,
    joined_at: map.created_at
  }));

  res.status(200).json({
    success: true,
    count: teams.length,
    data: teams
  });
});

// @desc    Get teams by department
// @route   GET /api/v1/teams/department/:department
// @access  Private
exports.getTeamsByDepartment = asyncHandler(async (req, res, next) => {
  const teams = await Team.find({ department: req.params.department, is_active: true })
    .populate({
      path: 'created_by',
      select: 'name email'
    });

  res.status(200).json({
    success: true,
    count: teams.length,
    data: teams
  });
});

// @desc    Get teams by type
// @route   GET /api/v1/teams/type/:type
// @access  Private
exports.getTeamsByType = asyncHandler(async (req, res, next) => {
  const teams = await Team.find({ team_type: req.params.type, is_active: true })
    .populate({
      path: 'created_by',
      select: 'name email'
    });

  res.status(200).json({
    success: true,
    count: teams.length,
    data: teams
  });
});

// @desc    Assign team to profile
// @route   POST /api/v1/teams/assign
// @access  Private/Manager
exports.assignTeamToProfile = asyncHandler(async (req, res, next) => {
  const { profile_id, profile_type, team_id, assignment_reason, expected_completion, priority } = req.body;

  // Validate required fields
  if (!profile_id || !profile_type || !team_id) {
    return next(
      new ErrorResponse('Profile ID, Profile Type, and Team ID are required', 400)
    );
  }

  // Check if team exists
  const team = await Team.findById(team_id);
  if (!team) {
    return next(
      new ErrorResponse(`Team not found with id of ${team_id}`, 404)
    );
  }

  // Check team availability and capacity
  const teamMembers = await TeamUserMap.find({ team_id: team_id, status: 'active' });
  if (teamMembers.length === 0) {
    return next(
      new ErrorResponse('Team has no active members available for assignment', 400)
    );
  }

  // Dynamically get the profile model based on profile_type
  let ProfileModel;
  let profileUpdateData = {
    assigned_team: team_id,
    assignment_date: new Date(),
    assigned_by: req.user.id,
    status: 'assigned'
  };

  switch (profile_type.toLowerCase()) {
    case 'complaint':
      ProfileModel = require('../../models/profile/ComplaintProfile');
      break;
    case 'amc':
      ProfileModel = require('../../models/profile/AmcProfile');
      break;
    case 'project':
      ProfileModel = require('../../models/profile/ProjectProfile');
      break;
    case 'job':
      ProfileModel = require('../../models/profile/JobProfile');
      break;
    case 'info':
      ProfileModel = require('../../models/profile/InfoProfile');
      break;
    case 'product':
      ProfileModel = require('../../models/profile/ProductProfile');
      break;
    default:
      return next(
        new ErrorResponse(`Invalid profile type: ${profile_type}`, 400)
      );
  }

  // Check if profile exists
  const profile = await ProfileModel.findById(profile_id);
  if (!profile) {
    return next(
      new ErrorResponse(`${profile_type} profile not found with id of ${profile_id}`, 404)
    );
  }

  // Update profile with team assignment
  if (assignment_reason) profileUpdateData.assignment_reason = assignment_reason;
  if (expected_completion) profileUpdateData.expected_completion = expected_completion;
  if (priority) profileUpdateData.priority = priority;

  const updatedProfile = await ProfileModel.findByIdAndUpdate(
    profile_id,
    profileUpdateData,
    { new: true, runValidators: true }
  );

  // Create assignment record in TeamUserMap for tracking
  const assignmentRecord = {
    team_id: team_id,
    profile_id: profile_id,
    profile_type: profile_type,
    assigned_by: req.user.id,
    assignment_date: new Date(),
    assignment_reason: assignment_reason || 'Manual assignment',
    expected_completion: expected_completion,
    status: 'active'
  };

  // Log the assignment activity
  await UserActivityLog.create({
    user_id: req.user.id,
    action_type: 'assign',
    entity_type: 'team_profile_assignment',
    entity_id: profile_id,
    details: {
      team_id: team_id,
      team_name: team.name,
      profile_type: profile_type,
      assignment_reason: assignment_reason,
      expected_completion: expected_completion
    },
    ip_address: req.ip,
    user_agent: req.get('User-Agent')
  });

  // Create notification for team members
  const Notification = require('../../models/profile/Notification');
  const teamMemberIds = teamMembers.map(member => member.user_id);
  
  for (const memberId of teamMemberIds) {
    await Notification.create({
      user_id: memberId,
      title: `New ${profile_type} Profile Assigned`,
      message: `You have been assigned a new ${profile_type} profile: ${profile.title || profile.name || profile_id}`,
      type: 'assignment',
      priority: priority || 'medium',
      entity_type: profile_type,
      entity_id: profile_id,
      created_by: req.user.id
    });
  }

  res.status(200).json({
    success: true,
    message: `${profile_type} profile successfully assigned to team ${team.name}`,
    data: {
      profile: updatedProfile,
      team: team,
      assignment_details: assignmentRecord,
      notifications_sent: teamMemberIds.length
    }
  });
});

// @desc    Get team assignments
// @route   GET /api/v1/teams/:id/assignments
// @access  Private
exports.getTeamAssignments = asyncHandler(async (req, res, next) => {
  const team = await Team.findById(req.params.id);
  
  if (!team) {
    return next(
      new ErrorResponse(`Team not found with id of ${req.params.id}`, 404)
    );
  }

  // Get all profile types and their assignments
  const profileTypes = ['ComplaintProfile', 'AmcProfile', 'ProjectProfile', 'JobProfile', 'InfoProfile', 'ProductProfile'];
  const assignments = [];

  for (const profileType of profileTypes) {
    try {
      const ProfileModel = require(`../models/${profileType}`);
      const profiles = await ProfileModel.find({ assigned_team: req.params.id })
        .select('title name description status priority assignment_date expected_completion')
        .sort({ assignment_date: -1 });
      
      profiles.forEach(profile => {
        assignments.push({
          profile_id: profile._id,
          profile_type: profileType.replace('Profile', '').toLowerCase(),
          title: profile.title || profile.name,
          description: profile.description,
          status: profile.status,
          priority: profile.priority,
          assignment_date: profile.assignment_date,
          expected_completion: profile.expected_completion
        });
      });
    } catch (error) {
      // Skip if model doesn't exist
      continue;
    }
  }

  res.status(200).json({
    success: true,
    count: assignments.length,
    data: {
      team: team,
      assignments: assignments
    }
  });
});

// @desc    Unassign team from profile
// @route   DELETE /api/v1/teams/assign/:profileType/:profileId
// @access  Private/Manager
exports.unassignTeamFromProfile = asyncHandler(async (req, res, next) => {
  const { profileType, profileId } = req.params;
  const { reason } = req.body;

  // Dynamically get the profile model
  let ProfileModel;
  switch (profileType.toLowerCase()) {
    case 'complaint':
      ProfileModel = require('../../models/profile/ComplaintProfile');
      break;
    case 'amc':
      ProfileModel = require('../../models/profile/AmcProfile');
      break;
    case 'project':
      ProfileModel = require('../../models/profile/ProjectProfile');
      break;
    case 'job':
      ProfileModel = require('../../models/profile/JobProfile');
      break;
    case 'info':
      ProfileModel = require('../../models/profile/InfoProfile');
      break;
    case 'product':
      ProfileModel = require('../../models/profile/ProductProfile');
      break;
    default:
      return next(
        new ErrorResponse(`Invalid profile type: ${profileType}`, 400)
      );
  }

  const profile = await ProfileModel.findById(profileId);
  if (!profile) {
    return next(
      new ErrorResponse(`${profileType} profile not found with id of ${profileId}`, 404)
    );
  }

  const previousTeamId = profile.assigned_team;
  
  // Remove team assignment
  const updatedProfile = await ProfileModel.findByIdAndUpdate(
    profileId,
    {
      $unset: { 
        assigned_team: 1,
        assignment_date: 1,
        assigned_by: 1
      },
      status: 'unassigned',
      unassignment_reason: reason || 'Manual unassignment',
      unassigned_by: req.user.id,
      unassignment_date: new Date()
    },
    { new: true, runValidators: true }
  );

  // Log the unassignment activity
  await UserActivityLog.create({
    user_id: req.user.id,
    action_type: 'unassign',
    entity_type: 'team_profile_assignment',
    entity_id: profileId,
    details: {
      previous_team_id: previousTeamId,
      profile_type: profileType,
      unassignment_reason: reason
    },
    ip_address: req.ip,
    user_agent: req.get('User-Agent')
  });

  res.status(200).json({
    success: true,
    message: `${profileType} profile successfully unassigned from team`,
    data: updatedProfile
  });
});
