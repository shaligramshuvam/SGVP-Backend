import mongoose from 'mongoose';
import { AuditFields } from './AuditFields';

const RoleSchema = new mongoose.Schema(
  {
    roleName: { type: String, unique: true, require: true },
    isDeleted: { type: Boolean, default: false },
    auditField: AuditFields,
  },
  {
    timestamps: true,
  }
);

const Role = mongoose.model('Role', RoleSchema);
export { Role };
