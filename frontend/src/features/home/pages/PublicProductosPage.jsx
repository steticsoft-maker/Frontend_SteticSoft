// src/features/home/pages/PublicProductosPage.jsx
import React, { useState, useEffect } from "react";
import {
  FaShoppingCart,
  FaHeart,
  FaGem,
  FaMagic,
  FaStar,
  FaTimes,
  FaMinus,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import ProductCard from "../components/ProductCard";
import { getPublicProducts } from "../services/publicProductosService";
import { formatPrice } from "../../../shared/utils/priceUtils";
import Footer from "../../../shared/components/layout/Footer";
import FooterSpacer from "../../../shared/components/layout/FooterSpacer";
import "../css/PublicProductos.css";



function PublicProductosPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getPublicProducts();
        const data = response.data;

        const productos = data.data?.productos || [];

        const productosAdaptados = productos.map((p) => ({
          id: p.idProducto,
          name: p.nombre,
          image: p.imagen,
          price: p.precio,
          description: p.descripcion,
          categoryName: p.categoria?.nombre,
        }));

        setProducts(productosAdaptados);
      } catch {
        // Error silencioso para producción
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("productCart")) || [];
    setCart(savedCart);
  }, []);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      let newCart;
      if (existingProduct) {
        newCart = prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...prevCart, { ...product, quantity: 1 }];
      }

      localStorage.setItem("productCart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.id !== productId);
      localStorage.setItem("productCart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) => {
      const newCart = prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
      localStorage.setItem("productCart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("productCart");
  };

  const handleOrder = () => {
    alert("¡Tu pedido ha sido registrado! Gracias por elegirnos 💕");
    clearCart();
  };

  const getTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.price || 0) * item.quantity;
    }, 0);
  };

  return (
    <div className="productos-page">
      {/* Floating Elements */}
      <div className="floating-elements">
        <FaHeart className="floating-element" />
        <FaGem className="floating-element" />
        <FaMagic className="floating-element" />
        <FaStar className="floating-element" />
        <FaHeart className="floating-element" />
      </div>

      {/* Header Section */}
      <section className="productos-hero">
        <div className="container">
          <h1 className="productos-title">
            <FaGem style={{ marginRight: "15px" }} />
            Nuestros Productos
            <FaGem style={{ marginLeft: "15px" }} />
          </h1>
          <p className="productos-subtitle">
            <FaMagic style={{ marginRight: "10px" }} />
            Descubre nuestra selección de productos de calidad para el cuidado
            de tu cabello
            <FaMagic style={{ marginLeft: "10px" }} />
          </p>
        </div>
      </section>

      {/* Cart Icon */}
      <div className="cart-icon" onClick={() => setShowCart(!showCart)}>
        <FaShoppingCart size={24} />
        {cart.length > 0 && (
          <span className="cart-count">
            {cart.reduce((acc, item) => acc + item.quantity, 0)}
          </span>
        )}
      </div>

      {/* Cart Modal */}
      {showCart && (
        <>
          {/* Backdrop */}
          <div
            className="cart-backdrop"
            onClick={() => setShowCart(false)}
            aria-label="Cerrar carrito"
          />
          <div className="cart-modal">
            <div className="cart-header">
              <h3>
                <FaHeart style={{ marginRight: "10px", color: "#e91e63" }} />
                Tu Carrito de Compras
              </h3>
              <button
                className="cart-close-btn cart-close-btn-alt"
                onClick={() => setShowCart(false)}
                aria-label="Cerrar carrito"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="cart-empty">
                <FaHeart
                  style={{
                    fontSize: "3rem",
                    color: "#e91e63",
                    marginBottom: "15px",
                  }}
                />
                <p>Tu carrito está vacío</p>
                <p className="cart-empty-subtitle">
                  ¡Agrega algunos productos increíbles!
                </p>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div key={`cart-prod-${item.id}`} className="cart-item">
                      <div className="cart-item-info">
                        <div className="cart-item-image">
                          {item.image ? (
                            <img src={item.image} alt={item.name} />
                          ) : (
                            <div className="cart-item-placeholder">
                              <FaGem />
                            </div>
                          )}
                        </div>
                        <div className="cart-item-details">
                          <h4 className="cart-item-name">{item.name}</h4>
                          <p className="cart-item-price">
                            ${formatPrice(item.price)}
                          </p>
                        </div>
                      </div>

                      <div className="cart-item-controls">
                        <div className="quantity-controls">
                          <button
                            className="quantity-btn quantity-btn-minus"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <FaMinus />
                          </button>
                          <span className="quantity-display">
                            {item.quantity}
                          </span>
                          <button
                            className="quantity-btn quantity-btn-plus"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <FaPlus />
                          </button>
                        </div>
                        <button
                          className="remove-item-btn remove-item-btn-alt"
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Eliminar producto"
                        >
                          <FaTrash />
                        </button>
                      </div>

                      <div className="cart-item-total">
                        ${formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div className="cart-total-section">
                    <div className="cart-subtotal">
                      <span>Subtotal:</span>
                      <span>${formatPrice(getTotal())}</span>
                    </div>
                    <div className="cart-total">
                      <FaStar style={{ marginRight: "8px" }} />
                      <span>Total: ${formatPrice(getTotal())}</span>
                    </div>
                  </div>

                  <div className="cart-actions">
                    <button
                      onClick={clearCart}
                      className="cart-clear-btn cart-clear-btn-alt"
                    >
                      <FaTrash style={{ marginRight: "8px" }} />
                      Vaciar Carrito
                    </button>
                    <button
                      onClick={handleOrder}
                      className="cart-order-btn cart-order-btn-alt"
                    >
                      <FaHeart style={{ marginRight: "8px" }} />
                      Realizar Pedido
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* Products Section */}
      <section className="productos-section">
        <div className="productos-grid-container">
          {loading ? (
            <div className="loading-state">
              <FaMagic className="loading-icon" />
              <p>Cargando productos increíbles...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <FaHeart className="empty-icon" />
              <p>Pronto tendremos productos increíbles para ti</p>
            </div>
          ) : (
            <div className="productos-grid">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="product-card-container"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animation: "fadeInUp 0.6s ease-out both",
                  }}
                >
                  <ProductCard product={product} onAddToCart={addToCart} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <FooterSpacer />
      <Footer />
    </div>
  );
}

export default PublicProductosPage;
