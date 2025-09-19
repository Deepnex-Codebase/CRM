const mongoose = require('mongoose');

const ProfileMappingSchema = new mongoose.Schema({
  mapping_id: {
    type: String,
    unique: true,
    default: function() {
      // Generate ID format: MAP-YYYYMMDD-XXXX (where XXXX is sequential)
      const today = new Date();
      const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
      return `MAP-${dateStr}-XXXX`; // This will be replaced by pre-save hook
    }
  },
  enquiry_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enquiry',
    required: true
  },
  profile_type: {
    type: String,
    required: true,
    enum: [
      'project',
      'product',
      'amc',
      'complaint',
      'info',
      'job',
      'site_visit'
    ]
  },
  profile_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // This is a dynamic reference based on profile_type
    refPath: 'profile_type_ref'
  },
  profile_type_ref: {
    type: String,
    required: true,
    enum: [
      'ProjectProfile',
      'ProductProfile',
      'AmcProfile',
      'ComplaintProfile',
      'InfoProfile',
      'JobProfile',
      'SiteVisitSchedule'
    ]
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to generate sequential mapping_id
ProfileMappingSchema.pre('save', async function(next) {
  if (this.mapping_id.includes('XXXX')) {
    try {
      // Find the latest mapping with the same date prefix
      const today = new Date();
      const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
      const prefix = `MAP-${dateStr}`;
      
      const lastMapping = await this.constructor.findOne(
        { mapping_id: { $regex: `^${prefix}` } },
        { mapping_id: 1 },
        { sort: { mapping_id: -1 } }
      );
      
      let nextNumber = 1;
      if (lastMapping) {
        const lastNumber = parseInt(lastMapping.mapping_id.split('-')[2]);
        if (!isNaN(lastNumber)) {
          nextNumber = lastNumber + 1;
        }
      }
      
      // Pad with leading zeros to make it 4 digits
      const paddedNumber = nextNumber.toString().padStart(4, '0');
      this.mapping_id = `${prefix}-${paddedNumber}`;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Update the updated_at field on save
ProfileMappingSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('ProfileMapping', ProfileMappingSchema);