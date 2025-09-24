// src/features/home/pages/PublicServiciosPage.jsx
import React, { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import ServiceCard from "../components/ServiceCard";
import "../css/PublicServicios.css";

function PublicServiciosPage() {
  const [services, setServices] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api-steticsoft-web-movil.onrender.com/api/servicios/public")
      .then((res) => res.json())
      .then((data) => {
        console.log("Respuesta completa:", data);
        if (Array.isArray(data.data)) {
          const validServices = data.data.filter(
            (service) => service && service.id
          );
          console.table(data.data); // 👈 Esto te muestra los servicios en formato tabla
          setServices(validServices);
        } else {
          console.warn("La respuesta no contiene un array válido:", data.data);
          setServices([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar servicios públicos:", err);
        setLoading(false);
      });
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
      const existingService = prevCart.find(
        (item) => item.id === service.id && item.type === "service"
      );
      let newCart;
      if (existingService) {
        newCart = prevCart.map((item) =>
          item.id === service.id && item.type === "service"
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
      if (item.type === "service")
        return total + item.price * (item.quantity || 0);
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
                  .map((item) => (
                    <li key={`cart-serv-${item.id}`}>
                      {item.nombre} - {item.quantity || 1} x $
                      {item.price.toFixed(2)} = $
                      {(item.price * (item.quantity || 1)).toFixed(2)}
                    </li>
                  ))}
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
                key={service.id}
                service={service}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PublicServiciosPage;
