const ErrorResponse = require('../../utils/errorResponse');
const asyncHandler = require('../../middleware/async');
const AuditLog = require('../../models/enquiry/AuditLog');
const User = require('../../models/profile/User');

// @desc    Get all audit logs
// @route   GET /api/v1/audit-logs
// @access  Private (Admin only)
exports.getAuditLogs = asyncHandler(async (req, res, next) => {
  // Only admin can view audit logs
  if (req.user.role !== 'Admin') {
    return next(new ErrorResponse('Not authorized to view audit logs', 403));
  }

  const { 
    entity_type, 
    entity_id, 
    action, 
    action_category,
    user_id,
    start_date,
    end_date,
    page = 1, 
    limit = 10 
  } = req.query;

  let filter = {};
  
  if (entity_type) filter.entity_type = entity_type;
  if (entity_id) filter.entity_id = entity_id;
  if (action) filter.action = action;
  if (action_category) filter.action_category = action_category;
  if (user_id) filter.user_id = user_id;
  
  if (start_date || end_date) {
    filter.timestamp = {};
    if (start_date) filter.timestamp.$gte = new Date(start_date);
    if (end_date) filter.timestamp.$lte = new Date(end_date);
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { timestamp: -1 },
    populate: [
      { path: 'user_id', select: 'name email' }
    ]
  };

  const auditLogs = await AuditLog.paginate(filter, options);

  res.status(200).json({
    success: true,
    data: auditLogs
  });
});

// @desc    Get audit log by ID
// @route   GET /api/v1/audit-logs/:id
// @access  Private (Admin only)
exports.getAuditLogById = asyncHandler(async (req, res, next) => {
  // Only admin can view audit logs
  if (req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to view audit logs', 403));
  }

  const auditLog = await AuditLog.findById(req.params.id)
    .populate('user_id', 'name email');

  if (!auditLog) {
    return next(new ErrorResponse('Audit log not found', 404));
  }

  res.status(200).json({
    success: true,
    data: auditLog
  });
});

// @desc    Create audit log
// @route   POST /api/v1/audit-logs
// @access  Private
exports.createAuditLog = asyncHandler(async (req, res, next) => {
  const { 
    entity_type, 
    entity_id, 
    action, 
    changes,
    metadata 
  } = req.body;

  const auditLog = await AuditLog.createLog(
    req.user.id,
    entity_type,
    entity_id,
    action,
    changes,
    {
      ...metadata,
      user_agent: req.get('User-Agent'),
      ip_address: req.ip
    }
  );

  res.status(201).json({
    success: true,
    data: auditLog
  });
});

// @desc    Get user activity
// @route   GET /api/v1/audit-logs/user/:user_id/activity
// @access  Private
exports.getUserActivity = asyncHandler(async (req, res, next) => {
  const { user_id } = req.params;
  const { start_date, end_date, limit = 50 } = req.query;

  // Users can only view their own activity unless admin
  if (user_id !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to view this user activity', 403));
  }

  const activity = await AuditLog.getUserActivity(
    user_id, 
    start_date, 
    end_date, 
    parseInt(limit)
  );

  res.status(200).json({
    success: true,
    data: activity
  });
});

// @desc    Get entity history
// @route   GET /api/v1/audit-logs/entity/:entity_type/:entity_id/history
// @access  Private
exports.getEntityHistory = asyncHandler(async (req, res, next) => {
  const { entity_type, entity_id } = req.params;
  const { limit = 50 } = req.query;

  const history = await AuditLog.getEntityHistory(
    entity_type, 
    entity_id, 
    parseInt(limit)
  );

  res.status(200).json({
    success: true,
    data: history
  });
});

// @desc    Get system activity summary
// @route   GET /api/v1/audit-logs/system/activity-summary
// @access  Private (Admin only)
exports.getSystemActivitySummary = asyncHandler(async (req, res, next) => {
  // Only admin can view system activity summary
  if (req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to view system activity summary', 403));
  }

  const { start_date, end_date } = req.query;

  const summary = await AuditLog.getSystemActivitySummary(start_date, end_date);

  res.status(200).json({
    success: true,
    data: summary
  });
});

