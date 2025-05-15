import React, { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa"; // Ícono de carrito
import { useNavigate } from "react-router-dom"; // Hook para redirección
import Navbar from "../../components/Navbar/Navbar";
import "./Servicios.css"; // Asegúrate de que este archivo tenga los estilos actualizados

function Servicios() {
  const navigate = useNavigate(); // Hook para manejar redirecciones
  const [services, setServices] = useState(() => {
    // Leer los servicios desde localStorage (la misma clave que en la sección admin)
    const storedServices = localStorage.getItem("servicios");
    return storedServices ? JSON.parse(storedServices) : [];
  });
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false); // Estado para mostrar/ocultar el carrito
  const [selectedSchedule, setSelectedSchedule] = useState(""); // Estado para el horario

  // Cargar carrito y horario desde localStorage (sin cambios)
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

      <h1 className="servicios-title">Servicios Disponibles</h1>
      <div className="servicios-grid">
        {services.map((service) => (
          <div key={service.id} className="servicios-card">
            {service.imagenURL && ( // Mostrar la imagen si existe la URL
              <img
                src={service.imagenURL}
                alt={service.nombre}
                className="servicios-image"
                style={{ height: 'auto' }} // Ajusta la altura según necesites
              />
            )}
            <h3>{service.nombre}</h3>
            <p>{service.description || service.categoria || ''}</p> {/* Usar descripción o categoría si la descripción no está */}
            <button onClick={() => addToCart(service)} className="botonAgregarServicio"> {/* Cambiar la clase del botón */}
              Agregar
            </button>
          </div>
        ))}
      </div>

      {/* Eliminamos la lógica del modal de "Más detalles" */}
    </div>
  );
}

export default Servicios;