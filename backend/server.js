const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors
require('dotenv').config();

const app = express();

// --- CRITICAL SECTION: MIDDLEWARE ---
// 1. Allow CORS first (This acts as the gatekeeper)
app.use(cors()); // No brackets, no options. Just allow everything.

// 2. Allow JSON data to be understood
app.use(express.json()); 
// ------------------------------------

// Hardcoded Database Connection
// (Replace the password below with your real one if needed)
const dbUrl = "mongodb+srv://2400030452:2400030452@cluster0.bv6wjyn.mongodb.net/placementDB?appName=Cluster0";

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || dbUrl)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/superadmin', require('./routes/superAdmin'));
app.use('/api/notifications', require('./routes/notifications'));
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));