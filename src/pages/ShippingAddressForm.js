import React, { useState, useEffect, useContext } from "react";
import "./ShippingAddressForm.css";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";

const kenyaCounties = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu", "Garissa",
  "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho", "Kiambu", "Kilifi",
  "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia", "Lamu",
  "Machakos", "Makueni", "Mandera", "Marsabit", "Meru", "Migori", "Mombasa",
  "Murang'a", "Nairobi", "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua",
  "Nyeri", "Samburu", "Siaya", "Taita Taveta", "Tana River", "Tharaka-Nithi",
  "Trans Nzoia", "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot"
];

const eastAfricanCountries = [
  "Kenya", "Uganda", "Tanzania", "Rwanda", "Burundi", "South Sudan",
  "Ethiopia", "Somalia", "Djibouti", "Eritrea", "Seychelles", "Comoros",
  "Madagascar", "Mauritius"
];

const ShippingAddressForm = ({ onSubmit }) => {
  const { user } = useContext(AuthContext);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Kenya",
  });

  // Load saved addresses on mount
  useEffect(() => {
    if (user) {
      loadSavedAddresses();
    }
  }, [user]);

  const loadSavedAddresses = async () => {
    try {
      const { data } = await api.get('/users/addresses');
      setSavedAddresses(data);
      // Auto-select the default address
      const defaultAddr = data.find(a => a.isDefault);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr._id);
      }
    } catch (err) {
      console.error('Failed to load saved addresses:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedAddressId && !showNewForm) {
      // Use selected address
      const selected = savedAddresses.find(a => a._id === selectedAddressId);
      onSubmit(selected);
    } else if (showNewForm || !selectedAddressId) {
      // Save new address and use it
      try {
        setIsSaving(true);
        const { data } = await api.post('/users/addresses', {
          ...formData,
          isDefault: savedAddresses.length === 0 // First address is default
        });
        setSavedAddresses(data);
        onSubmit(data[data.length - 1]); // Submit the newly added address
      } catch (err) {
        console.error('Failed to save address:', err);
        alert('Error saving address. Please try again.');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleSelectSaved = (addressId) => {
    setSelectedAddressId(addressId);
    setShowNewForm(false);
  };

  return (
    <div className="shipping-form-container">
      <h2 className="shipping-title">Shipping Address</h2>

      {/* Show saved addresses if any */}
      {savedAddresses.length > 0 && !showNewForm && (
        <div className="saved-addresses-section">
          <h3>📍 Saved Addresses</h3>
          <div className="saved-addresses-list">
            {savedAddresses.map((addr) => (
              <label key={addr._id} className="address-option">
                <input
                  type="radio"
                  name="savedAddress"
                  value={addr._id}
                  checked={selectedAddressId === addr._id}
                  onChange={() => handleSelectSaved(addr._id)}
                />
                <div className="address-info">
                  <strong>{addr.fullName}</strong>
                  <p>{addr.address}, {addr.city}</p>
                  <small>{addr.phone}</small>
                  {addr.isDefault && <span className="default-badge">Default</span>}
                </div>
              </label>
            ))}
          </div>
          <button
            type="button"
            className="add-new-address-btn"
            onClick={() => setShowNewForm(true)}
          >
            + Add New Address
          </button>
        </div>
      )}

      {/* Form for new/edit address */}
      {(showNewForm || savedAddresses.length === 0) && (
        <form className="shipping-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <textarea
            name="address"
            placeholder="Street Address"
            value={formData.address}
            onChange={handleChange}
            required
          ></textarea>

          <div className="form-row">
            {formData.country === "Kenya" ? (
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              >
                <option value="">Select County</option>
                {kenyaCounties.map((county) => (
                  <option key={county} value={county}>
                    {county}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                name="city"
                placeholder="City / Region"
                value={formData.city}
                onChange={handleChange}
                required
              />
            )}

            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={formData.postalCode}
              onChange={handleChange}
              required
            />
          </div>

          <select name="country" value={formData.country} onChange={handleChange} required>
            {eastAfricanCountries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
            <option value="United Kingdom">United Kingdom</option>
            <option value="United States">United States</option>
          </select>

          <div className="form-buttons">
            <button type="submit" className="shipping-btn" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Continue to Payment'}
            </button>
            {savedAddresses.length > 0 && showNewForm && (
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowNewForm(false)}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {/* Quick submit for saved address */}
      {savedAddresses.length > 0 && !showNewForm && selectedAddressId && (
        <button className="shipping-btn" onClick={handleSubmit}>
          Continue to Payment
        </button>
      )}
    </div>
  );
};

export default ShippingAddressForm;
