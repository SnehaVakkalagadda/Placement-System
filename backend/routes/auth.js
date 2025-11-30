const router = require('express').Router();
const User = require('../models/User');

// SIGNUP API
router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, role , password} = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ name, email, phone, role , password});
    await newUser.save();
    
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN API
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Simple role check (In real apps, use password hashing here)
    if (user.role !== role) return res.status(400).json({ message: "Role mismatch" });

    if (user.password !== password) {
        return res.status(400).json({ message: "Invalid Password" });
    }

    res.json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// UPDATE USER PROFILE (CGPA, Skills, GitHub)
router.put('/update/:id', async (req, res) => {
  try {
    const { cgpa, skills, githubLink } = req.body;
    
    // skills comes as a string "React, Node", we need to convert to Array ["React", "Node"]
    const skillsArray = typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : skills;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { cgpa, skills: skillsArray, githubLink },
      { new: true } // Return the updated user data
    );
    
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;