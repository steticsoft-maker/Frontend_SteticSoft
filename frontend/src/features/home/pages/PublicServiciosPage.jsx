// src/features/home/pages/PublicServiciosPage.jsx
import React, { useState, useEffect } from "react";
import {
  FaShoppingCart,
  FaCalendarAlt,
  FaHeart,
  FaGem,
  FaMagic,
  FaStar,
  FaCrown,
} from "react-icons/fa";
import ServiceCard from "../components/ServiceCard";
import { getPublicServicios } from "../../../shared/services/publicServices";
import { formatPrice, calculateTotal } from "../../../shared/utils/priceUtils";
import Footer from "../../../shared/components/layout/Footer";
import FooterSpacer from "../../../shared/components/layout/FooterSpacer";
import "../css/PublicServicios.css";

function PublicServiciosPage() {
  const [services, setServices] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);

        const response = await getPublicServicios({ activo: true });

        if (response.data && Array.isArray(response.data.data)) {
          const validServices = response.data.data.filter(
            (service) =>
              service && service.idServicio && service.estado === true
          );
          setServices(validServices);
        } else {
          const responseSinFiltro = await getPublicServicios({});

          if (
            responseSinFiltro.data &&
            Array.isArray(responseSinFiltro.data.data)
          ) {
            const serviciosSinFiltro = responseSinFiltro.data.data.filter(
              (service) =>
                service && service.idServicio && service.estado === true
            );
            setServices(serviciosSinFiltro);
          } else {
            setServices([]);
          }
        }
      } catch (err) {
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("publicCart")) || [];
    const savedSchedule = localStorage.getItem("selectedSchedule") || "";
    setCart(savedCart);
    setSelectedSchedule(savedSchedule);
  }, []);

  const addToCart = (service) => {
    setCart((prevCart) => {
      const serviceId = service.idServicio || service.id;
      const existingService = prevCart.find(
        (item) =>
          (item.idServicio || item.id) === serviceId && item.type === "service"
      );
      let newCart;
      if (existingService) {
        newCart = prevCart.map((item) =>
          (item.idServicio || item.id) === serviceId && item.type === "service"
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...prevCart, { ...service, quantity: 1, type: "service" }];
      }
      localStorage.setItem("publicCart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const handleOrder = () => {
    if (!selectedSchedule) {
      alert(
        "💕 Por favor, selecciona un horario en la sección de Novedades antes de realizar el pedido del servicio."
      );
      return;
    }
    alert(
      `✨ ¡Tu pedido de servicio ha sido registrado con éxito!\n🕐 Horario seleccionado: ${selectedSchedule}\n💖 Gracias por utilizar nuestros servicios\n💳 El pago debe ser realizado al finalizar el servicio.`
    );
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.type !== "service");
      localStorage.setItem("publicCart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const getTotal = () => {
    return cart.reduce((total, item) => {
      if (item.type === "service") {
        const price =
          typeof item.price === "string" ? parseFloat(item.price) : item.price;
        const precio =
          typeof item.precio === "string"
            ? parseFloat(item.precio)
            : item.precio;
        const finalPrice = price || precio || 0;
        return total + finalPrice * (item.quantity || 0);
      }
      return total;
    }, 0);
  };

  return (
    <div className="public-servicios-page">
      {/* Floating Elements */}
      <div className="floating-elements">
        <FaCrown className="floating-element" />
        <FaGem className="floating-element" />
        <FaMagic className="floating-element" />
        <FaStar className="floating-element" />
        <FaHeart className="floating-element" />
      </div>

      {/* Header Section */}
      <section className="servicios-hero">
        <div className="container">
          <h1 className="servicios-title">
            <FaCrown style={{ marginRight: "15px" }} />
            Nuestros Servicios
            <FaCrown style={{ marginLeft: "15px" }} />
          </h1>
          <p className="servicios-subtitle">
            <FaMagic style={{ marginRight: "10px" }} />
            Descubre nuestros servicios profesionales de belleza y cuidado
            personal
            <FaMagic style={{ marginLeft: "10px" }} />
          </p>
        </div>
      </section>

      {/* Cart Icon */}
      <div className="cart-icon" onClick={() => setShowCart(!showCart)}>
        <FaShoppingCart size={24} />
        {cart.filter((item) => item.type === "service").length > 0 && (
          <span className="cart-count">
            {cart
              .filter((item) => item.type === "service")
              .reduce((acc, item) => acc + item.quantity, 0)}
          </span>
        )}
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div className="cart-modal">
          <h3>
            <FaHeart style={{ marginRight: "10px", color: "#e91e63" }} />
            Tu Carrito de Servicios
          </h3>
          {cart.filter((item) => item.type === "service").length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <FaGem
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
                {cart
                  .filter((item) => item.type === "service")
                  .map((item) => {
                    const price =
                      typeof item.price === "string"
                        ? parseFloat(item.price)
                        : item.price;
                    const precio =
                      typeof item.precio === "string"
                        ? parseFloat(item.precio)
                        : item.precio;
                    const finalPrice = price || precio || 0;
                    const total = finalPrice * (item.quantity || 1);
                    return (
                      <li key={`cart-serv-${item.idServicio || item.id}`}>
                        <FaStar
                          style={{ marginRight: "8px", color: "#e91e63" }}
                        />
                        {item.nombre} - {item.quantity || 1} x $
                        {formatPrice(finalPrice, 2)} = ${formatPrice(total, 2)}
                      </li>
                    );
                  })}
              </ul>
              <div className="schedule-info">
                <FaCalendarAlt
                  style={{ marginRight: "8px", color: "#e91e63" }}
                />
                <strong>Horario Seleccionado:</strong> {selectedSchedule}
              </div>
              <div className="cart-total">
                <FaGem style={{ marginRight: "8px" }} />
                Total Servicios: ${formatPrice(getTotal(), 2)}
              </div>
              <button onClick={handleOrder} className="cart-order-btn">
                <FaHeart style={{ marginRight: "8px" }} />
                Realizar Pedido
              </button>
            </>
          )}
        </div>
      )}

      {/* Services Section */}
      <section className="servicios-section">
        <div className="servicios-grid-container">
          {loading ? (
            <div className="loading-state">
              <FaMagic className="loading-icon" />
              <p>Cargando servicios increíbles...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="empty-state">
              <FaCrown className="empty-icon" />
              <p>Pronto tendremos servicios increíbles para ti</p>
            </div>
          ) : (
            <div className="servicios-grid">
              {services.map((service, index) => (
                <div
                  key={service.idServicio}
                  className="service-card-container"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animation: "fadeInUp 0.6s ease-out both",
                  }}
                >
                  <ServiceCard service={service} onAddToCart={addToCart} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Floating Appointment Button */}
      <button
        className={`floating-appointment-btn ${showPulse ? "pulse" : ""}`}
        onClick={() => (window.location.href = "/admin/citas/agendar")}
      >
        <FaCalendarAlt className="btn-icon" />
        Agendar Cita
      </button>

      <FooterSpacer />
      <Footer />
    </div>
  );
}

export default PublicServiciosPage;
