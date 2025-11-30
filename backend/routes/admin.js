const router = require('express').Router();
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// 1. DASHBOARD COUNTERS (For the Overview Cards)
router.get('/stats', async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const placedStudents = await Application.countDocuments({ status: 'Hired' });

    res.json({ totalStudents, totalJobs, totalApplications, placedStudents });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET ALL STUDENTS (For Student Management Tab)
router.get('/students', async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. GET ALL JOBS (For Job Oversight Tab)
router.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. GET MASTER REPORT (For Placement Tracker Tab)
router.get('/report', async (req, res) => {
  try {
    // This joins the Applications table with Users and Jobs to get names
    const report = await Application.find()
      .populate('userId', 'name email cgpa')
      .populate('jobId', 'title company');
      
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;