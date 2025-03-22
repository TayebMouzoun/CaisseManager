import express from 'express';
import { protect } from '../middleware/auth';
import { Location } from '../models/Location';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all locations
router.get('/', protect, async (req: AuthRequest, res) => {
    try {
        const locations = await Location.find()
            .populate('manager', 'name email')
            .sort({ createdAt: -1 });
        res.json(locations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching locations' });
    }
});

// Get single location
router.get('/:id', protect, async (req: AuthRequest, res) => {
    try {
        const location = await Location.findById(req.params.id)
            .populate('manager', 'name email');
        
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }
        
        res.json(location);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching location' });
    }
});

// Create location
router.post('/', protect, async (req: AuthRequest, res) => {
    try {
        const { name, address, phone } = req.body;
        
        const location = await Location.create({
            name,
            address,
            phone,
            manager: req.user._id
        });

        res.status(201).json(location);
    } catch (error) {
        res.status(500).json({ message: 'Error creating location' });
    }
});

// Update location
router.put('/:id', protect, async (req: AuthRequest, res) => {
    try {
        const { name, address, phone, isActive } = req.body;
        
        const location = await Location.findById(req.params.id);
        
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }

        // Only manager or admin can update
        if (location.manager.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this location' });
        }

        const updatedLocation = await Location.findByIdAndUpdate(
            req.params.id,
            { name, address, phone, isActive },
            { new: true, runValidators: true }
        ).populate('manager', 'name email');

        res.json(updatedLocation);
    } catch (error) {
        res.status(500).json({ message: 'Error updating location' });
    }
});

// Delete location
router.delete('/:id', protect, async (req: AuthRequest, res) => {
    try {
        const location = await Location.findById(req.params.id);
        
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }

        // Only manager or admin can delete
        if (location.manager.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this location' });
        }

        await location.deleteOne();
        res.json({ message: 'Location deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting location' });
    }
});

export default router; 