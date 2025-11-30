const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  postedBy: { type: String }, 
  status: { type: String, default: 'Open', enum: ['Open', 'Closed'] }, // New Status
  
  // --- NEW ELIGIBILITY FIELDS ---
  minCGPA: { type: Number, default: 0 },
  requiredSkills: { type: String, default: '' }, // e.g. "React, Node"
  branch: { type: String, default: 'All' },
  salary: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', JobSchema);