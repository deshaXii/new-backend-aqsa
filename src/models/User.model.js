import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'technician'], default: 'technician' },
  permissions: {
    addRepair: { type: Boolean, default: false },
    editRepair: { type: Boolean, default: false },
    deleteRepair: { type: Boolean, default: false },
    receiveDevice: { type: Boolean, default: false }
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
