import mongoose from 'mongoose';
import { AuditFields } from './AuditFields';
// Define the Module schema
const ModuleSchema = new mongoose.Schema(
  {
    moduleName: { type: String, required: true }, // Name of the module
    moduleKey: { type: String, require: true }, // For Languages Changes in frontend
    icon: { type: String, required: true },
    link: { type: String },
    isDeleted: { type: Boolean, default: false }, // Flag to mark if the module is deleted
    isSubModule: { type: Boolean, default: false },
    sequence: { type: Number },
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
    backendModuleName: { type: String },
    auditFields: AuditFields,
  },
  {
    timestamps: true,
  }
);

const Module = mongoose.model('Module', ModuleSchema);

export { Module };
