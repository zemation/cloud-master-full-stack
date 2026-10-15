// models/ChatUsageModel.js
//
// Daily token accounting for the study-guide chat. Used to enforce
// CHAT_DAILY_TOKEN_BUDGET so a burst of traffic (or abuse) can't
// produce a surprise model bill.

const mongoose = require('mongoose');

const chatUsageSchema = mongoose.Schema(
  {
    // YYYY-MM-DD (UTC)
    date: {
      type: String,
      required: true,
      unique: true,
      index: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'],
    },
    promptTokens: {
      type: Number,
      default: 0,
      min: 0,
    },
    completionTokens: {
      type: Number,
      default: 0,
      min: 0,
    },
    requests: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ChatUsage', chatUsageSchema);
