// controllers/resourceController.js

const mongoose = require('mongoose');
const Resource = require('../models/ResourceModel');
const { isValidCombination } = require('../config/navigationMap');

// @desc    Get all published resources (filtering, search, pagination)
// @route   GET /api/resources
// @access  Public
const getResources = async (req, res, next) => {
  try {
    const query = { status: 'published' };

    // Filtering
    if (req.query.category) query.category = req.query.category;
    if (req.query.topic) query.topic = req.query.topic;
    if (req.query.resourceType) query.resourceType = req.query.resourceType;
    if (req.query.difficulty) query.difficulty = req.query.difficulty;
    if (req.query.isFree) query.isFree = req.query.isFree === 'true';

    // Certification filter
    if (req.query.certification === 'true') {
      query.certification = { $ne: null, $ne: '' };
    } else if (req.query.certification && req.query.certification !== 'true') {
      query.certification = req.query.certification;
    }

    // Search
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Sorting
    const sortBy = req.query.sort === 'views' ? '-views' : '-createdAt';

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [resources, total] = await Promise.all([
      Resource.find(query)
        .populate('author', 'name')
        .sort(sortBy)
        .skip(skip)
        .limit(limit),
      Resource.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: resources.length,
      total,
      pages: Math.ceil(total / limit),
      page,
      data: resources
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single resource by ID or slug
// @route   GET /api/resources/:id
// @access  Public
const getResource = async (req, res, next) => {
  try {
    const { id } = req.params;

    const resource = await Resource.findOne(
      id.match(/^[0-9a-fA-F]{24}$/)
        ? { _id: id }
        : { slug: id }
    ).populate('author', 'name');

    if (!resource) {
      return res.status(404).json({
        success: false,
        error: 'Resource not found'
      });
    }

    res.status(200).json({
      success: true,
      data: resource
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get resources by category
// @route   GET /api/resources/category/:category
// @access  Public
const getResourcesByCategory = async (req, res, next) => {
  try {
    const resources = await Resource.find({
      category: req.params.category,
      status: 'published'
    })
      .populate('author', 'name')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: resources.length,
      data: resources
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get resources by topic
// @route   GET /api/resources/topic/:topic
// @access  Public
const getResourcesByTopic = async (req, res, next) => {
  try {
    const resources = await Resource.find({
      topic: req.params.topic,
      status: 'published'
    })
      .populate('author', 'name')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: resources.length,
      data: resources
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new resource
// @route   POST /api/resources
// @access  Admin
const createResource = async (req, res, next) => {
  try {
    // Whitelist allowed fields — never pass raw req.body to DB
    const {
      title,
      url,
      provider,
      category,
      topic,
      certification,
      resourceType,
      description,
      difficulty,
      isFree,
      status
    } = req.body;

    // Required field validation
    if (!title || !url || !provider || !category || !topic || !resourceType) {
      return res.status(400).json({
        success: false,
        error: 'Please provide title, url, provider, category, topic and resourceType'
      });
    }

    // Validate category/topic combination
    if (!isValidCombination(category, topic)) {
      return res.status(400).json({
        success: false,
        error: `'${topic}' is not a valid topic for category '${category}'`
      });
    }

    const resource = await Resource.create({
      title,
      url,
      provider,
      category,
      topic,
      certification,
      resourceType,
      description,
      difficulty,
      isFree,
      status,
      author: req.user.id
    });

    await resource.populate('author', 'name');

    res.status(201).json({
      success: true,
      data: resource
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a resource
// @route   PUT /api/resources/:id
// @access  Admin
const updateResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        error: 'Resource not found'
      });
    }

    // Whitelist allowed fields
    const {
      title,
      url,
      provider,
      category,
      topic,
      certification,
      resourceType,
      description,
      difficulty,
      isFree,
      status
    } = req.body;

    // Validate category/topic if either is being updated
    const newCategory = category || resource.category;
    const newTopic = topic || resource.topic;

    if (!isValidCombination(newCategory, newTopic)) {
      return res.status(400).json({
        success: false,
        error: `'${newTopic}' is not a valid topic for category '${newCategory}'`
      });
    }

    const updated = await Resource.findByIdAndUpdate(
      req.params.id,
      {
        title,
        url,
        provider,
        category,
        topic,
        certification,
        resourceType,
        description,
        difficulty,
        isFree,
        status
      },
      { new: true, runValidators: true }
    ).populate('author', 'name');

    res.status(200).json({
      success: true,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a resource
// @route   DELETE /api/resources/:id
// @access  Admin
const deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        error: 'Resource not found'
      });
    }

    await resource.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get unique list of all certifications
// @route   GET /api/resources/certifications
// @access  Public
const getAllCertifications = async (req, res, next) => {
  try {
    const certifications = await Resource.distinct('certification', {
      certification: { $ne: null, $ne: '' },
      status: 'published'
    });

    res.status(200).json({
      success: true,
      count: certifications.length,
      data: certifications.sort()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Increment resource view count
// @route   PUT /api/resources/:id/views
// @access  Public
const incrementViews = async (req, res, next) => {
  try {
    await Resource.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getResources,
  getResource,
  getResourcesByCategory,
  getResourcesByTopic,
  createResource,
  updateResource,
  deleteResource,
  getAllCertifications,
  incrementViews
};