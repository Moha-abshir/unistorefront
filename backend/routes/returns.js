
import express from "express";
import ReturnRequest from "../models/returnModel.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Submit a return request
// @route   POST /api/returns
// @access  Public (customers)
router.post("/", async (req, res) => {
  try {
    const { name, email, orderId, productName, reason, additionalInfo } = req.body;
    if (!name || !email || !orderId || !productName || !reason) {
      return res.status(400).json({ message: "All fields except additional info are required" });
    }
    const returnRequest = new ReturnRequest({
      name,
      email,
      orderId,
      productName,
      reason,
      additionalInfo,
      status: "Pending"
    });
    await returnRequest.save();
    res.status(201).json({ message: "Return request submitted successfully" });
  } catch (error) {
    console.error("Error submitting return request:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// @desc    Get all return requests (for admin)
// @route   GET /api/returns
// @access  Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const requests = await ReturnRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error("Error fetching return requests:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Get status of a return request by email and orderId (public)
// @route   GET /api/returns/status?email=...&orderId=...
// @access  Public
router.get("/status", async (req, res) => {
  try {
    const { email, orderId } = req.query;
    if (!email || !orderId) {
      return res.status(400).json({ message: "Email and Order ID are required" });
    }
    const request = await ReturnRequest.findOne({
      email: email.trim().toLowerCase(),
      orderId: orderId.trim()
    });
    if (!request) {
      return res.status(404).json({ message: "No return request found for this email and order ID." });
    }
    res.json(request);
  } catch (error) {
    console.error("Error fetching return status:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// @desc    Update return request status (admin)
// @route   PATCH /api/returns/:id
// @access  Admin
router.patch('/:id', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    const updated = await ReturnRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Return request not found' });
    }
    res.json(updated);
  } catch (error) {
    console.error('Error updating return status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
