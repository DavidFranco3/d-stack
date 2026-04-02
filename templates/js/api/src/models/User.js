import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { softDeletePlugin } from '../plugins/softDelete.js';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
}, { timestamps: true });

UserSchema.plugin(softDeletePlugin);

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model('User', UserSchema);
