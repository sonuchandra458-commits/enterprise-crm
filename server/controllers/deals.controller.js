const Deal = require('../models/Deal');

exports.getDeals = async (req, res, next) => {
  try {
    const { stage } = req.query;
    const filter = {};
    if (stage) filter.stage = stage;
    if (req.user.role === 'sales') filter.assignedTo = req.user._id;

    const deals = await Deal.find(filter)
      .populate('assignedTo', 'name email')
      .populate('lead', 'name company')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: deals });
  } catch (err) { next(err); }
};

exports.createDeal = async (req, res, next) => {
  try {
    const deal = await Deal.create({ ...req.body, assignedTo: req.body.assignedTo || req.user._id });
    res.status(201).json({ success: true, data: deal });
  } catch (err) { next(err); }
};

exports.updateDeal = async (req, res, next) => {
  try {
    const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!deal) return res.status(404).json({ success: false, message: 'Deal not found' });
    res.json({ success: true, data: deal });
  } catch (err) { next(err); }
};

exports.deleteDeal = async (req, res, next) => {
  try {
    await Deal.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deal deleted' });
  } catch (err) { next(err); }
};