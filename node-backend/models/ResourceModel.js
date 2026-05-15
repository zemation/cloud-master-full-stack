// models/ResourceModel.js

const mongoose = require('mongoose');
const crypto = require('crypto');
const { isValidCombination } = require('../config/navigationMap');

const resourceSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters']
    },
    slug: {
      type: String,
      unique: true,
      index: true
    },
    url: {
      type: String,
      required: [true, 'Please add a URL'],
      trim: true,
      match: [/^https?:\/\/.+/, 'Please add a valid URL']
    },
    provider: {
      type: String,
      required: [true, 'Please add a provider'],
      trim: true,
      maxlength: [100, 'Provider cannot be more than 100 characters']
      // e.g. 'Udemy', 'A Cloud Guru', 'Linux Foundation'
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot be more than 1000 characters']
    },

    // Navigation — validated against navigationMap
    category: {
      type: String,
      required: [true, 'Please add a category'],
      trim: true,
      index: true
    },
    topic: {
      type: String,
      required: [true, 'Please add a topic'],
      trim: true,
      index: true
    },

    // Optional certification this resource prepares for
    certification: {
      type: String,
      trim: true
      // e.g. 'AWS Solutions Architect', 'CKA', 'AZ-900'
    },

    resourceType: {
      type: String,
      enum: ['course', 'documentation', 'practice-exam', 'study-guide', 'video', 'book', 'tool'],
      required: [true, 'Please add a resource type']
    },

    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },

    isFree: {
      type: Boolean,
      default: true
    },

    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
      index: true
    },

    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },

    views: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Generate slug and validate category/topic before saving
resourceSchema.pre('save', function (next) {
  // Generate slug from title
  if (this.isModified('title')) {
    const base = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    this.slug = `${base}-${this._id.toString().slice(-6)}`;
  }

  // Validate category/topic combination against navigationMap
  if (this.isModified('category') || this.isModified('topic')) {
    if (!isValidCombination(this.category, this.topic)) {
      return next(new Error(`'${this.topic}' is not a valid topic for category '${this.category}'`));
    }
  }

  next();
});

// Compound indexes for common query patterns
resourceSchema.index({ category: 1, topic: 1 });
resourceSchema.index({ status: 1, createdAt: -1 });
resourceSchema.index({ certification: 1 });

module.exports = mongoose.model('Resource', resourceSchema);