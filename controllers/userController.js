const User = require('../models/User');

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
    }

    const user = await User.create({ name, email, password, role });
 
    res.status(201).json(user);
} catch (err) {
    res.status(400).json({ error: err.message });
  } 
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } 
};