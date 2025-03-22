const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/caisse_manager';

async function testConnection() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected successfully!');

        // Create a test user
        const userSchema = new mongoose.Schema({
            name: String,
            email: String,
            password: String,
            role: String
        });
        const User = mongoose.model('User', userSchema);

        const user = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            role: 'admin'
        });
        console.log('Test user created:', user);

        // List all collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\nAvailable collections:', collections.map(c => c.name));

        console.log('\nTest completed successfully!');
    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

testConnection(); 