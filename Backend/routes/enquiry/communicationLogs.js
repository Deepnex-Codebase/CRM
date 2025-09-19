const express = require('express');
const {
  getCommunicationLogs,
  getCommunicationLogById,
  createCommunicationLog,
  updateCommunicationLog,
  deleteCommunicationLog,
  getEnquiryCommunications,
  getCommunicationAnalytics,
  getUserCommunications,
  markAsRead,
  exportCommunicationLogs
} = require('../../controllers/enquiry/communicationLogs');

const router = express.Router();

const { protect, authorize } = require('../../middleware/auth');

router.use(protect);

// Get all communication logs with filters
router.get('/', getCommunicationLogs);

// Create new communication log
router.post('/', authorize('Admin', 'Sales Head', 'Telecaller'), createCommunicationLog);

// Get communication analytics
router.get('/analytics', authorize('Admin', 'Sales Head'), getCommunicationAnalytics);

// Export communication logs
router.get('/export', authorize('Admin', 'Sales Head'), exportCommunicationLogs);

// Get enquiry communications
router.get('/enquiry/:enquiry_id', getEnquiryCommunications);

// Get user communications
router.get('/user/:user_id', getUserCommunications);

// Mark communication as read
router.put('/:id/read', markAsRead);

// Routes for specific communication log
router.route('/:id')
  .get(getCommunicationLogById)
  .put(authorize('Admin', 'Sales Head', 'Telecaller'), updateCommunicationLog)
  .delete(authorize('Admin'), deleteCommunicationLog);

module.exports = router;
