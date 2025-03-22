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

// Connect to MongoDB
connectDB();

// Basic route
app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to CaisseManager API' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    // Serve static files from the React build directory
    app.use(express.static(path.join(__dirname, '../build')));

    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../build', 'index.html'));
    });
}

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
}); 