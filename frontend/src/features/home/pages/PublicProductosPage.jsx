// src/features/home/pages/PublicProductosPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  FaUser,
  FaInfoCircle,
  FaCalendarAlt,
} from "react-icons/fa";
import ProductCard from "../components/ProductCard";
import { getPublicProducts } from "../services/publicProductosService";
import { createPublicVenta } from "../../../shared/services/publicServices";
import { formatPrice } from "../../../shared/utils/priceUtils";
import { useAuth } from "../../../shared/contexts/authHooks";
import Footer from "../../../shared/components/layout/Footer";
import FooterSpacer from "../../../shared/components/layout/FooterSpacer";
import Swal from "sweetalert2";
import "../css/PublicProductos.css";

function PublicProductosPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

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

  // Restaurar carrito guardado cuando el usuario se autentica
  useEffect(() => {
    if (isAuthenticated && user?.rol?.nombre === "Cliente") {
      const savedCart = JSON.parse(localStorage.getItem("productCart")) || [];
      if (savedCart.length > 0) {
        Swal.fire({
          title: "¡Bienvenido!",
          text: "Hemos restaurado los productos que tenías en tu carrito. ¡Ya puedes proceder con tu compra!",
          icon: "info",
          confirmButtonText: "Continuar",
          timer: 4000,
          timerProgressBar: true,
        });
      }
    }
  }, [isAuthenticated, user]);

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

  const handleOrder = async () => {
    if (cart.length === 0) {
      Swal.fire({
        title: "Carrito vacío",
        text: "Agrega algunos productos antes de proceder con la compra.",
        icon: "warning",
        confirmButtonText: "Entendido",
      });
      return;
    }

    // Verificar si el usuario está autenticado
    if (!isAuthenticated) {
      const result = await Swal.fire({
        title: "Inicia sesión para continuar",
        html: `
          <div style="text-align: left; margin: 20px 0;">
            <p><strong>Para realizar tu compra necesitas:</strong></p>
            <ul style="margin: 15px 0; padding-left: 20px;">
              <li>Iniciar sesión como cliente</li>
              <li>Completar tu información de contacto</li>
            </ul>
            <p style="margin-top: 15px; font-style: italic;">
              <strong>¡No te preocupes!</strong> Tu carrito se guardará automáticamente 
              y podrás continuar con tu compra después de iniciar sesión.
            </p>
          </div>
        `,
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Iniciar sesión",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#6B46C1",
        cancelButtonColor: "#6c757d",
      });

      if (result.isConfirmed) {
        navigate("/login", {
          state: {
            from: "/productos",
            message: "Inicia sesión para continuar con tu compra",
          },
        });
      }
      return;
    }

    // Verificar si el usuario es un cliente
    if (user?.rol?.nombre !== "Cliente") {
      Swal.fire({
        title: "Acceso restringido",
        text: "Solo los clientes pueden realizar compras desde la tienda.",
        icon: "error",
        confirmButtonText: "Entendido",
      });
      return;
    }

    // Mostrar información sobre el proceso de compra
    const processInfo = await Swal.fire({
      title: "Proceso de Compra",
      html: `
        <div style="text-align: left; margin: 20px 0;">
          <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h4 style="color: #1976d2; margin: 0 0 10px 0;">
              <i class="fas fa-info-circle"></i> Información Importante
            </h4>
            <ul style="margin: 0; padding-left: 20px; color: #424242;">
              <li>Este es un <strong>pedido de reserva</strong></li>
              <li>Los productos serán separados del inventario</li>
              <li>Debes acercarte al local para realizar el pago</li>
              <li>El pedido estará disponible por <strong>24 horas</strong></li>
              <li>Puedes cancelar desde "Mis Pedidos" si está pendiente</li>
            </ul>
          </div>
          <p><strong>Total a pagar:</strong> $${formatPrice(
            getTotal() * 1.19
          )}</p>
          <p><em>¿Deseas continuar con tu pedido?</em></p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirmar Pedido",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#6B46C1",
      cancelButtonColor: "#6c757d",
    });

    if (!processInfo.isConfirmed) {
      return;
    }

    // Procesar la compra
    setIsProcessingOrder(true);

    try {
      // Preparar los datos para enviar
      const productosParaEnviar = cart.map((item) => ({
        idProducto: item.id,
        cantidad: item.quantity,
      }));

      const ventaData = {
        productos: productosParaEnviar,
        servicios: [], // No hay servicios en este caso
      };

      const response = await createPublicVenta(ventaData);

      // Mostrar mensaje de éxito
      await Swal.fire({
        title: "¡Pedido realizado exitosamente!",
        html: `
          <div style="text-align: center; margin: 20px 0;">
            <p><strong>ID del Pedido:</strong> ${
              response.data?.idVenta || "N/A"
            }</p>
            <p style="margin: 15px 0;">
              Te hemos enviado un email con los detalles de tu pedido.
            </p>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 15px;">
              <p style="margin: 0; font-weight: bold; color: #6B46C1;">
                ¡Recuerda acercarte al local para realizar el pago y retirar tu pedido!
              </p>
            </div>
          </div>
        `,
        icon: "success",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#6B46C1",
      });

      // Limpiar el carrito después de una compra exitosa
      clearCart();

      // Opcional: redirigir a una página de confirmación o a "Mis Pedidos"
      // navigate('/mis-pedidos');
    } catch (error) {
      console.error("Error al procesar la compra:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Ocurrió un error inesperado al procesar tu pedido.";

      Swal.fire({
        title: "Error al procesar el pedido",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Intentar de nuevo",
      });
    } finally {
      setIsProcessingOrder(false);
    }
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
                    <div className="cart-tax">
                      <span>IVA (19%):</span>
                      <span>${formatPrice(getTotal() * 0.19)}</span>
                    </div>
                    <div className="cart-total">
                      <FaStar style={{ marginRight: "8px" }} />
                      <span>Total: ${formatPrice(getTotal() * 1.19)}</span>
                    </div>
                  </div>

                  {/* Información de autenticación */}
                  {!isAuthenticated && (
                    <div className="auth-notice">
                      <FaUser className="auth-icon" />
                      <span>Inicia sesión para continuar con tu compra</span>
                    </div>
                  )}

                  {isAuthenticated && user?.rol?.nombre !== "Cliente" && (
                    <div className="auth-notice error">
                      <FaInfoCircle className="auth-icon" />
                      <span>Solo los clientes pueden realizar compras</span>
                    </div>
                  )}

                  {isAuthenticated && user?.rol?.nombre === "Cliente" && (
                    <div className="auth-notice success">
                      <FaUser className="auth-icon" />
                      <span>
                        ¡Hola {user.nombre}! Tu carrito está listo para comprar
                      </span>
                    </div>
                  )}

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
                      disabled={isProcessingOrder}
                    >
                      {isProcessingOrder ? (
                        <>
                          <div className="spinner-small"></div>
                          Procesando...
                        </>
                      ) : (
                        <>
                          <FaHeart style={{ marginRight: "8px" }} />
                          Realizar Pedido
                        </>
                      )}
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

      {/* Floating Appointment Button */}
      <button
        className="floating-appointment-btn"
        onClick={() => (window.location.href = "/citas")}
      >
        <FaCalendarAlt className="btn-icon" />
        Agendar Cita
      </button>

      <FooterSpacer />
      <Footer />
    </div>
  );
}

export default PublicProductosPage;
