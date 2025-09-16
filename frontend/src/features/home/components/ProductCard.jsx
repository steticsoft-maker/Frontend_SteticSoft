// src/features/home/components/ProductCard.jsx
import React from "react";

// 🔑 Obtenemos la URL base de la API desde las variables de entorno
const API_URL = import.meta.env.VITE_API_URL;

// 헬퍼 Función para construir la URL completa de la imagen
const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return "/images/no-image.png"; // Imagen por defecto si no hay ruta
  }
  // Si la ruta ya es una URL completa (de Cloudinary, por ejemplo)
  if (imagePath.startsWith("http")) {
    return imagePath;
  }
  // Si es una ruta relativa, la concatenamos con la URL de la API
  return `${API_URL}${imagePath}`;
};

function ProductCard({ product, onAddToCart }) {
  if (!product) return null;

  const { name, image, description, price } = product;

  // 💡 Usamos la función para obtener la URL final de la imagen
  const imageUrl = getImageUrl(image);

  // Asegurar que el precio sea numérico
  const numericPrice = price !== null && price !== undefined ? Number(price) : null;

  return (
    <div className="productos-card">
      {/* Imagen del producto */}
      <div className="productos-image-wrapper">
        <img
          src={imageUrl}
          alt={name || "Producto sin nombre"}
          className="productos-image"
          // Opcional: manejar errores de carga de imagen
          onError={(e) => {
            e.target.onerror = null; // Prevenir bucles infinitos
            e.target.src = "/images/no-image.png"; // Mostrar imagen por defecto en caso de error
          }}
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
