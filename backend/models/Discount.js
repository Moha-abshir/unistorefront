import mongoose from 'mongoose';

const DiscountSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  discountType: { type: String, enum: ['percent', 'fixed'], required: true },
  amount: { type: Number, required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
  startsAt: { type: Date, default: Date.now },
  endsAt: { type: Date },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Discount', DiscountSchema);