// @desc    Get audit analytics
// @route   GET /api/v1/audit-logs/analytics
// @access  Private (Admin only)
exports.getAuditAnalytics = asyncHandler(async (req, res, next) => {
  // Only admin can view audit analytics
  if (req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to view audit analytics', 403));
  }

  const { start_date, end_date, entity_type, action_category } = req.query;

  if (!start_date || !end_date) {
    return next(new ErrorResponse('Start date and end date are required', 400));
  }

  const analytics = await AuditLog.aggregate([
    {
      $match: {
        timestamp: {
          $gte: new Date(start_date),
          $lte: new Date(end_date)
        },
        ...(entity_type && { entity_type }),
        ...(action_category && { action_category })
      }
    },
    {
      $group: {
        _id: {
          entity_type: '$entity_type',
          action_category: '$action_category',
          date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }
        },
        count: { $sum: 1 },
        unique_users: { $addToSet: '$user_id' }
      }
    },
    {
      $project: {
        entity_type: '$_id.entity_type',
        action_category: '$_id.action_category',
        date: '$_id.date',
        count: 1,
        unique_user_count: { $size: '$unique_users' }
      }
    },
    {
      $sort: { date: 1, count: -1 }
    }
  ]);

  res.status(200).json({
    success: true,
    data: analytics
  });
});

// @desc    Get most active users
// @route   GET /api/v1/audit-logs/analytics/active-users
// @access  Private (Admin only)
exports.getMostActiveUsers = asyncHandler(async (req, res, next) => {
  // Only admin can view user activity analytics
  if (req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to view user activity analytics', 403));
  }

  const { start_date, end_date, limit = 10 } = req.query;

  if (!start_date || !end_date) {
    return next(new ErrorResponse('Start date and end date are required', 400));
  }

  const activeUsers = await AuditLog.aggregate([
    {
      $match: {
        timestamp: {
          $gte: new Date(start_date),
          $lte: new Date(end_date)
        }
      }
    },
    {
      $group: {
        _id: '$user_id',
        total_actions: { $sum: 1 },
        action_categories: { $addToSet: '$action_category' },
        entity_types: { $addToSet: '$entity_type' },
        last_activity: { $max: '$timestamp' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user_info'
      }
    },
    {
      $unwind: '$user_info'
    },
    {
      $project: {
        user_id: '$_id',
        user_name: '$user_info.name',
        user_email: '$user_info.email',
        total_actions: 1,
        unique_action_categories: { $size: '$action_categories' },
        unique_entity_types: { $size: '$entity_types' },
        last_activity: 1
      }
    },
    {
      $sort: { total_actions: -1 }
    },
    {
      $limit: parseInt(limit)
    }
  ]);

  res.status(200).json({
    success: true,
    data: activeUsers
  });
});

// @desc    Get security events
// @route   GET /api/v1/audit-logs/security/events
// @access  Private (Admin only)
exports.getSecurityEvents = asyncHandler(async (req, res, next) => {
  // Only admin can view security events
  if (req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to view security events', 403));
  }

  const { start_date, end_date, limit = 100 } = req.query;

  let filter = {
    action_category: 'security'
  };

  if (start_date || end_date) {
    filter.timestamp = {};
    if (start_date) filter.timestamp.$gte = new Date(start_date);
    if (end_date) filter.timestamp.$lte = new Date(end_date);
  }

  const securityEvents = await AuditLog.find(filter)
    .populate('user_id', 'name email')
    .sort({ timestamp: -1 })
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    data: securityEvents
  });
});

// @desc    Get failed login attempts
// @route   GET /api/v1/audit-logs/security/failed-logins
// @access  Private (Admin only)
exports.getFailedLoginAttempts = asyncHandler(async (req, res, next) => {
  // Only admin can view failed login attempts
  if (req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to view failed login attempts', 403));
  }

  const { start_date, end_date, limit = 100 } = req.query;

  let filter = {
    action: 'login_failed'
  };

  if (start_date || end_date) {
    filter.timestamp = {};
    if (start_date) filter.timestamp.$gte = new Date(start_date);
    if (end_date) filter.timestamp.$lte = new Date(end_date);
  }

  const failedLogins = await AuditLog.find(filter)
    .sort({ timestamp: -1 })
    .limit(parseInt(limit));

  // Group by IP address for analysis
  const ipAnalysis = {};
  failedLogins.forEach(log => {
    const ip = log.ip_address;
    if (!ipAnalysis[ip]) {
      ipAnalysis[ip] = {
        ip_address: ip,
        attempt_count: 0,
        first_attempt: log.timestamp,
        last_attempt: log.timestamp,
        attempted_emails: new Set()
      };
    }
    ipAnalysis[ip].attempt_count++;
    ipAnalysis[ip].last_attempt = log.timestamp;
    if (log.metadata && log.metadata.email) {
      ipAnalysis[ip].attempted_emails.add(log.metadata.email);
    }
  });

  // Convert sets to arrays for JSON serialization
  Object.values(ipAnalysis).forEach(analysis => {
    analysis.attempted_emails = Array.from(analysis.attempted_emails);
  });

  res.status(200).json({
    success: true,
    data: {
      failed_logins: failedLogins,
      ip_analysis: Object.values(ipAnalysis).sort((a, b) => b.attempt_count - a.attempt_count)
    }
  });
});

