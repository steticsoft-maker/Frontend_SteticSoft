// src/shared/contexts/CartContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState('');

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('steticSoftCart')) || [];
    setCartItems(storedCart);
    const storedSchedule = localStorage.getItem('steticSoftSchedule') || '';
    setSelectedSchedule(storedSchedule);
  }, []);

  useEffect(() => {
    localStorage.setItem('steticSoftCart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (selectedSchedule) {
        localStorage.setItem('steticSoftSchedule', selectedSchedule);
    } else {
        localStorage.removeItem('steticSoftSchedule');
    }
  }, [selectedSchedule]);


  const addItemToCart = useCallback((item, type) => { // type puede ser 'product' o 'service'
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id && i.type === type);
      if (existingItem) {
        return prevItems.map(i =>
          i.id === item.id && i.type === type
            ? { ...i, quantity: (i.quantity || 0) + 1 }
            : i
        );
      }
      return [...prevItems, { ...item, quantity: 1, type }];
    });
  }, []);

  const removeItemFromCart = useCallback((itemId, type) => {
    setCartItems(prevItems => prevItems.filter(i => !(i.id === itemId && i.type === type)));
  }, []);

  const updateItemQuantity = useCallback((itemId, type, quantity) => {
    setCartItems(prevItems =>
      prevItems.map(i =>
        i.id === itemId && i.type === type
          ? { ...i, quantity: Math.max(0, quantity) } // No permitir cantidad negativa
          : i
      ).filter(i => i.quantity > 0) // Eliminar si la cantidad es 0
    );
  }, []);

  const clearCartByType = useCallback((type) => {
    setCartItems(prevItems => prevItems.filter(i => i.type !== type));
  }, []);

  const clearAllCart = useCallback(() => {
    setCartItems([]);
    // setSelectedSchedule(''); // Decidir si el horario también se limpia aquí
  }, []);

  const getCartTotalByType = useCallback((type) => {
    return cartItems
      .filter(item => item.type === type)
      .reduce((total, item) => total + item.price * (item.quantity || 0), 0);
  }, [cartItems]);

  const getOverallTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.price * (item.quantity || 0), 0);
  }, [cartItems]);


  const value = {
    cartItems,
    addItemToCart,
    removeItemFromCart,
    updateItemQuantity,
    clearCartByType,
    clearAllCart,
    getCartTotalByType,
    getOverallTotal,
    selectedSchedule,
    setSelectedSchedule,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};