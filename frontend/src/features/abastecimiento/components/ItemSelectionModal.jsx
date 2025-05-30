// src/features/abastecimiento/components/ItemSelectionModal.jsx
// O idealmente en src/shared/components/common/SelectionModal.jsx
import React, { useState } from 'react';

const ItemSelectionModal = ({
  isOpen,
  onClose,
  title,
  items, // Array de strings o de objetos { value, label }
  onSelectItem,
  searchPlaceholder = "Buscar..."
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredItems = items.filter(item => {
    const label = typeof item === 'object' ? item.label : item;
    return label.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="modal-abastecimiento-overlay"> {/* Usar prefijo de la feature o una clase genérica */}
      <div className="modal-abastecimiento-selection-container"> {/* Ajustar clase */}
        <h2>{title}</h2>
        <input
          className="modal-selection-input-abastecimiento" // Ajustar clase
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ul className="modal-selection-list-abastecimiento"> {/* Ajustar clase */}
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => {
              const value = typeof item === 'object' ? item.value : item;
              const label = typeof item === 'object' ? item.label : item;
              return (
                <li key={typeof item === 'object' ? item.value : index}>
                  <button onClick={() => { onSelectItem(value); onClose(); }}>
                    {label}
                  </button>
                </li>
              );
            })
          ) : (
            <li>No se encontraron coincidencias.</li>
          )}
        </ul>
        <button className="modal-abastecimiento-button-cerrar" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ItemSelectionModal;