const Activity = require('../models/Activity');

exports.getActivities = async (req, res, next) => {
  try {
    const { type, isDone, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (isDone !== undefined) filter.isDone = isDone === 'true';

    const activities = await Activity.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, data: activities });
  } catch (err) { next(err); }
};

exports.createActivity = async (req, res, next) => {
  try {
    const activity = await Activity.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, data: activity });
  } catch (err) { next(err); }
};

exports.updateActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });
    res.json({ success: true, data: activity });
  } catch (err) { next(err); }
};

exports.deleteActivity = async (req, res, next) => {
  try {
    await Activity.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Activity deleted' });
  } catch (err) { next(err); }
};