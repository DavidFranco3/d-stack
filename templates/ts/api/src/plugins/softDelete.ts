import { Schema, Query, Document } from 'mongoose';

export function softDeletePlugin(schema: Schema) {
  schema.add({
    deletedAt: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false }
  });

  const filterNonDeleted = function(this: any) {
    if (this.getFilter().isDeleted === undefined) {
      this.where({ isDeleted: false });
    }
  };

  schema.pre('find', filterNonDeleted);
  schema.pre('findOne', filterNonDeleted);
  schema.pre('findOneAndUpdate', filterNonDeleted);
  schema.pre('countDocuments', filterNonDeleted);

  schema.methods.softDelete = async function() {
    this.isDeleted = true;
    this.deletedAt = new Date();
    return this.save();
  };

  schema.methods.restore = async function() {
    this.isDeleted = false;
    this.deletedAt = null;
    return this.save();
  };
}
