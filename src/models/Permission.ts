import mongoose from 'mongoose';

// Define the Permission schema
const PermissionSchema = new mongoose.Schema(
  {
    read: { type: Boolean, default: true },
    write: { type: Boolean, default: false },
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      required: true,
    }, // Reference to module
  },
  {
    timestamps: true,
  }
);

const Permission = mongoose.model('Permission', PermissionSchema);

export { Permission };
