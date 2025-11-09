// routes/resourceRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // For protected routes

// Import the controller functions 
const {
  getResources,
  createResource,
  updateResource,
  deleteResource,
  getAllCertifications,
} = require('../controllers/resourceController'); 

// --- MongoDB ID Pattern ---
const mongoIdPattern = '[0-9a-fA-F]{24}';


// --- 1. Collection Routes (/api/resources) ---
router.route('/')
  .get(getResources)   // PUBLIC (Get all/filtered)
  .post(protect, createResource); // PROTECTED (Add new resource)


// --- 2. Dynamic ID Routes (/api/resources/:id) ---
// CRITICAL FIX: The GET route MUST be explicitly defined here to resolve the 404.
router.route(`/:id(${mongoIdPattern})`)
  .get(getResources)   // PUBLIC (Get single resource by ID)
  .put(protect, updateResource)   // PROTECTED (Update resource)
  .delete(protect, deleteResource); // PROTECTED (Delete resource)


// --- 3. Custom Routes ---
router.route('/certifications') 
  .get(getAllCertifications); 


module.exports = router;