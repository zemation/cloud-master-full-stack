// controllers/resourceController.js

const mongoose = require('mongoose');

// --- 1. Dependencies ---
// Assuming the model is correctly implemented as 'ResourceModel.js'
const Resource = require('../models/ResourceModel'); 
// Import the strict category/topic map for validation
const navMap = require('../config/navigationMap'); 


// @desc    Get all resources with optional filtering by category, topic, or certification
// @route   GET /api/resources?category=X&topic=Y
// @access  Public
const getResources = async (req, res, next) => {
  try {
    const { category, topic, certification } = req.query;
    let filter = {};

    // 1. Conditional Filtering based on query parameters
    if (category) {
      filter.category = category;
    }
    if (topic) {
      filter.topic = topic;
    }
    // Filter by certification presence (if query param is '?certification=true')
    if (certification === 'true') {
        // $ne: null and $ne: '' ensures we only pull resources with a defined certification name
        filter.certification = { $ne: null, $ne: '' };
    }

    // 2. Execute Query (Sorted by newest first)
    const resources = await Resource.find(filter).sort({ createdAt: -1 }); 

    res.status(200).json(resources);
  } catch (error) {
    // Pass error to the error handling middleware
    next(error);
  }
};


// @desc    Create a new resource
// @route   POST /api/resources
// @access  Admin (Will need future authentication)
const createResource = async (req, res, next) => {
  const { title, url, provider, category, topic } = req.body;
    
  // --- 1. Basic Required Field Validation ---
  if (!title || !url || !provider || !category || !topic) {
    res.status(400); // Bad Request
    return next(new Error('Missing required fields: title, URL, provider, category, and topic are mandatory.'));
  }

  // --- 2. Strict Category/Topic Validation using navigationMap ---
  // Check if the category exists in the map
  if (!navMap[category]) {
    res.status(400);
    return next(new Error(`Invalid Category: '${category}'. Must be one of the defined top-level sections.`));
  }
  // Check if the topic is allowed under the selected category
  if (!navMap[category].includes(topic)) {
    res.status(400);
    return next(new Error(`Invalid Topic: Topic '${topic}' is not allowed under Category '${category}'.`));
  }

  // --- 3. Create Resource ---
  try {
    const resource = await Resource.create(req.body);
    res.status(201).json(resource); // 201 Created
  } catch (error) {
    // Catch Mongoose validation errors (e.g., URL format, type mismatch)
    next(error); 
  }
};


// @desc    Update a resource by ID
// @route   PUT /api/resources/:id
// @access  Admin
const updateResource = async (req, res, next) => {
  const { id } = req.params;
  const { category, topic } = req.body;

  // Validate Mongoose ID format early
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    return next(new Error('Invalid Resource ID format.'));
  }

  // --- 4. Validation Check on Update (if category/topic are present) ---
  if (category && topic) {
      if (!navMap[category] || !navMap[category].includes(topic)) {
          res.status(400);
          return next(new Error(`Invalid Category/Topic combination provided for update.`));
      }
  }

  try {
    const resource = await Resource.findByIdAndUpdate(
      id,
      req.body,
      // { new: true } returns the updated document
      // { runValidators: true } ensures the update conforms to the schema
      { new: true, runValidators: true } 
    );

    if (!resource) {
      res.status(404);
      return next(new Error(`Resource with ID ${id} not found.`));
    }

    res.status(200).json(resource);
  } catch (error) {
    next(error);
  }
};


// @desc    Delete a resource by ID
// @route   DELETE /api/resources/:id
// @access  Admin
const deleteResource = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    return next(new Error('Invalid Resource ID format.'));
  }

  try {
    const resource = await Resource.findByIdAndDelete(id);

    if (!resource) {
      res.status(404);
      return next(new Error(`Resource with ID ${id} not found.`));
    }

    // Return the ID of the deleted item for confirmation
    res.status(200).json({ id: id, message: 'Resource successfully deleted.' });
  } catch (error) {
    next(error);
  }
};


// @desc    Get a unique list of all defined certification names
// @route   GET /api/certifications
// @access  Public
const getAllCertifications = async (req, res, next) => {
    try {
        const uniqueCertifications = await Resource.distinct('certification', {
            // Filter out null or empty strings
            certification: { $ne: null, $ne: '' }
        });

        res.status(200).json(uniqueCertifications.sort()); // Sort alphabetically for the frontend
    } catch (error) {
        next(error);
    }
};


module.exports = {
  getResources,
  createResource,
  updateResource,
  deleteResource,
  getAllCertifications
};