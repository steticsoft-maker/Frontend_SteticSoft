// src/features/home/components/ProductCard.jsx
import React from "react";
// import '../css/ProductCard.css'; // O estilos dentro de PublicProductos.css

function ProductCard({ product, onAddToCart }) {
  return (
    <div className="public-productos-card">
      {" "}
      {/* Usar prefijo para evitar colisiones */}
      <img
        src={product.image}
        alt={product.name}
        className="public-productos-image"
      />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p className="public-productos-price">${product.price.toFixed(2)}</p>
      <button
        onClick={() => onAddToCart(product)}
        className="public-add-button"
      >
        Agregar
      </button>
    </div>
  );
}
export default ProductCard;
