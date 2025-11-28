import React, { useEffect, useState } from 'react';
import './DealToast.css';

const DealToast = ({ message }) => {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2500);
    return () => clearTimeout(timer);
  }, []);
  if (!visible) return null;
  return <div className="deal-toast">{message}</div>;
};

export default DealToast;
