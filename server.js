require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
   console.log('MONGO_URI is:', process.env.MONGO_URI);

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Library System API is running');
});

const PORT = process.env.PORT || 5000;

const bookRoutes = require('./routes/bookRoutes');
app.use('/api/books', bookRoutes);
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
const borrowRoutes = require('./routes/borrowRoutes');
app.use('/api/borrow', borrowRoutes);
const reservationRoutes = require('./routes/reservationRoutes');
app.use('/api/reservations', reservationRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));