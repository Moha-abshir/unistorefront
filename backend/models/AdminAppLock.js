import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminAppLockSchema = new mongoose.Schema(
  {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    pinHash: { type: String, required: true },
    isEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Hash PIN before saving
adminAppLockSchema.pre('save', async function (next) {
  if (!this.isModified('pinHash')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.pinHash = await bcrypt.hash(this.pinHash, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to verify PIN
adminAppLockSchema.methods.verifyPin = async function (pin) {
  return await bcrypt.compare(pin, this.pinHash);
};

const AdminAppLock = mongoose.model('AdminAppLock', adminAppLockSchema);
export default AdminAppLock;
