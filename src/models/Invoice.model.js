import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  date: Date,
  technician: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  shopProfit: Number,
  techProfit: Number,
  totalRepairPrice: Number,
  totalPartsCost: Number
});

export default mongoose.model('Invoice', invoiceSchema);
