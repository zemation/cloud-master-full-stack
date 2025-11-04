// controllers/userController.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
const User = require('../models/UserModel'); 
const asyncHandler = require('express-async-handler'); 


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', 
  });
};


// @desc    Register a new admin user
// @route   POST /api/users/register
// @access  Public 
const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // 1. Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please add all fields: name, email, and password.');
  }

  // 2. Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists.');
  }

  // 3. Create User 
  const user = await User.create({
    name,
    email,
    password,
  });

  // 4. Respond
  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id), 
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data received.');
  }
});


// @desc    Authenticate and log in an admin user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Check for user email in database
  const user = await User.findOne({ email });

  // 2. Compare password (using the custom method defined in UserModel)
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id), 
    });
  } else {
    res.status(401); // Unauthorized
    // ⬅️ FIX APPLIED: Throwing a new Error ensures a message field is sent to the client.
    throw new Error('Invalid credentials.'); 
  }
});


// @desc    Get current admin user data
// @route   GET /api/users/me
// @access  Private 
const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user); 
});


module.exports = {
  registerUser,
  loginUser,
  getMe,
};