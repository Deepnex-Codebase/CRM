const express = require('express');
const {
  getAssignmentLogs,
  getAssignmentLogById,
  createAssignmentLog,
  updateAssignmentLog,
  deleteAssignmentLog,
  getEnquiryAssignmentHistory,
  getAssignmentAnalytics,
  getUserAssignments,
  getWorkloadDistribution,
  exportAssignmentLogs
} = require('../../controllers/enquiry/assignmentLogs');

const router = express.Router();

const { protect, authorize } = require('../../middleware/auth');

router.use(protect);

// Get all assignment logs with filters
router.get('/', getAssignmentLogs);

// Create new assignment log
router.post('/', authorize('Admin', 'Sales Head'), createAssignmentLog);

// Get assignment analytics
router.get('/analytics', authorize('Admin', 'Sales Head'), getAssignmentAnalytics);

// Get workload distribution
router.get('/workload-distribution', authorize('Admin', 'Sales Head'), getWorkloadDistribution);

// Export assignment logs
router.get('/export', authorize('Admin', 'Sales Head'), exportAssignmentLogs);

// Get enquiry assignment history
router.get('/enquiry/:enquiry_id', getEnquiryAssignmentHistory);

// Get user assignments
router.get('/user/:user_id', authorize('Admin', 'Sales Head'), getUserAssignments);

// Routes for specific assignment log
router.route('/:id')
  .get(getAssignmentLogById)
  .put(authorize('Admin', 'Sales Head'), updateAssignmentLog)
  .delete(authorize('Admin'), deleteAssignmentLog);

module.exports = router;
