const express = require('express');
const router = express.Router();
const { getCustomers, createCustomer, updateCustomer, deleteCustomer } = require('../controllers/customers.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);
router.route('/').get(getCustomers).post(createCustomer);
router.route('/:id').put(updateCustomer).delete(authorize('admin'), deleteCustomer);

module.exports = router;