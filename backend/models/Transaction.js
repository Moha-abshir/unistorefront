import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mpesaReceiptNumber: { type: String, unique: true },
  phoneNumber: { type: String },
  amount: { type: Number },
  status: { type: String }, // e.g. 'Success', 'Failed'
  rawResponse: { type: Object },
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;