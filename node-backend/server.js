// server.js

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const client = require('prom-client');

const { errorHandler } = require('./middleware/errorHandler');
const resourceRoutes = require('./routes/resourceRoutes');
const userRoutes = require('./routes/userRoutes');

// Prometheus metrics setup
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ prefix: 'cloudmaster_' });

const httpRequestDuration = new client.Histogram({
    name: 'cloudmaster_http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5]
});

const httpRequestTotal = new client.Counter({
    name: 'cloudmaster_http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
});

const app = express();

app.set('trust proxy', 1);

const PORT = process.env.PORT || 5500;
const MONGO_URI = process.env.MONGO_URI;

// Handle unhandled rejections/exceptions early
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err.message);
    process.exit(1);
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message);
    process.exit(1);
});

// Security headers
app.use(helmet());

// CORS
const allowedOrigins = [
    'https://cloud-master.io',
    'https://www.cloud-master.io',
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            if (process.env.NODE_ENV !== 'production') {
                console.log('CORS rejected origin:', origin);
            }
            callback(new Error('Not allowed by CORS policy.'));
        }
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 200,
    maxAge: 86400
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, error: 'Too many requests, please try again later.' }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { success: false, error: 'Too many auth attempts, please try again later.' }
});

app.use('/', limiter);
app.use('/users', authLimiter);

// Prometheus metrics middleware — exclude internal routes
app.use((req, res, next) => {
    if (req.path === '/metrics' || req.path === '/health' || req.path === '/favicon.ico') {
        return next();
    }
    const end = httpRequestDuration.startTimer();
    res.on('finish', () => {
        const route = req.route ? req.baseUrl + req.route.path : req.path;
        end({ method: req.method, route, status_code: res.statusCode });
        httpRequestTotal.inc({ method: req.method, route, status_code: res.statusCode });
    });
    next();
});

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));

// Metrics endpoint
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Suppress favicon requests
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Routes
app.use('/resources', resourceRoutes);
app.use('/users', userRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

// MongoDB connection
const connectDB = async () => {
    try {
        if (!MONGO_URI) {
            console.error('FATAL: MONGO_URI is not defined in .env file.');
            process.exit(1);
        }

        const conn = await mongoose.connect(MONGO_URI);

        if (process.env.NODE_ENV !== 'production') {
            console.log(`MongoDB Connected: ${conn.connection.host}`);
        } else {
            console.log('MongoDB Connected');
        }

        mongoose.connection.on('disconnected', () => {
            console.error('MongoDB disconnected');
        });

        mongoose.connection.on('error', (err) => {
            console.error(`MongoDB error: ${err.message}`);
        });

    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

connectDB().then(() => {
    app.listen(PORT, () =>
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
    );
}).catch(() => {
    console.error('Failed to start server due to database connection error.');
});