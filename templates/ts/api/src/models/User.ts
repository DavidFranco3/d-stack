import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { softDeletePlugin } from '../plugins/softDelete.js';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: string;
  status: number; // 1 = Active, 0 = Soft Deleted
  isDeleted: boolean;
  deletedAt?: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'User' },
  status: { type: Number, default: 1 },
}, { timestamps: true });

UserSchema.plugin(softDeletePlugin);

UserSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err: any) {
    return next(err);
  }
});

UserSchema.methods.comparePassword = function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
