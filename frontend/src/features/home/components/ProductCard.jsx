// src/features/home/components/ProductCard.jsx
import React from "react";

function ProductCard({ product, onAddToCart }) {
  if (!product) return null;

  const { name, image, description, price } = product;

  return (
    <div className="productos-card">
      {/* Imagen del producto */}
      {image && (
        <div className="productos-image-wrapper">
          <img
            src={image}
            alt={name}
            className="productos-image"
          />
        </div>
      )}

      {/* Contenido */}
      <div className="productos-content">
        <h3 className="productos-name">{name}</h3>
        <p className="productos-description">{description || "Sin descripción"}</p>
        <p className="productos-price">
          {typeof price === "number"
            ? `$${price.toLocaleString()}`
            : "Precio no disponible"}
        </p>

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
