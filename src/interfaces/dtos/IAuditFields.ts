import type mongoose from 'mongoose';

export interface IAuditFields {
  createdby?: string | mongoose.Types.ObjectId;
  updatedBy?: string | mongoose.Types.ObjectId;
  deletedBy?: string | mongoose.Types.ObjectId;
  deletedAt?: Date;
}
