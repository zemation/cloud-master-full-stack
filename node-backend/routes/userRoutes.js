// routes/userRoutes.js

const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
  forgotPassword,
  resetPassword,
  updatePassword
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');

// Public

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

// Protected
router.get('/logout', protect, logoutUser);
router.get('/me', protect, getMe);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;