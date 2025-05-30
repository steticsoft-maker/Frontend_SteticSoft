// src/features/home/pages/PublicServiciosPage.jsx
import React, { useState, useEffect, useContext } from 'react'; // useContext
import { FaShoppingCart } from 'react-icons/fa';
import Navbar from '../../../shared/components/layout/Navbar';
import ServiceCard from '../components/ServiceCard'; // Nuevo componente
// import { CartContext } from '../../../shared/contexts/CartContext'; // Si creas un CartContext
import '../css/PublicServicios.css'; // Nueva ruta CSS

function PublicServiciosPage() {
  const [services, setServices] = useState([]);
  const [cart, setCart] = useState([]); // O usar CartContext
  const [showCart, setShowCart] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState('');

  // Cargar servicios (desde localStorage por ahora)
  useEffect(() => {
    const storedServices = JSON.parse(localStorage.getItem('servicios')) || [];
    setServices(storedServices.filter(s => s.estado === "Activo")); // Mostrar solo activos
  }, []);

  // Lógica del carrito (podría moverse a useCart() o CartContext)
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('publicCart')) || [];
    setCart(savedCart);
    const savedSchedule = localStorage.getItem('selectedSchedule') || 'No seleccionado';
    setSelectedSchedule(savedSchedule);
  }, []);

  useEffect(() => {
    localStorage.setItem('publicCart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (service) => {
     setCart(prevCart => {
      const existingService = prevCart.find(item => item.id === service.id && item.type === 'service');
      if (existingService) {
        return prevCart.map(item =>
          item.id === service.id && item.type === 'service'
            ? { ...item, quantity: (item.quantity || 0) + 1 } // Asegurar que quantity exista
            : item
        );
      }
      return [...prevCart, { ...service, quantity: 1, type: 'service' }];
    });
  };

  const handleOrder = () => {
    if (cart.filter(item => item.type === 'service').length === 0) {
        alert("No hay servicios en el carrito para pedir.");
        return;
    }
    if (selectedSchedule === "No seleccionado" || !selectedSchedule) {
        alert("Por favor, selecciona un horario en la sección de Novedades antes de realizar el pedido del servicio.");
        return;
    }
    alert(
      `Tu pedido de servicio ha sido registrado con éxito.\nHorario seleccionado: ${selectedSchedule}.\nGracias por utilizar nuestros servicios. \nEl pago debe ser realizado al finalizar el servicio.`
    );
    // Limpiar solo los servicios del carrito
    setCart(prevCart => prevCart.filter(item => item.type !== 'service'));
    // No limpiar selectedSchedule aquí, puede que el usuario quiera más servicios con ese horario.
    // localStorage.removeItem('selectedSchedule'); // Esto se podría manejar después de un flujo de pago completo
  };

  const getTotal = () => {
    return cart.reduce((total, item) => {
        if (item.type === 'service') return total + item.price * (item.quantity || 0);
        return total;
    }, 0);
  };
  // Fin lógica del carrito

  return (
    <div className="public-servicios-page"> {/* Renombrado */}
      <Navbar />
       <div className="public-cart-icon" onClick={() => setShowCart(!showCart)}>
        <FaShoppingCart size={30} />
        {cart.filter(item => item.type === 'service').length > 0 && (
          <span className="public-cart-count">{cart.filter(item => item.type === 'service').reduce((acc, item) => acc + item.quantity, 0)}</span>
        )}
      </div>

      {showCart && (
        <div className="public-cart-modal">
          <h2>Carrito de Servicios</h2>
          {cart.filter(item => item.type === 'service').length === 0 ? (
            <p>No hay servicios en el carrito.</p>
          ) : (
            <>
              <ul>
                {cart.filter(item => item.type === 'service').map((item) => (
                   <li key={`cart-serv-${item.id}`}>
                    {item.nombre} - {item.quantity || 1} x ${item.price.toFixed(2)} = ${(item.price * (item.quantity || 1)).toFixed(2)}
                  </li>
                ))}
              </ul>
              <p><strong>Horario Seleccionado:</strong> {selectedSchedule}</p>
              <h3>Total Servicios: ${getTotal().toFixed(2)}</h3>
              <button onClick={handleOrder} className="public-primary-button">
                Realizar Pedido
              </button>
            </>
          )}
        </div>
      )}

      <h1 className="public-servicios-title">Servicios Disponibles</h1>
      <div className="public-servicios-grid">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} onAddToCart={addToCart} />
        ))}
      </div>
    </div>
  );
}
export default PublicServiciosPage;