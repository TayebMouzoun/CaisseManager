import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/caisse_manager';

export const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        // Hide credentials in logs
        const sanitizedUri = MONGODB_URI.replace(
            /mongodb(\+srv)?:\/\/[^:]+:[^@]+@/,
            'mongodb$1://<username>:<password>@'
        );
        console.log('MongoDB URI:', sanitizedUri);
        
        const conn = await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s
        });
        
        console.log('MongoDB connected successfully');
        console.log('Connected to database:', conn.connection.name);
        console.log('MongoDB version:', conn.version);

        // Only try to list collections if we have a connection
        if (conn.connection.db) {
            const collections = await conn.connection.db.listCollections().toArray();
            console.log('Available collections:', collections.map(col => col.name));
        }
        
        // Set up event listeners
        conn.connection.on('error', err => {
            console.error('MongoDB connection error:', err);
        });

        conn.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        conn.connection.on('reconnected', () => {
            console.log('MongoDB reconnected');
        });

    } catch (error: any) {
        console.error('MongoDB connection error:', {
            message: error.message,
            code: error.code,
            codeName: error.codeName,
            name: error.name,
            stack: error.stack
        });
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