import mongoose from 'mongoose';

const carouselSettingSchema = new mongoose.Schema({
  productIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const CarouselSetting = mongoose.models.CarouselSetting || mongoose.model('CarouselSetting', carouselSettingSchema);
export default CarouselSetting;
