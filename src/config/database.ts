import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/caisse_manager';

export const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('MongoDB URI:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//<credentials>@')); // Hide credentials in logs
        
        const conn = await mongoose.connect(MONGODB_URI);
        
        console.log('MongoDB connected successfully');
        console.log('Connected to database:', conn.connection.name);

        // Only try to list collections if we have a connection
        if (conn.connection.db) {
            const collections = await conn.connection.db.listCollections().toArray();
            console.log('Collections:', collections.map(col => col.name));
        }
        
        // Set up event listeners
        conn.connection.on('error', err => {
            console.error('MongoDB connection error:', err);
        });

        conn.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('MongoDB disconnected successfully');
    } catch (error) {
        console.error('MongoDB disconnection error:', error);
    }
}; 