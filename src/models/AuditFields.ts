import mongoose from 'mongoose';

// Define the adminType schema
const AuditFields = new mongoose.Schema(
  {
    createdby: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    deletedAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: false,
  }
);

export { AuditFields };
