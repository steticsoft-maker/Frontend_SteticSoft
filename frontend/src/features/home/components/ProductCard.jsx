// src/features/home/components/ProductCard.jsx
import React from "react";

function ProductCard({ product, onAddToCart }) {
  return (
    <div className="productos-card">
      {/* Imagen del producto */}
      {product.image && (
        <div className="productos-image-wrapper">
          <img
            src={product.image}
            alt={product.name}
            className="productos-image"
          />
        </div>
      )}

      {/* Contenido */}
      <div className="productos-content">
        <h3 className="productos-name">{product.name}</h3>
        <p className="productos-description">{product.description}</p>
        <p className="productos-price">${product.price.toLocaleString()}</p>

        <button
          onClick={() => onAddToCart(product)}
          className="add-button"
        >
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
