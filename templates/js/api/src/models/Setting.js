import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
  description: { type: String, default: '' },
}, { timestamps: true });

export const Setting = mongoose.model('Setting', SettingSchema);
