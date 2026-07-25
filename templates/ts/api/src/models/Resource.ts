import mongoose, { Schema, Document } from 'mongoose';
import { softDeletePlugin } from '../plugins/softDelete.js';

export interface IResource extends Document {
  code: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  status: number; // 1 = Active, 0 = Soft Deleted
  date: string;
}

const ResourceSchema: Schema = new Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true, default: 'General' },
  price: { type: Number, required: true, default: 0 },
  currency: { type: String, required: true, default: 'USD' },
  status: { type: Number, required: true, default: 1 },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
}, { timestamps: true });

ResourceSchema.plugin(softDeletePlugin);

export const Resource = mongoose.model<IResource>('Resource', ResourceSchema);
