// src/shared/components/common/ItemSelectionModal.jsx
import React, { useState, useMemo } from "react";
import "./ItemSelectionModal.css";

const ItemSelectionModal = ({
  isOpen,
  onClose,
  title,
  items,
  onSelectItem,
  searchPlaceholder = "Buscar...",
  emptyStateMessage = "No se encontraron coincidencias.",
  multiSelect = false,
  renderItem,
}) => {
  // Hook 1: useState (siempre se llama)
  const [searchTerm, setSearchTerm] = useState("");

  // Hook 2: useMemo (siempre se llama, incluso si isOpen es false inicialmente)
  const filteredItems = useMemo(() => {
    if (!isOpen || !items) return []; // Devolver array vacío si no está abierto o no hay ítems
                                    // para que el map posterior no falle.
    return items.filter((item) => {
      const label =
        typeof item === "object"
          ? String(item.label || item.nombre || item.value) // Asegurar que String() maneje null/undefined
          : String(item);
      return label.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [items, searchTerm, isOpen]); // Añadir isOpen a las dependencias de useMemo si su lógica depende de él.

  // Retorno temprano DESPUÉS de todas las llamadas a Hooks
  if (!isOpen) {
    return null;
  }

  // Lógica de renderizado que usa filteredItems
  const defaultRenderItem = (item, handleSelect) => {
    const labelText = // Renombrada para evitar conflicto con 'label' de la función externa
      typeof item === "object" ? item.label || item.nombre || item.value : item;
    const key =
      typeof item === "object"
        ? item.value || item.id || JSON.stringify(item)
        : item;
    return (
      <li key={key} className="selection-modal-item">
        <button type="button" onClick={() => handleSelect(item)}>
          {String(labelText)} {/* Asegurar que sea string */}
        </button>
      </li>
    );
  };

  const currentRenderItem = renderItem || defaultRenderItem;

  const handleSelect = (item) => {
    onSelectItem(item);
    if (!multiSelect) {
      onClose();
    }
  };

  return (
    <div className="shared-modal-overlay item-selection-modal-overlay">
      <div className="shared-modal-content item-selection-modal-content">
        <div className="item-selection-modal-header">
          <h2 className="shared-modal-title">{title || "Seleccionar Ítem"}</h2>
          <button
            type="button"
            className="item-selection-modal-close-btn"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="item-selection-modal-search-container">
          <input
            type="text"
            className="item-selection-modal-search-input"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <ul className="item-selection-modal-list">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => currentRenderItem(item, handleSelect))
          ) : (
            <li className="selection-modal-empty-state">{emptyStateMessage}</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ItemSelectionModal;