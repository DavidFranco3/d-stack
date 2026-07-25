import { Schema } from 'mongoose';

export function softDeletePlugin(schema: Schema) {
  const filterActive = function (this: any) {
    if (this.getFilter().status === undefined) {
      this.where({ status: 1 });
    }
  };

  schema.pre('find', filterActive);
  schema.pre('findOne', filterActive);
  schema.pre('findOneAndUpdate', filterActive);
  schema.pre('countDocuments', filterActive);

  schema.methods.softDelete = async function () {
    this.status = 0;
    return this.save();
  };

  schema.methods.restore = async function () {
    this.status = 1;
    return this.save();
  };
}
