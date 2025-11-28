export function getDiscountedPrice(product, deal) {
  if (!deal) return product.price;
  if (deal.discountType === 'percent') {
    return Math.round(product.price - (product.price * deal.discountValue) / 100);
  }
  if (deal.discountType === 'flat') {
    return Math.max(0, product.price - deal.discountValue);
  }
  return product.price;
}
