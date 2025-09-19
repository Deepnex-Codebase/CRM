const express = require('express');
const {
  getEnquiries,
  getEnquiry,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  addRemark,
  assignEnquiry,
  updateStatus,
  checkDuplicate,
  getEnquiriesByStatus,
  getEnquiriesByStage,
  getAssignedEnquiries,
  getTelecallerQueue,
  getTelecallerDashboard,
  getEnquiryFormConfig,
  exportTemplate,
  getEnquiryHistory,
  exportEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  getEnquiryRemarks,
  startCall,
  endCall,
  getEnquiryCalls,
  getEnquiryFilters
} = require('../../controllers/enquiry/enquiries');

const router = express.Router();

const { protect, authorize } = require('../../middleware/auth');

router.use(protect);

// Get all enquiries with filters
router.get('/', getEnquiries);

// Create new enquiry
router.post('/', authorize('Admin', 'Sales Head', 'Telecaller'), createEnquiry);

// Get form configuration
router.get('/form-config', getEnquiryFormConfig);

// Export template
router.get('/export-template', authorize('Admin', 'Sales Head'), exportTemplate);

// Get enquiry history
router.get('/history', authorize('Admin', 'Sales Head'), getEnquiryHistory);

// Export enquiries
router.get('/export', authorize('Admin', 'Sales Head'), exportEnquiries);

// Check duplicate
router.post('/check-duplicate', checkDuplicate);

// Get telecaller queue
router.get('/telecaller-queue', authorize('Telecaller'), getTelecallerQueue);

// Get telecaller dashboard
router.get('/telecaller/dashboard', authorize('Telecaller'), getTelecallerDashboard);

// Get enquiries by status
router.get('/status/:status', getEnquiriesByStatus);

// Get enquiries by stage
router.get('/stage/:stage', getEnquiriesByStage);

// Get assigned enquiries
router.get('/assigned/:userId', getAssignedEnquiries);

// Dynamic filter options
router.get('/filters', getEnquiryFilters);

// Single enquiry routes
router.route('/:id')
  .get(getEnquiryById)
  .put(authorize('Admin', 'Sales Head', 'Telecaller'), updateEnquiry)
  .delete(authorize('Admin'), deleteEnquiry);

// Update enquiry status
router.put('/:id/status', authorize('Admin', 'Sales Head', 'Telecaller'), updateEnquiryStatus);

// Assign enquiry
router.put('/:id/assign', authorize('Admin', 'Sales Head'), assignEnquiry);

// Add remark
router.post('/:id/remarks', authorize('Admin', 'Sales Head', 'Telecaller'), addRemark);

// Get enquiry remarks
router.get('/:id/remarks', getEnquiryRemarks);

// Telecaller call logging
router.post('/calls/start', authorize('Telecaller'), startCall);
router.post('/calls/end', authorize('Telecaller'), endCall);
router.get('/:id/calls', authorize('Telecaller', 'Admin', 'Sales Head'), getEnquiryCalls);

module.exports = router;
