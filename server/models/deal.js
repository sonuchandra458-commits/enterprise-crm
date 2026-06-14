const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  value: { type: Number, required: true, default: 0 },
  stage: {
    type: String,
    enum: ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost'],
    default: 'prospecting'
  },
  probability: { type: Number, default: 0, min: 0, max: 100 },
  lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  expectedCloseDate: Date,
  actualCloseDate: Date,
  description: String,
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Deal', dealSchema);