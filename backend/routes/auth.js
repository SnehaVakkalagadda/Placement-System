const router = require('express').Router();
const User = require('../models/User');

console.log("✅ Auth Route File Loaded Successfully");

// TEST ROUTE
router.get('/test', (req, res) => {
  res.send("Auth Route is reachable!");
});

// =======================
// SIGNUP
// =======================
router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, role, password } = req.body;

    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailClean = email.trim().toLowerCase();
    const passwordClean = password.trim();

    const existingUser = await User.findOne({ email: emailClean });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      name,
      email: emailClean,
      phone,
      role,
      password: passwordClean
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: newUser
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// LOGIN
// =======================
router.post('/login', async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password?.trim();
    const role = req.body.role;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== role) {
      return res.status(400).json({ message: "Role mismatch" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    res.json({ message: "Login successful", user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
