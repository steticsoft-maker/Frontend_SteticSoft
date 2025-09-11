// src/features/home/components/ProductCard.jsx
import React from "react";

function ProductCard({ product, onAddToCart }) {
  if (!product) return null;

  const { name, image, description, price } = product;

  // Imagen por defecto en caso de que no haya
  const defaultImage = "/images/no-image.png"; // pon un archivo en public/images/no-image.png

  // Asegurar que el precio sea numérico
  const numericPrice = price !== null && price !== undefined ? Number(price) : null;

  return (
    <div className="productos-card">
      {/* Imagen del producto */}
      <div className="productos-image-wrapper">
        <img
          src={image || defaultImage}
          alt={name || "Producto sin nombre"}
          className="productos-image"
        />
      </div>

      {/* Contenido */}
      <div className="productos-content">
        <h3 className="productos-name">{name || "Producto sin nombre"}</h3>
        <p className="productos-description">{description || "Sin descripción"}</p>
        <p className="productos-price">
          {typeof numericPrice === "number" && !isNaN(numericPrice)
            ? `$${numericPrice.toLocaleString()}`
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
