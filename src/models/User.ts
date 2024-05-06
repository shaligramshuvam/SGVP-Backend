import mongoose from 'mongoose';
import { hashPassword } from '@utils';
import { AuditFields } from './AuditFields';

// Define the user schema using Mongoose.
const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hash: { type: String, default: null },
    gender: { type: String, enum: ['male', 'female', 'boy', 'girl', 'other'] },
    birthDate: { type: Date },
    isDeleted: { type: Boolean, default: false },
    auditFields: AuditFields,
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  }
);

UserSchema.pre('save', async function (next) {
  if (typeof this.hash !== 'undefined' && this.hash !== '') {
    if (!this.isModified('hash')) {
      next();
    }
    const hashAdminPassword = await hashPassword(this.hash);
    this.hash = hashAdminPassword;
    next();
  } else {
    next();
  }
});

const User = mongoose.model('User', UserSchema);
export { User };
