const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, default: 'Applied', enum: ['Applied', 'Shortlisted', 'Rejected', 'Hired'] },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', ApplicationSchema);