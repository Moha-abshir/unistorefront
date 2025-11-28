import express from 'express';
const router = express.Router();
import Deal from '../models/Deal.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// Create a deal (admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, discountType, discountValue, startDate, endDate } = req.body;
    if (!title || !discountType || typeof discountValue === 'undefined' || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required fields: title, discountType, discountValue, startDate, endDate' });
    }
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (isNaN(s) || isNaN(e) || s > e) {
      return res.status(400).json({ error: 'Invalid startDate/endDate' });
    }

    const deal = new Deal(req.body);
    await deal.save();
    res.status(201).json(deal);
  } catch (err) {
    console.error('Error creating deal:', err);
    res.status(400).json({ error: err.message });
  }
});

// List all deals (including inactive)
router.get('/', async (req, res) => {
  try {
    const deals = await Deal.find({});
    res.json(deals);
  } catch (err) {
    console.error('Error listing deals:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /deals/active - only currently active deals (MUST come before /:id)
router.get('/active', async (req, res) => {
  try {
    const deals = await Deal.find({ active: true });
    const activeDeals = deals.filter(d => d.isActive());
    res.json(activeDeals);
  } catch (err) {
    console.error('Error fetching active deals:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get a single deal
router.get('/:id', async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
    if (!deal) return res.status(404).json({ error: 'Deal not found' });
    res.json(deal);
  } catch (err) {
    console.error('Error fetching deal:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update a deal (admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    if (startDate || endDate) {
      const s = startDate ? new Date(startDate) : null;
      const e = endDate ? new Date(endDate) : null;
      if ((s && isNaN(s)) || (e && isNaN(e)) || (s && e && s > e)) {
        return res.status(400).json({ error: 'Invalid startDate/endDate' });
      }
    }
    const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!deal) return res.status(404).json({ error: 'Deal not found' });
    res.json(deal);
  } catch (err) {
    console.error('Error updating deal:', err);
    res.status(400).json({ error: err.message });
  }
});

// Delete a deal (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const deal = await Deal.findByIdAndDelete(req.params.id);
    if (!deal) return res.status(404).json({ error: 'Deal not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting deal:', err);
    res.status(500).json({ error: err.message });
  }
});


export default router;