// @desc    Export audit logs
// @route   GET /api/v1/audit-logs/export
// @access  Private (Admin only)
exports.exportAuditLogs = asyncHandler(async (req, res, next) => {
  // Only admin can export audit logs
  if (req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to export audit logs', 403));
  }

  const { start_date, end_date, format = 'json', entity_type } = req.query;

  if (!start_date || !end_date) {
    return next(new ErrorResponse('Start date and end date are required', 400));
  }

  let filter = {
    timestamp: {
      $gte: new Date(start_date),
      $lte: new Date(end_date)
    }
  };

  if (entity_type) {
    filter.entity_type = entity_type;
  }

  const auditLogs = await AuditLog.find(filter)
    .populate('user_id', 'name email')
    .sort({ timestamp: -1 });

  if (format === 'csv') {
    // Convert to CSV format
    const csv = auditLogs.map(log => ({
      audit_log_id: log.audit_log_id,
      timestamp: log.timestamp,
      user_name: log.user_id?.name || '',
      user_email: log.user_id?.email || '',
      entity_type: log.entity_type,
      entity_id: log.entity_id,
      action: log.action,
      action_category: log.action_category,
      ip_address: log.ip_address,
      changes_count: log.changes ? log.changes.length : 0
    }));

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=audit-logs.csv');
    
    // Simple CSV conversion (in production, use a proper CSV library)
    const csvContent = [
      Object.keys(csv[0]).join(','),
      ...csv.map(row => Object.values(row).join(','))
    ].join('\n');
    
    return res.send(csvContent);
  }

  res.status(200).json({
    success: true,
    data: auditLogs
  });
});

// @desc    Archive old audit logs
// @route   POST /api/v1/audit-logs/archive
// @access  Private (Admin only)
exports.archiveOldLogs = asyncHandler(async (req, res, next) => {
  // Only admin can archive logs
  if (req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to archive audit logs', 403));
  }

  const { older_than_days = 365 } = req.body;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - parseInt(older_than_days));

  const result = await AuditLog.updateMany(
    { 
      timestamp: { $lt: cutoffDate },
      archived: { $ne: true }
    },
    { 
      archived: true,
      archived_at: new Date()
    }
  );

  res.status(200).json({
    success: true,
    message: `Archived ${result.modifiedCount} audit logs older than ${older_than_days} days`,
    data: {
      archived_count: result.modifiedCount,
      cutoff_date: cutoffDate
    }
  });
});

// @desc    Delete audit log (Admin only, use with extreme caution)
// @route   DELETE /api/v1/audit-logs/:id
// @access  Private (Admin only)
exports.deleteAuditLog = asyncHandler(async (req, res, next) => {
  const auditLog = await AuditLog.findById(req.params.id);

  if (!auditLog) {
    return next(new ErrorResponse('Audit log not found', 404));
  }

  // Only allow super admin to delete audit logs
  if (req.user.role !== 'admin' || !req.user.is_super_admin) {
    return next(new ErrorResponse('Not authorized to delete audit logs', 403));
  }

  // Log the deletion attempt
  await AuditLog.createLog(
    req.user.id,
    'audit_log',
    req.params.id,
    'delete',
    [{ field: 'deleted', old_value: false, new_value: true }],
    {
      reason: 'Manual deletion by super admin',
      user_agent: req.get('User-Agent'),
      ip_address: req.ip
    }
  );

  await auditLog.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
