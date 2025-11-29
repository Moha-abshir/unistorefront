import mongoose from 'mongoose';

const shippingFeeSchema = new mongoose.Schema({
  amount: { type: Number, required: true, min: 0, default: 0 },
  description: { type: String, default: 'Standard Shipping Fee' }
}, { timestamps: true });

const ShippingFee = mongoose.model('ShippingFee', shippingFeeSchema);
export default ShippingFee;
