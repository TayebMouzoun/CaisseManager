import mongoose from 'mongoose';

export interface ILocation extends mongoose.Document {
    name: string;
    address: string;
    phone?: string;
    manager: mongoose.Types.ObjectId;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a location name'],
        trim: true,
    },
    address: {
        type: String,
        required: [true, 'Please provide an address'],
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true
});

export const Location = mongoose.model<ILocation>('Location', locationSchema); 