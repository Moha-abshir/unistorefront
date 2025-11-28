import Product from '../models/product.js';
import cloudinary from '../config/cloudinary.js';

// List products (with optional search and category filter)


export const getLatestProduct = async (req, res) => {
  try {
    const latestProduct = await Product.findOne().sort({ createdAt: -1 }); // latest by date
    if (!latestProduct) {
      return res.status(404).json({ message: "No products found" });
    }
    res.json(latestProduct);
  } catch (error) {
    console.error("Error fetching latest product:", error);
    res.status(500).json({ message: "Server error" });
  }
};





export const getProducts = async (req, res) => {
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: 'i' } }
    : {};
  const category = req.query.category ? { category: req.query.category } : {};

  try {
    let query = Product.find({ ...keyword, ...category });

    // Handle sort parameter (default: -createdAt for latest)
    const sort = req.query.sort || '-createdAt';
    query = query.sort(sort);

    // Handle limit parameter
    const limit = req.query.limit ? parseInt(req.query.limit) : 0; // 0 means no limit
    if (limit > 0) {
      query = query.limit(limit);
    }

    const products = await query;
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

// create product (admin) - images uploaded with multer-storage-cloudinary in req.files
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const images = (req.files || []).map((f) => ({ url: f.path, public_id: f.filename || f.public_id }));

    const product = new Product({
      name,
      description,
      price,
      category,
      stock: stock || 0,
      images,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('createProduct error', error);
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

// update product (admin) - if images uploaded, append or replace
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // If new files uploaded, map and append to product.images
    if (req.files && req.files.length > 0) {
      const uploaded = req.files.map((f) => ({ url: f.path, public_id: f.filename || f.public_id }));
      product.images = product.images.concat(uploaded).slice(0, 5); // keep max 5
    }

    // Update other fields
    const { name, description, price, category, stock } = req.body;
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (category !== undefined) product.category = category;
    if (stock !== undefined) product.stock = stock;

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

// delete product (admin) - optionally delete images from Cloudinary
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Optionally remove images from cloudinary
    try {
      for (const img of product.images || []) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
    } catch (err) {
      console.warn('Failed to delete cloudinary images', err.message);
    }

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};