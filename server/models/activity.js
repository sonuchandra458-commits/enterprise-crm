const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['call', 'email', 'meeting', 'note', 'task'],
    required: true
  },
  title: { type: String, required: true },
  description: String,
  outcome: String,
  duration: Number, // in minutes
  scheduledAt: Date,
  completedAt: Date,
  isDone: { type: Boolean, default: false },
  relatedTo: {
    model: { type: String, enum: ['Lead', 'Deal', 'Customer'] },
    id: { type: mongoose.Schema.Types.ObjectId, refPath: 'relatedTo.model' }
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);