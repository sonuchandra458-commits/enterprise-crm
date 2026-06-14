require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health check
app.get('/', (req, res) => res.json({ message: 'CRM API running ✅' }));

// Routes — ek ek load karo
try {
  app.use('/api/auth',       require('./routes/auth.routes'));
  console.log('✅ auth routes loaded');
} catch(e) { console.error('❌ auth routes:', e.message); }

try {
  app.use('/api/leads',      require('./routes/leads.routes'));
  console.log('✅ leads routes loaded');
} catch(e) { console.error('❌ leads routes:', e.message); }

try {
  app.use('/api/deals',      require('./routes/deals.routes'));
  console.log('✅ deals routes loaded');
} catch(e) { console.error('❌ deals routes:', e.message); }

try {
  app.use('/api/customers',  require('./routes/customers.routes'));
  console.log('✅ customers routes loaded');
} catch(e) { console.error('❌ customers routes:', e.message); }

try {
  app.use('/api/activities', require('./routes/activities.routes'));
  console.log('✅ activities routes loaded');
} catch(e) { console.error('❌ activities routes:', e.message); }

try {
  app.use('/api/dashboard',  require('./routes/dashboard.routes'));
  console.log('✅ dashboard routes loaded');
} catch(e) { console.error('❌ dashboard routes:', e.message); }

try {
  app.use('/api/users',      require('./routes/users.routes'));
  console.log('✅ users routes loaded');
} catch(e) { console.error('❌ users routes:', e.message); }

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`✅ Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });