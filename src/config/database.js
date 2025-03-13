import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fileupload';

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        logger.info('MongoDB connected');
    } catch (error) {
        logger.error('MongoDB connection error:', error);
        process.exit(1);
    }
};