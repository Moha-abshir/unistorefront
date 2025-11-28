import mongoose from 'mongoose';
const { Schema } = mongoose;

const dealSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  discountType: { type: String, enum: ['percent', 'flat'], required: true },
  discountValue: { type: Number, required: true },
  productIds: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  category: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  active: { type: Boolean, default: true },
  bannerImage: { type: String },
  createdAt: { type: Date, default: Date.now }
});

dealSchema.methods.isActive = function() {
  const now = new Date();
  return this.active && now >= this.startDate && now <= this.endDate;
};

export default mongoose.model('Deal', dealSchema);
