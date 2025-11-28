import mongoose from "mongoose";

const returnSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    orderId: { type: String, required: true },
    productName: { type: String, required: true },
    reason: { type: String, required: true },
    additionalInfo: { type: String },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  },
  { timestamps: true }
);


const ReturnRequest = mongoose.model("Return", returnSchema);
export default ReturnRequest;
