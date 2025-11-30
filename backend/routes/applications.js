const router = require('express').Router();
const Application = require('../models/Application');

// 1. APPLY FOR A JOB
router.post('/apply', async (req, res) => {
  try {
    const { userId, jobId } = req.body;

    // Check if already applied
    const existing = await Application.findOne({ userId, jobId });
    if (existing) return res.status(400).json({ message: "You have already applied for this job." });

    const newApplication = new Application({ userId, jobId });
    await newApplication.save();
    
    res.status(201).json({ message: "Application Submitted Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET MY APPLICATIONS
router.get('/:userId', async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.params.userId }).populate('jobId');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;