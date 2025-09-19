const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  session_id: {
    type: String,
    unique: true,
    default: function() {
      // Generate ID format: SESS-YYYYMMDD-XXXX (where XXXX is sequential)
      const today = new Date();
      const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
      return `SESS-${dateStr}-XXXX`; // This will be replaced by pre-save hook
    }
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  device_info: {
    type: String,
    default: null
  },
  ip_address: {
    type: String,
    default: null
  },
  issued_at: {
    type: Date,
    default: Date.now
  },
  expires_at: {
    type: Date,
    required: true
  },
  is_active: {
    type: Boolean,
    default: true
  }
});

// Index for faster queries and automatic expiry
SessionSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });
SessionSchema.index({ user_id: 1, is_active: 1 });

// Create session_id before saving
SessionSchema.pre('save', async function(next) {
  // Only generate ID for new documents
  if (!this.isNew || this.session_id.indexOf('XXXX') === -1) {
    return next();
  }
  
  // Generate ID format: SESS-YYYYMMDD-XXXX (where XXXX is sequential)
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
  
  // Find the highest session_id for today
  const lastSession = await this.constructor.findOne(
    { session_id: new RegExp(`^SESS-${dateStr}`) },
    { session_id: 1 },
    { sort: { session_id: -1 } }
  );
  
  let sequence = 1;
  if (lastSession && lastSession.session_id) {
    const lastSequence = parseInt(lastSession.session_id.split('-')[2]);
    if (!isNaN(lastSequence)) {
      sequence = lastSequence + 1;
    }
  }
  
  // Pad sequence with leading zeros
  const paddedSequence = sequence.toString().padStart(4, '0');
  this.session_id = `SESS-${dateStr}-${paddedSequence}`;
  
  next();
});

module.exports = mongoose.model('Session', SessionSchema);