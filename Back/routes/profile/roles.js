const express = require('express');
const {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole
} = require('../../controllers/profile/roles');

const router = express.Router();

const { protect, authorize } = require('../../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(getRoles)
  .post(createRole);

router
  .route('/:id')
  .get(getRole)
  .put(updateRole)
  .delete(deleteRole);

module.exports = router;