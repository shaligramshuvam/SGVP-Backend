import mongoose from 'mongoose';
import { AuditFields } from './AuditFields';

const VendorSchema = new mongoose.Schema(
  {
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    bussinessName: { type: String, require: true },
    contactNumber: { type: Number, require: true },
    contactPersonFirstName: { type: String },
    contactPersonLastName: { type: String },
    contactPersonNumber: { type: Number },
    alreadyHadDeal: { type: Boolean, default: false },
    bussinessEmail: { type: String, require: true, unique: true },
    vendorImg: { type: String },
    vendorType: { type: String },
    isDeleted: { type: Boolean, default: false },
    auditField: AuditFields,
  },
  { timestamps: true }
);

const Vendor = mongoose.model('Vendor', VendorSchema);
export { Vendor };
