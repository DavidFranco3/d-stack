import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description: string;
  status: number;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  status: { type: Number, default: 1 },
}, { timestamps: true });

export const Category = mongoose.model<ICategory>('Category', CategorySchema);
