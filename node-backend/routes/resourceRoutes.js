// routes/resourceRoutes.js

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

const {
  getResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
  getAllCertifications,
  getResourcesByCategory,
  getResourcesByTopic,
  incrementViews
} = require('../controllers/resourceController');

// IMPORTANT: Static/specific routes must come before dynamic /:id routes

// --- Static routes ---
router.get('/certifications', getAllCertifications);
router.get('/category/:category', getResourcesByCategory);
router.get('/topic/:topic', getResourcesByTopic);

// --- Collection routes ---
router.route('/')
  .get(getResources)
  .post(protect, authorize('admin'), createResource);

// --- Single resource routes ---
router.route('/:id([0-9a-fA-F]{24})')
  .get(getResource)
  .put(protect, authorize('admin'), updateResource)
  .delete(protect, authorize('admin'), deleteResource);

// --- View tracking ---
router.put('/:id([0-9a-fA-F]{24})/views', incrementViews);

module.exports = router;