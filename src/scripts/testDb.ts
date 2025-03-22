import { connectDB, disconnectDB } from '../config/database';
import { User } from '../models/User';
import { Location } from '../models/Location';
import { Operation } from '../models/Operation';

async function testDatabase() {
    try {
        // Connect to database
        await connectDB();

        console.log('Creating test data...');

        // Create test user
        const user = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            role: 'admin'
        });
        console.log('Test user created with ID:', user._id);

        // Create test location
        const location = await Location.create({
            name: 'Test Location',
            address: '123 Test St',
            phone: '123-456-7890',
            manager: user._id
        });
        console.log('Test location created with ID:', location._id);

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
        console.log('Test operation created with ID:', operation._id);

        // Count documents
        const userCount = await User.countDocuments();
        const locationCount = await Location.countDocuments();
        const operationCount = await Operation.countDocuments();

        console.log('\nDocument counts:');
        console.log('Users:', userCount);
        console.log('Locations:', locationCount);
        console.log('Operations:', operationCount);

        console.log('\nTest data created successfully!');
    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        await disconnectDB();
    }
}

testDatabase(); 