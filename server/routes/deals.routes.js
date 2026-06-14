const express = require('express');
const router = express.Router();
const { getDeals, createDeal, updateDeal, deleteDeal } = require('../controllers/deals.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);
router.route('/').get(getDeals).post(createDeal);
router.route('/:id').put(updateDeal).delete(authorize('admin', 'manager'), deleteDeal);

module.exports = router;