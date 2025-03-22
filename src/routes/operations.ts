import express from 'express';
import { protect } from '../middleware/auth';
import { Operation } from '../models/Operation';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();

type OperationType = 'income' | 'expense';

interface OperationStats {
    income: {
        total: number;
        count: number;
    };
    expense: {
        total: number;
        count: number;
    };
}

interface SummaryItem {
    _id: OperationType;
    total: number;
    count: number;
}

// Get all operations with filters
router.get('/', protect, async (req: AuthRequest, res) => {
    try {
        const {
            location,
            startDate,
            endDate,
            type,
            category,
            paymentMethod
        } = req.query;

        const query: any = {};

        // Apply filters
        if (location) query.location = location;
        if (type) query.type = type;
        if (category) query.category = category;
        if (paymentMethod) query.paymentMethod = paymentMethod;
        
        // Date range
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate as string);
            if (endDate) query.date.$lte = new Date(endDate as string);
        }

        const operations = await Operation.find(query)
            .populate('location', 'name')
            .populate('createdBy', 'name')
            .sort({ date: -1 });

        res.json(operations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching operations' });
    }
});

// Get single operation
router.get('/:id', protect, async (req: AuthRequest, res) => {
    try {
        const operation = await Operation.findById(req.params.id)
            .populate('location', 'name')
            .populate('createdBy', 'name');

        if (!operation) {
            return res.status(404).json({ message: 'Operation not found' });
        }

        res.json(operation);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching operation' });
    }
});

// Create operation
router.post('/', protect, async (req: AuthRequest, res) => {
    try {
        const {
            type,
            amount,
            description,
            category,
            location,
            date,
            paymentMethod,
            reference
        } = req.body;

        const operation = await Operation.create({
            type,
            amount,
            description,
            category,
            location,
            createdBy: req.user._id,
            date: date || new Date(),
            paymentMethod,
            reference
        });

        const populatedOperation = await Operation.findById(operation._id)
            .populate('location', 'name')
            .populate('createdBy', 'name');

        res.status(201).json(populatedOperation);
    } catch (error) {
        res.status(500).json({ message: 'Error creating operation' });
    }
});

// Update operation
router.put('/:id', protect, async (req: AuthRequest, res) => {
    try {
        const operation = await Operation.findById(req.params.id);

        if (!operation) {
            return res.status(404).json({ message: 'Operation not found' });
        }

        // Only creator or admin can update
        if (operation.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this operation' });
        }

        const updatedOperation = await Operation.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
            .populate('location', 'name')
            .populate('createdBy', 'name');

        res.json(updatedOperation);
    } catch (error) {
        res.status(500).json({ message: 'Error updating operation' });
    }
});

// Delete operation
router.delete('/:id', protect, async (req: AuthRequest, res) => {
    try {
        const operation = await Operation.findById(req.params.id);

        if (!operation) {
            return res.status(404).json({ message: 'Operation not found' });
        }

        // Only creator or admin can delete
        if (operation.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this operation' });
        }

        await operation.deleteOne();
        res.json({ message: 'Operation deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting operation' });
    }
});

// Get operations summary
router.get('/summary/stats', protect, async (req: AuthRequest, res) => {
    try {
        const { location, startDate, endDate } = req.query;

        const matchQuery: any = {};
        if (location) matchQuery.location = location;
        if (startDate || endDate) {
            matchQuery.date = {};
            if (startDate) matchQuery.date.$gte = new Date(startDate as string);
            if (endDate) matchQuery.date.$lte = new Date(endDate as string);
        }

        const summary = await Operation.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]) as SummaryItem[];

        const stats: OperationStats = {
            income: { total: 0, count: 0 },
            expense: { total: 0, count: 0 }
        };

        summary.forEach((item) => {
            if (item._id === 'income' || item._id === 'expense') {
                stats[item._id] = {
                    total: item.total,
                    count: item.count
                };
            }
        });

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching summary' });
    }
});

// Get operation statistics
router.get('/stats', protect, async (req: AuthRequest, res) => {
    try {
        const operations = await Operation.find({ createdBy: req.user._id });
        
        const stats: OperationStats = {
            income: { total: 0, count: 0 },
            expense: { total: 0, count: 0 }
        };

        operations.forEach(operation => {
            const type = operation.type as OperationType;
            if (type === 'income' || type === 'expense') {
                stats[type].total += operation.amount;
                stats[type].count += 1;
            }
        });

        res.json(stats);
    } catch (error) {
        console.error('Error getting operation stats:', error);
        res.status(500).json({ message: 'Error retrieving operation statistics' });
    }
});

export default router; 