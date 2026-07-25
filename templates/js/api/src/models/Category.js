import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  status: { type: Number, default: 1 },
}, { timestamps: true });

export const Category = mongoose.model('Category', CategorySchema);
