import express from 'express';
import cors from 'cors';
import path from 'path';
import { connectDB } from './config/database';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Connect to MongoDB
connectDB();

// API routes
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to CaisseManager API' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    console.log('Running in production mode');
    
    // Serve static files from the React build directory
    const buildPath = path.resolve(__dirname, '../build');
    console.log('Build path:', buildPath);
    
    app.use(express.static(buildPath));

    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
        console.log('Serving index.html for path:', req.path);
        res.sendFile(path.join(buildPath, 'index.html'));
    });
} else {
    console.log('Running in development mode');
}

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Current directory: ${__dirname}`);
}); 