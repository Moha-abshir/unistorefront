// utils/getNextOrderId.js
import Counter from '../models/Counter.js';

export default async function getNextOrderId() {
  const counter = await Counter.findByIdAndUpdate(
    { _id: 'orderId' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const seqNumber = counter.seq;
  // Format with leading zeros, e.g., M01, M02, M10, M100
  const orderId = `M${seqNumber.toString().padStart(2, '0')}`;
  return orderId;
}