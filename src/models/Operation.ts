import mongoose from 'mongoose';

export interface IOperation extends mongoose.Document {
    type: 'income' | 'expense';
    amount: number;
    description: string;
    category: string;
    location: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    date: Date;
    paymentMethod: 'cash' | 'card' | 'transfer' | 'other';
    reference?: string;
    createdAt: Date;
    updatedAt: Date;
}

const operationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: [true, 'Please specify operation type'],
    },
    amount: {
        type: Number,
        required: [true, 'Please specify amount'],
        min: [0, 'Amount cannot be negative'],
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        trim: true,
    },
    category: {
        type: String,
        required: [true, 'Please specify a category'],
        trim: true,
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'transfer', 'other'],
        required: true,
    },
    reference: {
        type: String,
        trim: true,
    }
}, {
    timestamps: true
});

// Add index for better query performance
operationSchema.index({ location: 1, date: -1 });
operationSchema.index({ createdBy: 1, date: -1 });

export const Operation = mongoose.model<IOperation>('Operation', operationSchema); 