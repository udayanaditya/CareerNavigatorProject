const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const careerRoutes = require('./routes/careerRoutes');
const userRoutes = require('./routes/userRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/careers', careerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assessments', assessmentRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Dream Career Finder API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});