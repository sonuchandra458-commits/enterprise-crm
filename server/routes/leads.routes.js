const express = require('express');
const router = express.Router();
const { getLeads, createLead, getLead, updateLead, deleteLead } = require('../controllers/leads.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);
router.route('/').get(getLeads).post(createLead);
router.route('/:id').get(getLead).put(updateLead).delete(authorize('admin', 'manager'), deleteLead);

module.exports = router;