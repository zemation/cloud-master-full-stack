// routes/resourceRoutes.js

const express = require('express');
const router = express.Router();

// --- Core Dependencies ---
const {
  getResources,
  createResource,
  updateResource,
  deleteResource,
  getAllCertifications
} = require('../controllers/resourceController');

// --- Security Middleware ---
// Import the middleware to require a valid JWT for resource modification
const { protect } = require('../middleware/authMiddleware');


// --- 1. /api/resources Routes ---
// GET is public (anyone can view resources).
// POST is protected (only authenticated admins can create resources).
router.route('/')
  .get(getResources)   // Handles: GET /api/resources?category=X&topic=Y (PUBLIC)
  .post(protect, createResource); // Handles: POST /api/resources (PROTECTED)


// Resource modification/deletion requires authentication.
router.route('/:id')
  .put(protect, updateResource)  // Handles: PUT /api/resources/:id (PROTECTED)
  .delete(protect, deleteResource); // Handles: DELETE /api/resources/:id (PROTECTED)


// --- 2. /api/certifications Route ---
// This endpoint is public for the frontend to build the dropdown list.
router.route('/certifications') 
  .get(getAllCertifications); // Handles: GET /api/certifications (PUBLIC)


module.exports = router;