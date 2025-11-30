const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. Allow Frontend to talk to Backend
app.use(cors()); 
app.use(express.json());

// 2. Database Connection
const dbUrl = "mongodb+srv://2400030452:2400030452@cluster0.bv6wjyn.mongodb.net/placementDB?appName=Cluster0";
mongoose.connect(process.env.MONGO_URI || dbUrl)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ Connection Error:', err));

// 3. Test Route (Keep this to verify server is alive)
app.get('/', (req, res) => {
  res.send("Backend is working!");
});

// 4. API Routes - PAY ATTENTION HERE
// The server looks for the file './routes/auth.js'
app.use('/api/auth', require('./routes/auth')); 
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/notifications', require('./routes/notifications'));
// Ensure this file exists and matches casing 'superAdmin.js' vs 'superadmin.js'
// If you named it superAdmin.js, change this line to match!
app.use('/api/superadmin', require('./routes/superAdmin')); 

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));