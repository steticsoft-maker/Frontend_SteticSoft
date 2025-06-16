// src/features/home/pages/PublicProductosPage.jsx
import React, { useState, useEffect, useRef } from 'react'; // useContext para Auth o Cart - removed
import { FaShoppingCart } from 'react-icons/fa';
import Navbar from '../../../shared/components/layout/Navbar';
import ProductCard from '../components/ProductCard'; // Nuevo componente
// import { CartContext } from '../../../shared/contexts/CartContext'; // Si creas un CartContext
import '../css/PublicProductos.css'; // Nueva ruta CSS

// Datos hardcodeados por ahora, luego vendrán de un servicio
const initialProducts = [
  { id: 1, name: "Shampoo Hidratante", image: "https://www.oboticario.com.co/cdn/shop/files/52076-3-MATCH-SHAMP-CIEN-CURV-300ml_1500x.jpg?v=1727714610", price: 25000, description: "Limpieza profunda y brillo natural" },
  // ...otros productos
];

function PublicProductosPage() {
  const [products] = useState(initialProducts); // Más adelante: useEffect para fetchProducts - setProducts removed
  const [cart, setCart] = useState([]); // O usar CartContext
  const [showCart, setShowCart] = useState(false);
  const productosPageRef = useRef(null); // Renombrado para claridad

  // Lógica del carrito (podría moverse a useCart() o CartContext)
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('publicCart')) || []; // Usar clave diferente si el admin tiene otro carrito
    setCart(savedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem('publicCart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (productosPageRef.current) {
      productosPageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingProduct = prevCart.find(item => item.id === product.id && item.type === 'product');
      if (existingProduct) {
        return prevCart.map(item =>
          item.id === product.id && item.type === 'product'
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1, type: 'product' }];
    });
  };

  const handleOrder = () => {
    alert('Tu pedido ha sido registrado. El pago será contra entrega. ¡Gracias por comprar con nosotros!');
    setCart([]);
    localStorage.removeItem('publicCart');
  };

  const getTotal = () => {
    return cart.reduce((total, item) => {
      if (item.type === 'product') return total + item.price * item.quantity;
      return total;
    }, 0);
  };
  // Fin lógica del carrito

  return (
    <div className="public-productos-page"> {/* Renombrado */}
      <Navbar />

      <div className="public-cart-icon" onClick={() => setShowCart(!showCart)}>
        <FaShoppingCart size={30} />
        {cart.filter(item => item.type === 'product').length > 0 && (
          <span className="public-cart-count">{cart.filter(item => item.type === 'product').reduce((acc, item) => acc + item.quantity, 0)}</span>
        )}
      </div>

      {showCart && (
        <div className="public-cart-modal">
          <h2>Carrito de Productos</h2>
          {cart.filter(item => item.type === 'product').length === 0 ? (
            <p>No hay productos en el carrito.</p>
          ) : (
            <>
              <ul>
                {cart.filter(item => item.type === 'product').map((item) => (
                  <li key={`cart-prod-${item.id}`}>
                    {item.name} - {item.quantity} x ${item.price.toFixed(2)} = ${(item.price * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
              <h3>Total Productos: ${getTotal().toFixed(2)}</h3>
              <button onClick={handleOrder} className="public-primary-button">
                Realizar Pedido
              </button>
            </>
          )}
        </div>
      )}

      <h1 className="public-productos-title" ref={productosPageRef}>
        Productos Disponibles
      </h1>
      <div className="public-productos-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
        ))}
      </div>
    </div>
  );
}
export default PublicProductosPage;