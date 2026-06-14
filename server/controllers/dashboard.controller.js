const Lead = require('../models/Lead');
const Deal = require('../models/Deal');
const Customer = require('../models/Customer');
const Activity = require('../models/Activity');

exports.getStats = async (req, res, next) => {
  try {
    const [totalLeads, totalDeals, totalCustomers, totalActivities] = await Promise.all([
      Lead.countDocuments(),
      Deal.countDocuments(),
      Customer.countDocuments(),
      Activity.countDocuments()
    ]);

    const wonDeals = await Deal.aggregate([
      { $match: { stage: 'closed-won' } },
      { $group: { _id: null, total: { $sum: '$value' } } }
    ]);

    const leadsByStatus = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const dealsByStage = await Deal.aggregate([
      { $group: { _id: '$stage', count: { $sum: 1 }, value: { $sum: '$value' } } }
    ]);

    const recentLeads = await Lead.find()
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentActivities = await Activity.find()
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        stats: {
          totalLeads,
          totalDeals,
          totalCustomers,
          totalActivities,
          totalRevenue: wonDeals[0]?.total || 0
        },
        leadsByStatus,
        dealsByStage,
        recentLeads,
        recentActivities
      }
    });
  } catch (err) { next(err); }
};