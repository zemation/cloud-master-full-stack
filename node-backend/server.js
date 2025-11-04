// server.js

// CORE DEPENDENCIES
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config(); 
const cors = require('cors'); 

// CONFIGURATIONS & MIDDLEWARE
const { errorHandler } = require('./middleware/errorHandler'); 

// --- ROUTERS ---
const resourceRoutes = require('./routes/resourceRoutes'); 
const userRoutes = require('./routes/userRoutes');       

const app = express();
const PORT = process.env.PORT || 5500; 
const MONGO_URI = process.env.MONGO_URI;

// --- Middlewares ---

// ⬅️ CRITICAL FIX: FINAL ROBUST CORS CONFIGURATION USING A FUNCTION ⬅️
// This allows requests from your deployed frontend domain and handles variations in port/protocol.
const allowedDomains = ['cloud-master.io']; 
const corsOptions = {
    // Custom origin function checks if the origin includes the allowed domain and uses HTTPS
    origin: (origin, callback) => {
        // If the origin is missing (internal server or curl), allow it.
        if (!origin) return callback(null, true);
        
        // Check if the origin matches the allowed domains and uses HTTPS
        if (allowedDomains.some(domain => origin.includes(domain) && origin.startsWith('https://'))) {
            callback(null, true);
        } else {
            // Reject all other requests
            console.log('CORS rejected origin:', origin);
            callback(new Error('Not allowed by CORS policy.'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 200, // For preflight requests
    maxAge: 86400 // Cache preflight response for 24 hours
};

app.use(cors(corsOptions));

// Explicitly handle OPTIONS method for preflight requests (mandatory for robust CORS)
app.options('*', cors(corsOptions)); 
// ----------------------------------------

// Allows the app to handle JSON data from POST/PUT requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- API Routes ---
// 1. Resource Management Routes (CRUD)
app.use('/api/resources', resourceRoutes);
// 2. Certification Listing Route 
app.use('/api/certifications', resourceRoutes); 
// 3. User Authentication Routes (Login/Register Admin)
app.use('/api/users', userRoutes); 


// --- ERROR HANDLING MIDDLEWARE ---
app.use(errorHandler);


// --- MongoDB Connection Logic ---
const connectDB = async () => {
  try {
    if (!MONGO_URI) {
        console.error("FATAL: MONGO_URI is not defined in .env file.");
        process.exit(1);
    }
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

// Start the database connection and then start the Express server
connectDB().then(() => {
    app.listen(PORT, () => 
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
    );
}).catch(error => {
    console.error("Failed to start server due to database connection error.");
});