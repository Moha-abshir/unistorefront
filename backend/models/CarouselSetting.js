import mongoose from 'mongoose';

const carouselSettingSchema = new mongoose.Schema({
  productIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
  // percentage discount to apply to all carousel products (0-100)
  discountPercent: { type: Number, default: 10 },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const CarouselSetting = mongoose.models.CarouselSetting || mongoose.model('CarouselSetting', carouselSettingSchema);
export default CarouselSetting;
