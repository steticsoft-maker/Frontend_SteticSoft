// src/features/home/pages/PublicServiciosPage.jsx
import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaCalendarAlt } from "react-icons/fa";
import ServiceCard from "../components/ServiceCard";
import { getServicios } from "../../serviciosAdmin/services/serviciosAdminService";
import Footer from "../../../shared/components/layout/Footer";
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
        
        // Obtener servicios activos usando el servicio existente
        const response = await getServicios({ activo: true });
        
        if (response.data && Array.isArray(response.data.data)) {
          const validServices = response.data.data.filter(
            (service) => service && service.idServicio && service.estado === true
          );
          setServices(validServices);
        } else {
          // Intentar sin filtro
          const responseSinFiltro = await getServicios({});
          
          if (responseSinFiltro.data && Array.isArray(responseSinFiltro.data.data)) {
            const serviciosSinFiltro = responseSinFiltro.data.data.filter(
              (service) => service && service.idServicio && service.estado === true
            );
            setServices(serviciosSinFiltro);
          } else {
            setServices([]);
          }
        }
      } catch (err) {
        console.error("Error al cargar servicios públicos:", err);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  // Efecto para mostrar animación de pulso después de 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPulse(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("publicCart")) || [];
    setCart(savedCart);
    const savedSchedule =
      localStorage.getItem("selectedSchedule") || "No seleccionado";
    setSelectedSchedule(savedSchedule);
  }, []);

  const addToCart = (service) => {
    setCart((prevCart) => {
      const serviceId = service.idServicio || service.id;
      const existingService = prevCart.find(
        (item) => (item.idServicio || item.id) === serviceId && item.type === "service"
      );
      let newCart;
      if (existingService) {
        newCart = prevCart.map((item) =>
          (item.idServicio || item.id) === serviceId && item.type === "service"
            ? { ...item, quantity: (item.quantity || 0) + 1 }
            : item
        );
      } else {
        newCart = [...prevCart, { ...service, quantity: 1, type: "service" }];
      }

      // Guardar en localStorage
      localStorage.setItem("publicCart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const handleOrder = () => {
    if (cart.filter((item) => item.type === "service").length === 0) {
      alert("No hay servicios en el carrito para pedir.");
      return;
    }
    if (selectedSchedule === "No seleccionado" || !selectedSchedule) {
      alert(
        "Por favor, selecciona un horario en la sección de Novedades antes de realizar el pedido del servicio."
      );
      return;
    }
    alert(
      `Tu pedido de servicio ha sido registrado con éxito.\nHorario seleccionado: ${selectedSchedule}.\nGracias por utilizar nuestros servicios. \nEl pago debe ser realizado al finalizar el servicio.`
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
        const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
        const precio = typeof item.precio === 'string' ? parseFloat(item.precio) : item.precio;
        const finalPrice = price || precio || 0;
        return total + finalPrice * (item.quantity || 0);
      }
      return total;
    }, 0);
  };

  return (
    <div className="public-servicios-page">
      <div className="public-cart-icon" onClick={() => setShowCart(!showCart)}>
        <FaShoppingCart size={30} />
        {cart.filter((item) => item.type === "service").length > 0 && (
          <span className="public-cart-count">
            {cart
              .filter((item) => item.type === "service")
              .reduce((acc, item) => acc + item.quantity, 0)}
          </span>
        )}
      </div>

      {showCart && (
        <div className="public-cart-modal">
          <h2>Carrito de Servicios</h2>
          {cart.filter((item) => item.type === "service").length === 0 ? (
            <p>No hay servicios en el carrito.</p>
          ) : (
            <>
              <ul>
                  {cart
                    .filter((item) => item.type === "service")
                    .map((item) => {
                      const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
                      const precio = typeof item.precio === 'string' ? parseFloat(item.precio) : item.precio;
                      const finalPrice = price || precio || 0;
                      const total = finalPrice * (item.quantity || 1);
                      return (
                        <li key={`cart-serv-${item.idServicio || item.id}`}>
                          {item.nombre} - {item.quantity || 1} x $
                          {finalPrice.toFixed(2)} = $
                          {total.toFixed(2)}
                        </li>
                      );
                    })}
              </ul>
              <p>
                <strong>Horario Seleccionado:</strong> {selectedSchedule}
              </p>
              <h3>Total Servicios: ${getTotal().toFixed(2)}</h3>
              <button onClick={handleOrder} className="public-primary-button">
                Realizar Pedido
              </button>
            </>
          )}
        </div>
      )}

      <h1 className="public-servicios-title">Servicios Disponibles</h1>

      <div className="public-servicios-grid-wrapper">
        {loading ? (
          <p className="public-loading">Cargando servicios...</p>
        ) : services.length === 0 ? (
          <p className="public-no-services">
            No hay servicios disponibles en este momento.
          </p>
        ) : (
          <div className="public-servicios-grid">
            {services.map((service) => (
              <ServiceCard
                key={service.idServicio}
                service={service}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}
      </div>

      
      {/* Botón flotante para agendar citas */}
      <button 
        className={`floating-appointment-btn ${showPulse ? 'pulse' : ''}`}
        onClick={() => window.location.href = '/admin/citas/agendar'}
      >
        <FaCalendarAlt className="btn-icon" />
        Agendar Cita
      </button>
      
      <Footer />
    </div>
  );
}

export default PublicServiciosPage;
