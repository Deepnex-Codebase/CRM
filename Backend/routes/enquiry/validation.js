const express = require('express');
const router = express.Router();

// Get leads for validation with filters
router.get('/', (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // Mock response for quick testing
    res.json({
      leads: [
        {
          _id: '1',
          name: 'Test Lead',
          email: 'test@example.com',
          phone: '1234567890',
          status: 'new',
          validation_score: 50,
          duplicate_score: 30,
          created_at: new Date()
        }
      ],
      pagination: {
        total: 1,
        page: Number(page),
        limit: Number(limit),
        pages: 1
      }
    });
  } catch (error) {
    console.error('Error fetching leads for validation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get validation statistics
router.get('/statistics', (req, res) => {
  try {
    // Mock statistics
    res.json({
      total_leads: 100,
      needs_validation: 25,
      potential_duplicates: 10,
      validated_today: 15
    });
  } catch (error) {
    console.error('Error fetching validation statistics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get validation settings
router.get('/settings', (req, res) => {
  try {
    // Mock settings
    res.json({
      duplicate_threshold: 80,
      validation_threshold: 60,
      auto_merge: false,
      matching_rules: {
        email: true,
        phone: true,
        name: false
      }
    });
  } catch (error) {
    console.error('Error fetching validation settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Validate a lead
router.put('/:leadId', (req, res) => {
  try {
    const { leadId } = req.params;
    const { validation_score, validation_issues } = req.body;
    
    // Mock response
    res.json({
      _id: leadId,
      validation_score,
      validation_issues,
      validated_at: new Date(),
      validated_by: 'user123'
    });
  } catch (error) {
    console.error('Error validating lead:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Merge duplicate leads
router.post('/merge', (req, res) => {
  try {
    const { primary_lead_id, duplicate_lead_ids } = req.body;
    
    // Mock response
    res.json({
      success: true,
      primary_lead: {
        _id: primary_lead_id,
        merged_at: new Date(),
        merged_by: 'user123'
      },
      merged_leads: duplicate_lead_ids
    });
  } catch (error) {
    console.error('Error merging leads:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;