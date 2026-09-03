import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dstack-db';

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('📦 MongoDB Connected successfully');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  }
};