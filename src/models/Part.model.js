import mongoose from 'mongoose';

const partSchema = new mongoose.Schema({
  name: String,
  source: String,
  cost: Number,
  usedIn: { type: mongoose.Schema.Types.ObjectId, ref: 'Repair' },
  technician: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Part', partSchema);
