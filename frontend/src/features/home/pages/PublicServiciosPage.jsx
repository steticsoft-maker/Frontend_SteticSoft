import React, { useState, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import Navbar from '../../../shared/components/layout/Navbar';
import ServiceCard from '../components/ServiceCard';
import Footer from '../../../shared/components/layout/Footer';
import '../css/Home.css';

function PublicServiciosPage() {
  const [services, setServices] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState('');

  useEffect(() => {
    const storedServices = JSON.parse(localStorage.getItem('servicios')) || [];
    setServices(storedServices.filter(s => s.estado === "Activo"));
  }, []);

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
            ? { ...item, quantity: (item.quantity || 0) + 1 }
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
    setCart(prevCart => prevCart.filter(item => item.type !== 'service'));
  };

  const getTotal = () => {
    return cart.reduce((total, item) => {
        if (item.type === 'service') return total + (item.precio || 0) * (item.quantity || 0);
        return total;
    }, 0);
  };

  return (
    <div className="public-servicios-page">
      <Navbar />
      <div className="cart-icon" onClick={() => setShowCart(!showCart)}>
        <FaShoppingCart size={30} />
        {cart.filter(item => item.type === 'service').length > 0 && (
          <span className="cart-count">{cart.filter(item => item.type === 'service').reduce((acc, item) => acc + item.quantity, 0)}</span>
        )}
      </div>

      {showCart && (
        <div className="cart-modal">
          <h2>Carrito de Servicios</h2>
          {cart.filter(item => item.type === 'service').length === 0 ? (
            <p>No hay servicios en el carrito.</p>
          ) : (
            <>
              <ul>
                {cart.filter(item => item.type === 'service').map((item) => (
                   <li key={`cart-serv-${item.id}`}>
                    {item.nombre} - {item.quantity || 1} x ${item.precio.toFixed(2)} = ${(item.precio * (item.quantity || 1)).toFixed(2)}
                  </li>
                ))}
              </ul>
              <p><strong>Horario Seleccionado:</strong> {selectedSchedule}</p>
              <h3>Total Servicios: ${getTotal().toFixed(2)}</h3>
              <button onClick={handleOrder} className="primary-button">
                Realizar Pedido
              </button>
            </>
          )}
        </div>
      )}

      <div className="page-header">
        <h1>Servicios Disponibles</h1>
      </div>
      <div className="servicios-grid">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} onAddToCart={addToCart} />
        ))}
      </div>
      <Footer />
    </div>
  );
}
export default PublicServiciosPage;