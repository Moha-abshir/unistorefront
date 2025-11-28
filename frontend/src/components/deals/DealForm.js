import React, { useState, useEffect } from 'react';
import './DealForm.css';
import api from '../../utils/api';

const DealForm = ({ deal, onSave }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    discountType: 'percent',
    discountValue: '',
    productIds: [],
    category: '',
    startDate: '',
    endDate: '',
    active: true,
    bannerImage: ''
  });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let mounted = true;
    api.get('/products')
      .then(({ data }) => mounted && setProducts(data))
      .catch(err => console.error('Failed to load products', err));
    if (deal) setForm(f => ({ ...f, ...deal }));
    return () => (mounted = false);
    // eslint-disable-next-line
  }, [deal]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleProductSelect = e => {
    const options = Array.from(e.target.selectedOptions).map(o => o.value);
    setForm(f => ({ ...f, productIds: options }));
  };

  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    // For demo: convert to base64
    const reader = new FileReader();
    reader.onload = () => setForm(f => ({ ...f, bannerImage: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (deal) {
        res = await api.put(`/deals/${deal._id}`, form);
      } else {
        res = await api.post('/deals', form);
      }
      onSave && onSave(res.data);
    } catch (err) {
      console.error('Failed to save deal', err);
      // optionally surface error to UI
    }
  };

  return (
    <form className="deal-form" onSubmit={handleSubmit}>
      <h2>{deal ? 'Edit Deal' : 'Add Deal'}</h2>
      <label>Title<input name="title" value={form.title} onChange={handleChange} required /></label>
      <label>Description<textarea name="description" value={form.description} onChange={handleChange} /></label>
      <label>Discount Type
        <select name="discountType" value={form.discountType} onChange={handleChange}>
          <option value="percent">Percent</option>
          <option value="flat">Flat</option>
        </select>
      </label>
      <label>Discount Value<input name="discountValue" type="number" value={form.discountValue} onChange={handleChange} required /></label>
      <label>Products
        <select name="productIds" multiple value={form.productIds} onChange={handleProductSelect}>
          {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
      </label>
      <label>Category<input name="category" value={form.category} onChange={handleChange} /></label>
      <label>Start Date<input name="startDate" type="date" value={form.startDate?.slice(0,10) || ''} onChange={handleChange} required /></label>
      <label>End Date<input name="endDate" type="date" value={form.endDate?.slice(0,10) || ''} onChange={handleChange} required /></label>
      <label>Active<input name="active" type="checkbox" checked={form.active} onChange={handleChange} /></label>
      <label>Banner Image<input name="bannerImage" type="file" accept="image/*" onChange={handleImageUpload} /></label>
      {form.bannerImage && <img src={form.bannerImage} alt="Banner preview" style={{ maxWidth: 200, margin: '10px 0' }} />}
      <button type="submit">{deal ? 'Update' : 'Create'} Deal</button>
    </form>
  );
};

export default DealForm;
