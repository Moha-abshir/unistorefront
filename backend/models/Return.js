// models/Return.js
import mongoose from "mongoose";

const returnSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    orderId: { type: String, required: true },
    productName: { type: String, required: true },
    reason: { type: String, required: true },
    additionalInfo: { type: String },
    status: { type: String, default: "Pending" }, // Admin can update
  },
  { timestamps: true }
);

export default mongoose.model("Return", returnSchema);
