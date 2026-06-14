const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  company: { type: String, trim: true },
  position: { type: String, trim: true },
  source: {
    type: String,
    enum: ['website', 'referral', 'cold-call', 'social', 'email', 'other'],
    default: 'other'
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'],
    default: 'new'
  },
  value: { type: Number, default: 0 },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [String],
  notes: String,
  nextFollowUp: Date
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);