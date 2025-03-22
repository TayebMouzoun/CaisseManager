const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

// Define schemas
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String
});

const locationSchema = new mongoose.Schema({
    name: String,
    address: String,
    phone: String,
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true }
});

const operationSchema = new mongoose.Schema({
    type: String,
    amount: Number,
    description: String,
    category: String,
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now },
    paymentMethod: String
});

// Create models
const User = mongoose.model('User', userSchema);
const Location = mongoose.model('Location', locationSchema);
const Operation = mongoose.model('Operation', operationSchema);

async function testDatabase() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected successfully!');

        // Create test user
        const user = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            role: 'admin'
        });
        console.log('Test user created:', user);

        // Create test location
        const location = await Location.create({
            name: 'Test Location',
            address: '123 Test St',
            phone: '123-456-7890',
            manager: user._id
        });
        console.log('Test location created:', location);

        // Create test operation
        const operation = await Operation.create({
            type: 'income',
            amount: 1000,
            description: 'Test income',
            category: 'Sales',
            location: location._id,
            createdBy: user._id,
            paymentMethod: 'cash'
        });
        console.log('Test operation created:', operation);

        // List collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\nAvailable collections:', collections.map(c => c.name));

        // Count documents
        const userCount = await User.countDocuments();
        const locationCount = await Location.countDocuments();
        const operationCount = await Operation.countDocuments();

        console.log('\nDocument counts:');
        console.log('Users:', userCount);
        console.log('Locations:', locationCount);
        console.log('Operations:', operationCount);

    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

testDatabase(); 