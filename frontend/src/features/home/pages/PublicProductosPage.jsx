// src/features/home/pages/PublicProductosPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { FaShoppingCart } from "react-icons/fa";
import ProductCard from "../components/ProductCard";
import { getPublicProducts } from "../services/publicProductosService";
import Footer from "../../../shared/components/layout/Footer";
import "../css/PublicProductos.css";

function PublicProductosPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const productosPageRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getPublicProducts();
        const data = response.data;

        const productos = data.data?.productos || [];

        const productosAdaptados = productos.map((p) => ({
          id: p.idProducto,
          name: p.nombre,
          image: p.imagen,
          price: p.precio,
          description: p.descripcion,
          categoryName: p.categoria?.nombre,
        }));

        setProducts(productosAdaptados);
      } catch (err) {
        // Error silencioso para producción
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (productosPageRef.current) {
      productosPageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("productCart")) || [];
    setCart(savedCart);
  }, []);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      let newCart;
      if (existingProduct) {
        newCart = prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...prevCart, { ...product, quantity: 1 }];
      }

      // Guardar en localStorage
      localStorage.setItem("productCart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const handleOrder = () => {
    alert("Tu pedido ha sido registrado. ¡Gracias por comprar con nosotros!");
    setCart([]);
    localStorage.removeItem("productCart");
  };

  const getTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.price || 0) * item.quantity;
    }, 0);
  };

  return (
    <div className="productos-page">
      <div className="cart-icon" onClick={() => setShowCart(!showCart)}>
        <FaShoppingCart size={30} />
        {cart.length > 0 && (
          <span className="cart-count">
            {cart.reduce((acc, item) => acc + item.quantity, 0)}
          </span>
        )}
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
                  <li key={`cart-prod-${item.id}`}>
                    {item.name} - {item.quantity} x $
                    {item.price?.toFixed(0) || 0} = $
                    {(item.price * item.quantity).toFixed(0)}
                  </li>
                ))}
              </ul>
              <h3>Total: ${getTotal().toFixed(0)}</h3>
              <button onClick={handleOrder} className="primary-button">
                Realizar Pedido
              </button>
            </>
          )}
        </div>
      )}

      <h1 className="productos-title" ref={productosPageRef}>
        Productos Disponibles
      </h1>

      <div className="productos-grid-wrapper">
        <div className="productos-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default PublicProductosPage;
