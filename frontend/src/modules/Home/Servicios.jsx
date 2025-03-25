import React, { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa"; // Ícono de carrito
import { useNavigate } from "react-router-dom"; // Hook para redirección
import Navbar from "../../components/Navbar"; // Componente Navbar
import "./Servicios.css";

function Servicios() {
  const navigate = useNavigate(); // Hook para manejar redirecciones
  const [services, setServices] = useState([
    {
      id: 1,
      name: "Jardinería",
      image: "ruta-a-la-imagen", // Reemplazar con la URL de la imagen
      price: 50,
      description: "Mantenimiento completo de jardines",
      duration: "3 horas",
      fullDescription:
        "Incluye poda, riego, fertilización y limpieza de jardines.",
    },
    {
      id: 2,
      name: "Reparación de Electrodomésticos",
      image: "ruta-a-la-imagen", // Reemplazar con la URL de la imagen
      price: 100,
      description: "Reparación general de electrodomésticos",
      duration: "4 horas",
      fullDescription:
        "Servicio especializado para reparar electrodomésticos como lavadoras, refrigeradores y más.",
    },
    // Más servicios...
  ]);
  const [cart, setCart] = useState([]);
  const [modalService, setModalService] = useState(null);
  const [showCart, setShowCart] = useState(false); // Estado para mostrar/ocultar el carrito
  const [selectedSchedule, setSelectedSchedule] = useState(""); // Estado para el horario

  // Cargar carrito y horario desde localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);

    const savedSchedule =
      localStorage.getItem("selectedSchedule") || "No seleccionado";
    setSelectedSchedule(savedSchedule);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (service) => {
    const existingService = cart.find((item) => item.id === service.id);
    if (existingService) {
      setCart(
        cart.map((item) =>
          item.id === service.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...service, quantity: 1 }]);
    }
  };

  const handleOrder = () => {
    alert(
      `Tu pedido de servicio ha sido registrado con éxito.\nHorario seleccionado: ${selectedSchedule}.\nGracias por utilizar nuestros servicios. \nEl pago debe ser realizado al finalizar el servicio.`
    );
    setCart([]);
    localStorage.removeItem("cart");
    localStorage.removeItem("selectedSchedule");
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="servicios-page">
      <Navbar />

      <div className="cart-icon" onClick={() => setShowCart(!showCart)}>
        <FaShoppingCart size={30} />
        {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
      </div>

      {showCart && (
        <div className="cart-modal">
          <h2>Carrito de Servicios</h2>
          {cart.length === 0 ? (
            <p>No hay servicios en el carrito.</p>
          ) : (
            <>
              <ul>
                {cart.map((item) => (
                  <li key={item.id}>
                    {item.name} - {item.quantity} unidad(es) - $
                    {item.price * item.quantity}
                  </li>
                ))}
              </ul>
              <h3>Total: ${getTotal()}</h3>
              <button onClick={handleOrder} className="primary-button">
                Realizar Pedido
              </button>
            </>
          )}
        </div>
      )}

      <h1 className="servicios-title">Servicios Disponibles ✨</h1>
      <div className="servicios-grid">
        {services.map((service) => (
          <div key={service.id} className="servicios-card">
            <img
              src={service.image}
              alt={service.name}
              className="servicios-image"
            />
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <button
              onClick={() => setModalService(service)}
              className="primary-button"
            >
              Más detalles
            </button>
            <button onClick={() => addToCart(service)} className="add-button">
              Agregar
            </button>
          </div>
        ))}
      </div>

      {modalService && (
        <div className="modal">
          <div className="modal-content">
            <h2>{modalService.name}</h2>
            <p>{modalService.fullDescription}</p>
            <p>
              <strong>Duración:</strong> {modalService.duration}
            </p>
            <p>
              <strong>Precio:</strong> ${modalService.price}
            </p>
            <div className="modal-buttons">
              <button
                onClick={() => navigate("/novedades")}
                className="secondary-button"
              >
                Configurar Horario
              </button>
              <button
                onClick={() => setModalService(null)}
                className="secondary-button"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Servicios;
