// src/shared/components/common/ItemSelectionModal.jsx
import React, { useState, useMemo } from "react";
import "./ItemSelectionModal.css"; // Crea este archivo CSS

const ItemSelectionModal = ({
  isOpen,
  onClose,
  title,
  items, // Array de objetos, se espera que cada objeto tenga al menos 'value' y 'label'
  // Ejemplo: [{ value: 'id1', label: 'Nombre Item 1', otherData: '...' }]
  // o un string si 'items' es un array de strings
  onSelectItem, // Recibe el item completo seleccionado (o solo el 'value' si se prefiere)
  searchPlaceholder = "Buscar...",
  emptyStateMessage = "No se encontraron coincidencias.",
  multiSelect = false, // Nueva prop para selección múltiple (no implementada en este ejemplo básico)
  renderItem, // Nueva prop para personalizar cómo se renderiza cada ítem en la lista
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) {
    return null;
  }

  const filteredItems = useMemo(() => {
    if (!items) return [];
    return items.filter((item) => {
      const label =
        typeof item === "object"
          ? String(item.label || item.nombre || item.value)
          : String(item);
      return label.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [items, searchTerm]);

  const defaultRenderItem = (item, handleSelect) => {
    const label =
      typeof item === "object" ? item.label || item.nombre || item.value : item;
    const key =
      typeof item === "object"
        ? item.value || item.id || JSON.stringify(item)
        : item;
    return (
      <li key={key} className="selection-modal-item">
        <button type="button" onClick={() => handleSelect(item)}>
          {label}
        </button>
      </li>
    );
  };

  const currentRenderItem = renderItem || defaultRenderItem;

  const handleSelect = (item) => {
    onSelectItem(item); // Devuelve el objeto item completo
    if (!multiSelect) {
      // Cierra el modal si no es selección múltiple
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
        {/* Botón de cerrar podría ser opcional si ya hay 'X' en el header */}
        {/* <div className="shared-modal-actions">
          <button type="button" className="shared-modal-button shared-modal-button-cancel" onClick={onClose}>
            Cerrar
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default ItemSelectionModal;
