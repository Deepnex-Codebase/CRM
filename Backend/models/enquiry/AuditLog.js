const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  audit_log_id: {
    type: String,
    unique: true,
    default: function() {
      // Generate ID format: AUDIT-YYYYMMDD-XXXX
      const today = new Date();
      const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
      return `AUDIT-${dateStr}-XXXX`; // This will be replaced by pre-save hook
    }
  },
  entity_type: {
    type: String,
    required: [true, 'Entity type is required'],
    enum: [
      'Enquiry',
      'User',
      'Task',
      'StatusLog',
      'AssignmentLog',
      'CommunicationLog',
      'CallLog',
      'CallFeedback',
      'NotificationLog',
      'IntegrationConfig',
      'StatusType',
      'PriorityScoreType',
      'SourceChannel',
      'System',
      'Authentication',
      'Other'
    ]
  },
  entity_id: {
    type: String,
    required: [true, 'Entity ID is required']
  },
  action: {
    type: String,
    required: [true, 'Action is required'],
    enum: [
      'CREATE',
      'READ',
      'UPDATE',
      'DELETE',
      'LOGIN',
      'LOGOUT',
      'ASSIGN',
      'UNASSIGN',
      'APPROVE',
      'REJECT',
      'ACTIVATE',
      'DEACTIVATE',
      'SEND',
      'RECEIVE',
      'CALL',
      'EMAIL',
      'SMS',
      'WHATSAPP',
      'SYNC',
      'EXPORT',
      'IMPORT',
      'OTHER'
    ]
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return !this.is_system_action;
    }
  },
  is_system_action: {
    type: Boolean,
    default: false
  },
  ip_address: {
    type: String
  },
  user_agent: {
    type: String
  },
  old_values: {
    type: mongoose.Schema.Types.Mixed
  },
  new_values: {
    type: mongoose.Schema.Types.Mixed
  },
  changes: [{
    field: {
      type: String,
      required: true
    },
    old_value: mongoose.Schema.Types.Mixed,
    new_value: mongoose.Schema.Types.Mixed,
    change_type: {
      type: String,
      enum: ['added', 'modified', 'removed'],
      required: true
    }
  }],
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  status: {
    type: String,
    enum: ['success', 'failure', 'warning', 'info'],
    default: 'success'
  },
  session_id: {
    type: String
  },
  correlation_id: {
    type: String
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  created_at: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Pre-save hook to generate unique audit_log_id
AuditLogSchema.pre('save', async function(next) {
  if (this.isNew && this.audit_log_id.includes('XXXX')) {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    
    // Find the last audit log for today
    const lastLog = await this.constructor.findOne({
      audit_log_id: new RegExp(`^AUDIT-${dateStr}-`)
    }).sort({ audit_log_id: -1 });
    
    let sequence = 1;
    if (lastLog) {
      const lastSequence = parseInt(lastLog.audit_log_id.split('-')[2]);
      sequence = lastSequence + 1;
    }
    
    this.audit_log_id = `AUDIT-${dateStr}-${sequence.toString().padStart(4, '0')}`;
  }
  
  next();
});

// Indexes for better performance
AuditLogSchema.index({ entity_type: 1, entity_id: 1 });
AuditLogSchema.index({ user_id: 1, created_at: -1 });
AuditLogSchema.index({ action: 1, created_at: -1 });
AuditLogSchema.index({ severity: 1, created_at: -1 });
AuditLogSchema.index({ status: 1 });
AuditLogSchema.index({ session_id: 1 });
AuditLogSchema.index({ correlation_id: 1 });
AuditLogSchema.index({ created_at: -1 }); // Most recent first

// Static method to create audit log entry
AuditLogSchema.statics.createLog = function(logData) {
  const auditLog = new this(logData);
  return auditLog.save();
};

// Static method to get user activity
AuditLogSchema.statics.getUserActivity = function(userId, startDate, endDate, limit = 100) {
  const query = { user_id: userId };
  
  if (startDate || endDate) {
    query.created_at = {};
    if (startDate) query.created_at.$gte = new Date(startDate);
    if (endDate) query.created_at.$lte = new Date(endDate);
  }
  
  return this.find(query)
    .populate('user_id', 'name email')
    .sort({ created_at: -1 })
    .limit(limit);
};

// Static method to get entity history
AuditLogSchema.statics.getEntityHistory = function(entityType, entityId, limit = 50) {
  return this.find({
    entity_type: entityType,
    entity_id: entityId
  })
    .populate('user_id', 'name email')
    .sort({ created_at: -1 })
    .limit(limit);
};

module.exports = mongoose.model('AuditLog', AuditLogSchema);