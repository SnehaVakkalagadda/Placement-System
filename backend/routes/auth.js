const router = require('express').Router(); 
const User = require('../models/User'); 
console.log("✅ Auth Route File Loaded Successfully"); 
// TEST ROUTE (To debug) 
// // Go to https://your-url.onrender.com/api/auth/test to check this 
router.get('/test', (req, res) => { 
    res.send("Auth Route is reachable!"); 
}); 
// // SIGNUP 
router.post('/signup', async (req, res) => { 
    try { 
        const { name, email, phone, role, password } = req.body; 
        const existingUser = await User.findOne({ email }); 
        if (existingUser) return res.status(400).json({ message: "User already exists" }); 
        const newUser = new User({ name, email, phone, role, password }); 
        await newUser.save(); res.status(201).json({ 
            message: "User registered successfully", 
            user: newUser 
        }); 
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
       } 
}); 
// LOGIN (Notice it is just '/login') 
router.post('/login', async (req, res) => { 
    try { 
        const { email, password, role } = req.body; 
        const user = await User.findOne({ email }); 
        console.log("DB password:", user?.password);
        console.log("Input password:", password);
        console.log("Are they equal?", user?.password === password);
        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.role !== role) return res.status(400).json({ message: "Role mismatch" }); 
        if (user.password !== password) return res.status(400).json({ message: "Invalid Password" }); 
        res.json({ message: "Login successful", user }); 
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
      } 
}); 
module.exports = router;