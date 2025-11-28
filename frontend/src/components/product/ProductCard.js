import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import "./ProductCard.css";
import WishlistButton from "../Wishlist/WishlistButton";

const ProductCard = ({ product }) => {
  const [qty, setQty] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [discount, setDiscount] = useState(null);
  const { addToCart } = useContext(CartContext);

  // ✅ Fetch active discounts from backend and match product-specific ones
  useEffect(() => {
    const fetchDiscount = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/discounts/active/list`);
        const data = await res.json();

        // Match product-specific discount or global one (product == null)
        const matched = data.find(
          (d) => d.product?._id === product._id || d.product === null
        );
        if (matched) setDiscount(matched);
      } catch (err) {
        console.error("Failed to fetch discounts:", err);
      }
    };

    fetchDiscount();
  }, [product._id]);

  // ✅ Add to cart animation + toast
  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(product, qty);

    const img = e.currentTarget.closest(".shop-item-card").querySelector("img");
    if (img) {
      const clone = img.cloneNode(true);
      const rect = img.getBoundingClientRect();
      clone.style.position = "fixed";
      clone.style.left = `${rect.left}px`;
      clone.style.top = `${rect.top}px`;
      clone.style.width = `${rect.width}px`;
      clone.style.height = `${rect.height}px`;
      clone.style.transition = "transform 0.8s ease-in-out, opacity 0.8s ease-in-out";
      clone.style.zIndex = 9999;
      document.body.appendChild(clone);

      const cartIcon = document.querySelector(".nav-cart");
      const targetRect = cartIcon
        ? cartIcon.getBoundingClientRect()
        : { left: window.innerWidth - 40, top: 20 };
      const translateX = targetRect.left - rect.left;
      const translateY = targetRect.top - rect.top;

      requestAnimationFrame(() => {
        clone.style.transform = `translate(${translateX}px, ${translateY}px) scale(0.2)`;
        clone.style.opacity = "0.6";
      });

      setTimeout(() => clone.remove(), 900);
    }

    setShowToast(true);
    setTimeout(() => setShowToast(false), 1200);
  };

  // ✅ Calculate discounted price
  const originalPrice = Number(product.price) || 0;
  let discountedPrice = originalPrice;
  let discountLabel = null;

  if (discount) {
    if (discount.discountType === "percent") {
      discountedPrice = originalPrice - (originalPrice * discount.amount) / 100;
      discountLabel = `${discount.amount}% OFF`;
    } else if (discount.discountType === "fixed") {
      discountedPrice = Math.max(0, originalPrice - discount.amount);
      discountLabel = `KES ${discount.amount} OFF`;
    }
  }

  const hasDiscount = discountedPrice < originalPrice;

  return (
    <Link to={`/product/${product._id}`} className="shop-item-card">
      <div className="shop-item-image-container">
        {hasDiscount && <span className="discount-badge">{discountLabel}</span>}
        <WishlistButton productId={product._id} />
        <img
          src={product.image || product.images?.[0]?.url || ""}
          alt={product.name}
          className="shop-item-image"
        />
      </div>

      <div className="shop-item-info">
        <h3 className="shop-item-name">{product.name}</h3>

        <div className="shop-item-price">
          {hasDiscount ? (
            <>
              <span className="discounted-price">KES {discountedPrice.toFixed(2)}</span>
              <span className="original-price">KES {originalPrice.toFixed(2)}</span>
            </>
          ) : (
            <span>KES {originalPrice.toFixed(2)}</span>
          )}
        </div>

        <div className="shop-item-actions">
          <button
            className="quickview-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowToast(false);
              // open quick view by setting state outside Link
              console.log('mw_open_quickview dispatch', product && product._id);
              const ev = new CustomEvent('mw_open_quickview', { detail: product });
              window.dispatchEvent(ev);
            }}
          >
            Quick View
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
