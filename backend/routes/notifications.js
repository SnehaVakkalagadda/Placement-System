const router = require('express').Router();
const Notification = require('../models/Notification');
const Application = require('../models/Application');

// 1. SEND INTERVIEW INVITES (Bulk Action)
router.post('/schedule', async (req, res) => {
  try {
    const { jobId, jobTitle, date, time, type } = req.body;

    // Find all SHORTLISTED candidates for this job
    const candidates = await Application.find({ jobId, status: 'Shortlisted' });

    if (candidates.length === 0) {
      return res.status(400).json({ message: "No shortlisted candidates found for this job." });
    }

    // Create a notification for each candidate
    const notifications = candidates.map(app => ({
      userId: app.userId,
      message: `Interview Scheduled: ${type} for ${jobTitle} on ${date} at ${time}. Check your email for link.`,
      type: 'alert'
    }));

    await Notification.insertMany(notifications);

    res.json({ message: `Invites sent to ${candidates.length} candidates.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET MY NOTIFICATIONS (Student)
router.get('/:userId', async (req, res) => {
  try {
    const notifs = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;