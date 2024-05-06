import mongoose from 'mongoose';

const EmailTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  jwtToken: { type: String },
  verified: { type: Boolean, default: false },
  expiresAt: {
    type: Date,
    default: () => new Date().setMinutes(new Date().getMinutes() + 10),
  }, // Default to 40 mins from now
  isDeleted: { type: Boolean, default: false },
});
const EmailToken = mongoose.model('emailtokens', EmailTokenSchema);

export { EmailToken };
