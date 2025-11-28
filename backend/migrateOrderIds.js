// Script to migrate existing orders to have orderId in M* format
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './models/Order.js';

dotenv.config();

async function migrateOrderIds() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const orders = await Order.find({ orderId: { $exists: false } }).sort({ createdAt: 1 });
  let nextNumber = 1;
  for (const order of orders) {
    order.orderId = `M${nextNumber.toString().padStart(2, '0')}`;
    await order.save();
    nextNumber++;
    console.log(`Updated order ${order._id} to ${order.orderId}`);
  }
  console.log('Migration complete.');
  mongoose.disconnect();
}

migrateOrderIds();
