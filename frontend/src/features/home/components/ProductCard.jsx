import React from 'react';

function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <div className="product-card-image-container">
        <img src={product.image} alt={product.name} className="product-card-image" />
      </div>
      <div className="product-card-content">
        <h3 className="product-card-title">{product.name}</h3>
        <p className="product-card-description">{product.description}</p>
        <div className="product-card-footer">
          <p className="product-card-price">${product.price.toFixed(2)}</p>
          <button onClick={() => onAddToCart(product)} className="product-card-button">
            Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
