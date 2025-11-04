// routes/userRoutes.js

const express = require('express');
const router = express.Router();

// Import the user controller functions 
const {
  registerUser,
  loginUser,
  getMe,
} = require('../controllers/userController'); 

// Import the protection middleware 
const { protect } = require('../middleware/authMiddleware');


// --- Public Endpoints ---

// POST /api/users/register
router.post('/register', registerUser);

// POST /api/users/login
router.post('/login', loginUser);


// --- Protected Endpoint Example ---

// GET /api/users/me
router.get('/me', protect, getMe);


module.exports = router;