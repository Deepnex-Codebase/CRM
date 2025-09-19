const express = require('express');
const {
  getCallLogs,
  getCallLogById,
  createCallLog,
  updateCallLog,
  deleteCallLog,
  startCall,
  endCall,
  addCallFeedback,
  getEnquiryCallHistory,
  getUserCallHistory,
  getCallAnalytics,
  exportCallLogs
} = require('../../controllers/enquiry/callLogs');

const router = express.Router();

const { protect, authorize } = require('../../middleware/auth');

router.use(protect);

// Get all call logs with filters
router.get('/', getCallLogs);

// Create new call log
router.post('/', authorize('Admin', 'Sales Head', 'Telecaller'), createCallLog);

// Start a call
router.post('/start', authorize('Telecaller'), startCall);

// End a call
router.put('/end/:id', authorize('Telecaller'), endCall);

// Get call analytics
router.get('/analytics', authorize('Admin', 'Sales Head'), getCallAnalytics);

// Export call logs
router.get('/export', authorize('Admin', 'Sales Head'), exportCallLogs);

// Get enquiry call history
router.get('/enquiry/:enquiry_id', getEnquiryCallHistory);

// Get user call history
router.get('/user/:user_id', getUserCallHistory);

// Add call feedback
router.post('/:id/feedback', authorize('Telecaller'), addCallFeedback);

// Routes for specific call log
router.route('/:id')
  .get(getCallLogById)
  .put(authorize('Admin', 'Sales Head', 'Telecaller'), updateCallLog)
  .delete(authorize('Admin'), deleteCallLog);

module.exports = router;
