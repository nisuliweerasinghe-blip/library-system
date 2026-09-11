require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Library System API is running');
});

const PORT = process.env.PORT || 5000;

const User = require('./models/User');
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));