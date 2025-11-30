const router = require('express').Router();
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// 1. GET ALL USERS (For Management)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Don't send passwords
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. DELETE USER
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    // Also delete their applications to keep DB clean
    await Application.deleteMany({ userId: req.params.id });
    res.json({ message: "User Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. DEEP ANALYTICS (Placement Rate & Avg Salary)
router.get('/analytics', async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const hiredCount = await Application.countDocuments({ status: 'Hired' });
    
    // Calculate Placement Rate
    const placementRate = totalStudents === 0 ? 0 : Math.round((hiredCount / totalStudents) * 100);

    // Calculate Average Salary
    // (Find all hired applications, look up their job, average the salary)
    const hiredApps = await Application.find({ status: 'Hired' }).populate('jobId');
    
    let totalSalary = 0;
    let salaryCount = 0;
    
    hiredApps.forEach(app => {
        if(app.jobId && app.jobId.salary) {
            totalSalary += app.jobId.salary;
            salaryCount++;
        }
    });
    
    const avgSalary = salaryCount === 0 ? 0 : Math.round(totalSalary / salaryCount);

    res.json({
        placementRate,
        avgSalary,
        totalStudents,
        hiredCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;