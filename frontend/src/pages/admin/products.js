import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import AdminNavbar from './AdminSidebar';
import './AdminDashboard.css';
import './products.css';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products");
      setProducts(data);
    } catch (err) {
      setError("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const clearForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      image: "",
    });
    setEditingProduct(null);
    setError("");
    setSuccess("");
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.name || !form.price) {
      setError("Name and Price are required");
      return;
    }
    try {
      setLoading(true);
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, {
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        });
        setSuccess("✅ Product updated successfully");
      } else {
        await api.post("/products", {
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        });
        setSuccess("✅ Product added successfully");
      }
      clearForm();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "❌ Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      category: product.category || "",
      stock: product.stock.toString(),
      image: product.image || "",
    });
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(products);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'products.xlsx');
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Products List', 14, 16);
    autoTable(doc, {
      head: [['Product ID', 'Name', 'Category', 'Stock', 'Price (KES)']],
    body: products.map(p => [p.productId || p._id, p.name, p.category, p.countInStock, `KES ${(Number(p?.price) || 0).toFixed(2)}`]),
      startY: 22,
    });
    doc.save('products.pdf');
  };

  return (
    <div className="admin-orders-bg">
      <AdminNavbar />
      <main className="admin-content" style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px', minHeight: '80vh' }}>
        <section className="products-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <h2 className="admin-page-title" style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: 8 }}>Products</h2>
            <div  className="order-summary-card-whole" >
              <div className="order-summary-card">
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Total Products</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, margin: '8px 0' }}>{products.length}</div>
                <div style={{ color: '#888', fontSize: '0.95rem' }}>Products in stock</div>
              </div>
              <div className="order-summary-card">
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Low Stock</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, margin: '8px 0' }}>{products.filter(p => p.stock < 10).length}</div>
                <div style={{ color: '#888', fontSize: '0.95rem' }}>Products below threshold</div>
              </div>
              <div className="order-summary-card">
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Categories</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, margin: '8px 0' }}>{[...new Set(products.map(p => p.category))].length}</div>
                <div style={{ color: '#888', fontSize: '0.95rem' }}>Product categories</div>
              </div>
            </div>
          </div>
            
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            
            <button className="admin-btn-secondary" onClick={handleDownloadExcel}>Download Excel</button>
            <button className="admin-btn-secondary" onClick={handleDownloadPDF}>Download PDF</button>
          </div>
        </section>
        {showForm && (
          <div className="admin-form">
            <h2>{editingProduct ? "Edit Product" : "Add Product"}</h2>
            {error && <div className="admin-error">{error}</div>}
            {success && <div className="admin-success">{success}</div>}
            <form onSubmit={handleSubmit} noValidate>
              <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
                className="admin-input"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="admin-textarea"
              />
              <input
                name="price"
                type="number"
                step="0.01"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                required
                className="admin-input"
              />
              <input
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={handleChange}
                className="admin-input"
              />
              <input
                name="stock"
                type="number"
                placeholder="Stock"
                value={form.stock}
                onChange={handleChange}
                className="admin-input"
              />
              <input
                name="image"
                placeholder="Image URL"
                value={form.image}
                onChange={handleChange}
                className="admin-input"
              />
              <div>
                <button type="submit" disabled={loading} className="admin-btn">
                  {loading
                    ? "Saving..."
                    : editingProduct
                    ? "Update"
                    : "Add"}
                </button>
                <button
                  type="button"
                  className="admin-btn"
                  onClick={clearForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        <section className="products-table-section">
          <table className="orders-table" style={{ width: '100%', background: 'transparent', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ fontWeight: 700, fontSize: '1.05rem', color: '#222' }}>
                <th style={{ padding: '12px 8px' }}>Name</th>
                <th style={{ padding: '12px 8px' }}>Price</th>
                <th style={{ padding: '12px 8px' }}>Stock</th>
                <th style={{ padding: '12px 8px' }}>Category</th>
                <th style={{ padding: '12px 8px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '16px', color: '#888' }}>
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id}>
                    <td style={{ padding: '12px 8px' }}>{p.name}</td>
                    <td style={{ padding: '12px 8px' }}>KES {(Number(p?.price) || 0).toFixed(2)}</td>
                    <td style={{ padding: '12px 8px' }}>{p.stock}</td>
                    <td style={{ padding: '12px 8px' }}>{p.category}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <button className="admin-btn" onClick={() => handleEdit(p)}>
                        Edit
                      </button>
                      <button className="admin-btn" onClick={() => handleDelete(p._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default AdminProducts;
