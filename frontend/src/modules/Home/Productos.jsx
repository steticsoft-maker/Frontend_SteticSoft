import React, { useState, useEffect, useRef } from "react";
import { FaShoppingCart } from "react-icons/fa"; // Ícono de carrito
import Navbar from "../../components/Navbar"; // Componente Navbar
import "./Productos.css";

function Productos() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Shampoo Hidratante",
      image: "https://www.oboticario.com.co/cdn/shop/files/52076-3-MATCH-SHAMP-CIEN-CURV-300ml_1500x.jpg?v=1727714610",
      price: 25000,
      description: "Limpieza profunda y brillo natural",
      weight: "500ml",
      fullDescription:
        "Shampoo ideal para cabello seco, ayuda a hidratar profundamente y aporta suavidad.",
    },
    {
      id: 2,
      name: "Tratamiento Capilar Keratina",
      image: "https://cdn.pixabay.com/photo/2020/10/30/13/22/cosmetics-5699635_960_720.jpg",
      price: 40000,
      description: "Repara y fortalece tu cabello",
      weight: "300ml",
      fullDescription:
        "Tratamiento con keratina que reestructura el cabello dañado y reduce el frizz.",
    },
    {
      id: 3,
      name: "Gel para Cabello",
      image: "https://cdn.pixabay.com/photo/2021/03/31/13/46/hair-gel-6140266_960_720.jpg",
      price: 15000,
      description: "Fijación fuerte sin residuos",
      weight: "250g",
      fullDescription:
        "Gel profesional de larga duración, no deja residuos y mantiene el peinado todo el día.",
    },
    {
      id: 4,
      name: "Cera para Cabello",
      image: "https://cdn.pixabay.com/photo/2021/06/06/19/16/hair-wax-6315070_960_720.jpg",
      price: 18000,
      description: "Control total con acabado natural",
      weight: "100g",
      fullDescription:
        "Cera ideal para estilos definidos con textura y brillo natural.",
    },
    {
      id: 5,
      name: "Tijeras Profesionales",
      image: "https://cdn.pixabay.com/photo/2016/11/22/23/44/barber-1853931_960_720.jpg",
      price: 70000,
      description: "Acero inoxidable de alta precisión",
      weight: "200g",
      fullDescription:
        "Tijeras profesionales para corte de cabello, ideales para estilistas exigentes.",
    },
    {
      id: 6,
      name: "Peine de Carbono",
      image: "https://cdn.pixabay.com/photo/2016/10/21/20/59/hairbrush-1751262_960_720.jpg",
      price: 8000,
      description: "Antiestático y resistente al calor",
      weight: "50g",
      fullDescription:
        "Peine ideal para cortes y secado con secador. Resistente y flexible.",
    },
    {
      id: 7,
      name: "Labial",
      image: "https://cdn.pixabay.com/photo/2014/10/22/18/04/lipstick-498871_960_720.jpg",
      price: 22000,
      description: "Color intenso y labios humectados todo el día",
      weight: "4g",
      fullDescription:
        "Labial de larga duración con fórmula cremosa que hidrata y protege tus labios. Disponible en tonos vibrantes y elegantes para cada ocasión.",
    },
  ]);

  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false); // Estado para mostrar/ocultar el carrito

  const productosRef = useRef(null); // 🔹 Referencia para scroll automático

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (productosRef.current) {
      productosRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

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

      <h1 className="productos-title" ref={productosRef}>
        Productos Disponibles
      </h1>

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
