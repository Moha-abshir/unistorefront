import Category from '../models/Category.js';

export const getAdminCategories = async (req, res) => {
  try {
    const cats = await Category.find().sort({ name: 1 });
    res.json(cats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: 'Category name is required' });
    const existing = await Category.findOne({ name: name.trim() });
    if (existing) return res.status(409).json({ message: 'Category already exists' });
    const c = new Category({ name: name.trim() });
    await c.save();
    res.status(201).json(c);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Category not found' });
    await cat.deleteOne();
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};
