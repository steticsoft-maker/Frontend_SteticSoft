import React, { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa"; // Ícono de carrito
import Navbar from "../../components/Navbar"; // Componente Navbar
import "./Productos.css";

function Productos() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Manzanas",
      image: "ruta-a-la-imagen", // Reemplazar con una URL válida
      price: 3,
      description: "Manzanas frescas y jugosas",
      weight: "1kg",
      fullDescription:
        "Manzanas frescas, ideales para ensaladas y snacks saludables.",
    },
    {
      id: 2,
      name: "Plátanos",
      image: "ruta-a-la-imagen", // Reemplazar con una URL válida
      price: 2,
      description: "Plátanos maduros",
      weight: "1.5kg",
      fullDescription:
        "Plátanos maduros listos para consumo, ideales para postres o snacks saludables.",
    },
    // Más productos...
  ]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false); // Estado para mostrar/ocultar el carrito

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const handleOrder = () => {
    alert(
      "Tu pedido ha sido registrado. El pago será contra entrega. ¡Gracias por comprar con nosotros!"
    );
    setCart([]); // Vaciamos el carrito después del pedido
    localStorage.removeItem("cart"); // Eliminamos los datos del carrito en localStorage
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="productos-page">
      <Navbar />

      <div className="cart-icon" onClick={() => setShowCart(!showCart)}>
        <FaShoppingCart size={30} />
        {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
      </div>

      {showCart && (
        <div className="cart-modal">
          <h2>Carrito de Productos</h2>
          {cart.length === 0 ? (
            <p>No hay productos en el carrito.</p>
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

      <h1 className="productos-title">✨ Productos Disponibles ✨</h1>
      <div className="productos-grid">
        {products.map((product) => (
          <div key={product.id} className="productos-card">
            <img
              src={product.image}
              alt={product.name}
              className="productos-image"
            />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <button onClick={() => addToCart(product)} className="add-button">
              Agregar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Productos;
