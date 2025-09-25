// src/features/home/components/ProductCard.jsx
import React from "react";
import { FaGem, FaShoppingCart } from "react-icons/fa";
import { formatPrice } from "../../../shared/utils/priceUtils";

const ProductCard = ({ product, onAddToCart }) => {
  const handleAddToCart = () => {
    onAddToCart(product);
  };

  return (
    <div className="product-card-container">
      {/* Image Container */}
      <div
        className="product-image-container"
        style={{
          position: "relative",
          width: "100%",
          height: "200px",
          overflow: "hidden",
          borderRadius: "18px 18px 0 0",
          background: "linear-gradient(135deg, #f8bbd9 0%, #e91e63 20%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              transition: "transform 0.3s ease",
              borderRadius: "0",
            }}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
            onLoad={(e) => {
              e.target.style.display = "block";
              e.target.nextSibling.style.display = "none";
            }}
          />
        ) : null}
        <div
          className="product-image-placeholder"
          style={{
            display: product.image ? "none" : "flex",
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #f8bbd9 0%, #e91e63 100%)",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "3rem",
            opacity: "0.8",
          }}
        >
          <FaGem />
        </div>
      </div>

      {/* Content */}
      <div className="product-content">
        <div>
          <h3 className="product-title">{product.name}</h3>
          <p className="product-description">{product.description}</p>
        </div>

        <div>
          <div className="product-price">${formatPrice(product.price)}</div>
          <button className="product-button" onClick={handleAddToCart}>
            <FaShoppingCart style={{ marginRight: "8px" }} />
            Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
