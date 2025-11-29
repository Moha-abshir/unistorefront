import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
});

const shippingSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  county: { type: String },
  postalCode: { type: String },
  notes: { type: String },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [orderItemSchema],
    shippingAddress: shippingSchema,
    paymentMethod: { type: String, required: true },
    totalPrice: { type: Number, required: true },

    // ✅ Discount & Coupon Support
    discountType: { type: String, enum: ['percent', 'fixed'], default: null },
    discountValue: { type: Number, default: 0 },
    couponCode: { type: String, default: null },
    finalAmount: { type: Number, required: true },

    // ✅ Status & Delivery
    status: {
      type: String,
      default: 'Pending',
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    },
    paymentStatus: {
      type: String,
      default: 'Unpaid',
      enum: ['Unpaid', 'Paid'],
    },
    deliveryAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    deliveryStatus: {
      type: String,
      enum: ['Assigned', 'In Transit', 'Delivered'],
      default: 'Assigned',
    },
    reminders: [
      {
        message: { type: String },
        sentAt: { type: Date, default: Date.now },
        read: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

// ✅ Auto-generate orderId like M001, M002, etc.
orderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    const lastOrder = await mongoose.models.Order.findOne({}, {}, { sort: { createdAt: -1 } });
    let nextNumber = 1;
    if (lastOrder && lastOrder.orderId) {
      const match = lastOrder.orderId.match(/M(\d+)/);
      if (match) nextNumber = parseInt(match[1], 10) + 1;
    }
    this.orderId = `M${nextNumber.toString().padStart(3, '0')}`;
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
