import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/api';

const AddProductForm = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]); // {file, url}
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5); // limit to 5 files
    setImages(files);
  };

  // build previews whenever images change; createObjectURL urls are revoked in the cleanup
  useEffect(() => {
    const next = images.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setPreviews(next);

    return () => {
      next.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [images]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('stock', stock);

      images.forEach((file) => {
        formData.append('images', file);
      });

      const res = await axios.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage('Product created successfully');
      setShowToast(true);
      // reset form
      setName('');
      setPrice('');
      setDescription('');
      setCategory('');
      setStock(0);
      setImages([]);

      // after short delay, navigate to admin products list
      setTimeout(() => {
        setShowToast(false);
        navigate('/admin/products');
      }, 1200);
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-add-product-form">
      <div>
        <label className="admin-input-label">Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label className="admin-input-label">Price</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
      </div>
      <div>
        <label className="admin-input-label">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <label className="admin-input-label">Category</label>
        <input value={category} onChange={(e) => setCategory(e.target.value)} />
      </div>
      <div>
        <label className="admin-input-label">Stock</label>
        <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
      </div>
      <div>
        <label className="admin-input-label">Images (up to 5)</label>
        <input type="file" accept="image/*" multiple onChange={handleFileChange} />
        {previews.length > 0 && (
          <div className="preview" style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            {previews.map((p, idx) => (
              <div key={idx} style={{ position: 'relative' }}>
                <img src={p.url} alt={p.file.name} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }} />
                <button type="button" onClick={() => {
                  // remove this image
                  const nextImages = images.filter((f) => f !== p.file);
                  setImages(nextImages);
                }}
                  style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: 12, width: 24, height: 24, cursor: 'pointer' }}
                >×</button>
              </div>
            ))}
          </div>
        )}
      </div>
      <button type="submit" disabled={loading}>{loading ? 'Uploading...' : 'Add Product'}</button>
      {message && <div className="message">{message}</div>}
      {showToast && (
        <div className="inline-toast" style={{ position: 'fixed', right: 20, top: 20, background: '#22c55e', color: '#fff', padding: '8px 12px', borderRadius: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
          {message}
        </div>
      )}
    </form>
  );
};

export default AddProductForm;
