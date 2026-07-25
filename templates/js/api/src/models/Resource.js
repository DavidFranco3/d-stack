import mongoose from 'mongoose';
import { softDeletePlugin } from '../plugins/softDelete.js';

const ResourceSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true, default: 'General' },
  price: { type: Number, required: true, default: 0 },
  currency: { type: String, required: true, default: 'USD' },
  status: { type: Number, required: true, default: 1 },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
}, { timestamps: true });

ResourceSchema.plugin(softDeletePlugin);

export const Resource = mongoose.model('Resource', ResourceSchema);
