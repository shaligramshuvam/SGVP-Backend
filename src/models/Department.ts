import mongoose from 'mongoose';
import { AuditFields } from './AuditFields';

const DepartmentSchemna = new mongoose.Schema(
  {
    departmentName: {
      type: 'string',
      required: true,
      unique: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    auditField: AuditFields,
  },
  {
    timestamps: true,
  }
);

const Department = mongoose.model('Department', DepartmentSchemna);
export { Department };
