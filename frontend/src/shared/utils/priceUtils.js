// src/shared/utils/priceUtils.js

/**
 * Convierte un valor a número de forma segura
 * @param {any} value - El valor a convertir
 * @param {number} defaultValue - Valor por defecto si la conversión falla
 * @returns {number} - El número convertido o el valor por defecto
 */
export const safeParseFloat = (value, defaultValue = 0) => {
  if (typeof value === "number" && !isNaN(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  return defaultValue;
};

/**
 * Formatea un precio con el número de decimales especificado
 * @param {any} price - El precio a formatear
 * @param {number} decimals - Número de decimales (por defecto 0)
 * @returns {string} - El precio formateado
 */
export const formatPrice = (price, decimals = 0) => {
  const safePrice = safeParseFloat(price);
  return safePrice.toFixed(decimals);
};

/**
 * Calcula el total de un array de items
 * @param {Array} items - Array de items con price y quantity
 * @param {string} priceField - Campo del precio (por defecto 'price')
 * @param {string} quantityField - Campo de la cantidad (por defecto 'quantity')
 * @returns {number} - El total calculado
 */
export const calculateTotal = (
  items,
  priceField = "price",
  quantityField = "quantity"
) => {
  return items.reduce((total, item) => {
    const price = safeParseFloat(item[priceField]);
    const quantity = safeParseFloat(item[quantityField], 1);
    return total + price * quantity;
  }, 0);
};
