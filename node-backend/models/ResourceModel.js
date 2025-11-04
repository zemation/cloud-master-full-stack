// models/ResourceModel.js

// ⬅️ THIS LINE IS MISSING AND MUST BE ADDED ⬅️
const mongoose = require('mongoose'); 

const resourceSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    provider: { type: String, required: true },
    
    category: { type: String, required: true }, 
    topic: { type: String, required: true },    
    
    certification: { type: String, required: false }, 
    resourceType: { type: String, required: false },  
    description: { type: String, required: false },   
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Resource', resourceSchema);