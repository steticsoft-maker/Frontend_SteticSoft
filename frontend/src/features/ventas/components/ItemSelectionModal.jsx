// src/features/ventas/components/ItemSelectionModal.jsx
// O usa el genérico: src/shared/components/common/ItemSelectionModal.jsx
import React, { useState } from 'react';
import '../css/ProcesoVentas.css'; // Para las clases .catalogo-emergente, .search-bar, .cerrar-button

const ItemSelectionModal = ({
  isOpen,
  onClose,
  title,
  items, // Array de objetos { id, nombre, precio (opcional), documento (opcional), tipo (producto/servicio/cliente) }
  onSelectItem,
  searchPlaceholder = "Buscar...",
  // displayFields // Podríamos simplificar y siempre mostrar 'nombre' y opcionalmente 'precio' o 'documento'
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredItems = items.filter(item =>
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.documento && item.documento.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getItemDisplayLabel = (item) => {
    let label = item.nombre;
    if (item.documento) { // Para clientes
      label += ` - Doc: ${item.documento}`;
    }
    if (item.precio !== undefined) { // Para productos/servicios
      label += ` - $${item.precio.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
    return label;
  };

  return (
    // Clases del CSS original ProcesoVentas.css
    <div className="catalogo-emergente"> {/* O una clase de modal genérica si la tienes */}
      <h3>{title}</h3>
      <div className="search-bar">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <ul>
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <li key={item.id || item.nombre}> {/* Usar un ID único del item */}
              {getItemDisplayLabel(item)}
              <button onClick={() => { onSelectItem(item); onClose(); }}>
                Seleccionar
              </button>
            </li>
          ))
        ) : (
          <li>No se encontraron coincidencias para "{searchTerm}".</li>
        )}
      </ul>
      <button className="cerrar-button" onClick={onClose}>
        Cerrar
      </button>
    </div>
  );
};

export default ItemSelectionModal;