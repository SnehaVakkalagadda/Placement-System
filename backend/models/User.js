const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'student', enum: ['student', 'employer', 'admin','placement_officer'] },
  
  // --- NEW PROFILE FIELDS ---
  cgpa: { type: Number, default: 0 },
  skills: { type: [String], default: [] }, // e.g., ["React", "Python"]
  resumeLink: { type: String, default: "" },
  githubLink: { type: String, default: "" },
  backlogs: { type: Number, default: 0 } // For eligibility checks

});

module.exports = mongoose.model('User', UserSchema);