
import React, { useState, useMemo } from 'react';
import './ItemSelectionModal.css'; // Asegúrate de crear este archivo CSS

const ItemSelectionModal = ({
    isOpen,
    onClose,
    onSelectItem,
    items = [],
    title = "Seleccionar un item",
    searchPlaceholder = "Buscar...",
    itemKey, // La propiedad que sirve como ID único (ej: 'idProducto', 'id_usuario')
    itemName   // La propiedad que se muestra como nombre (ej: 'nombre')
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredItems = useMemo(() => {
        if (!searchTerm) {
            return items;
        }
        return items.filter(item =>
            item[itemName]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [items, searchTerm, itemName]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="item-selection-modal-overlay" onClick={onClose}>
            <div className="item-selection-modal-content" onClick={e => e.stopPropagation()}>
                <div className="item-selection-modal-header">
                    <h2 className="shared-modal-title">{title}</h2>
                    <button onClick={onClose} className="item-selection-modal-close-btn">&times;</button>
                </div>

                <div className="item-selection-modal-search-container">
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        className="item-selection-modal-search-input"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                <ul className="item-selection-modal-list">
                    {filteredItems.length > 0 ? (
                        filteredItems.map(item => (
                            <li key={item[itemKey]} className="selection-modal-item">
                                <button onClick={() => onSelectItem(item)}>
                                    {item[itemName]}
                                </button>
                            </li>
                        ))
                    ) : (
                        <li className="selection-modal-empty-state">
                            No se encontraron resultados.
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default ItemSelectionModal;