// src/features/home/pages/PublicProductosPage.jsx
import React, { useState, useEffect } from "react";
import {
  FaShoppingCart,
  FaHeart,
  FaGem,
  FaMagic,
  FaStar,
} from "react-icons/fa";
import ProductCard from "../components/ProductCard";
import { getPublicProducts } from "../services/publicProductosService";
import { formatPrice, calculateTotal } from "../../../shared/utils/priceUtils";
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
      } catch (err) {
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

  const handleOrder = () => {
    alert("¡Tu pedido ha sido registrado! Gracias por elegirnos 💕");
    setCart([]);
    localStorage.removeItem("productCart");
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
        <div className="cart-modal">
          <h3>
            <FaHeart style={{ marginRight: "10px", color: "#e91e63" }} />
            Tu Carrito de Compras
          </h3>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <FaHeart
                style={{
                  fontSize: "2rem",
                  color: "#e91e63",
                  marginBottom: "10px",
                }}
              />
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            <>
              <ul>
                {cart.map((item) => (
                  <li key={`cart-prod-${item.id}`}>
                    <FaGem style={{ marginRight: "8px", color: "#e91e63" }} />
                    {item.name} - {item.quantity} x ${formatPrice(item.price)} =
                    ${formatPrice(item.price * item.quantity)}
                  </li>
                ))}
              </ul>
              <div className="cart-total">
                <FaStar style={{ marginRight: "8px" }} />
                Total: ${formatPrice(getTotal())}
              </div>
              <button onClick={handleOrder} className="cart-order-btn">
                <FaHeart style={{ marginRight: "8px" }} />
                Realizar Pedido
              </button>
            </>
          )}
        </div>
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
