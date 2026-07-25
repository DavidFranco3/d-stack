import mongoose, { Schema, Document } from 'mongoose';

export interface ISetting extends Document {
  key: string;
  value: string;
  description: string;
}

const SettingSchema: Schema = new Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
  description: { type: String, default: '' },
}, { timestamps: true });

export const Setting = mongoose.model<ISetting>('Setting', SettingSchema);
