import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import ItemSelectionModal from '../../../shared/components/common/ItemSelectionModal';

const CompraForm = ({
  proveedorSeleccionado, 
  setProveedor,
  fecha, setFecha,
  items, setItems,
  productosList, 
  proveedoresList,
  subtotal, iva, total
}) => {
  const [showProveedorSelectModal, setShowProveedorSelectModal] = useState(false);
  const [showProductoSelectModal, setShowProductoSelectModal] = useState(false);

  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getMinDateString = () => {
    const today = new Date();
    const minDate = new Date(today.setFullYear(today.getFullYear() - 5));
    return minDate.toISOString().split("T")[0];
  };

  // CORRECCIÓN CLAVE: Usamos Array.isArray() para una validación más estricta.
  // Si productosList no es un arreglo, devuelve un arreglo vacío y evita el error.
  const todosLosProductosParaModal = useMemo(() => {
    if (!Array.isArray(productosList)) return [];
    return productosList.map(p => ({
      ...p,
      value: p.idProducto,
      label: `${p.nombre} - $${p.precio ? Number(p.precio).toLocaleString('es-CO') : '0'}`
    }));
  }, [productosList]);

  // Misma corrección para proveedoresList.
  const todosLosProveedoresParaModal = useMemo(() => {
    if (!Array.isArray(proveedoresList)) return [];
    return proveedoresList.map(p => ({
        ...p,
        value: p.idProveedor,
        label: p.nombre || 'Proveedor sin nombre'
    }));
  }, [proveedoresList]);

  const handleAgregarProductoRow = () => {
    setShowProductoSelectModal(true); 
  };
  
  // (El resto de tus funciones de manejo de productos e ítems se mantienen igual)
  const handleSelectProductoParaAgregar = (productoSeleccionado) => {
    const itemExistente = items.find(item => item.id === productoSeleccionado.idProducto); 
    if (itemExistente) {
      setItems(items.map(item => 
        item.id === productoSeleccionado.idProducto
        ? { ...item, cantidad: (item.cantidad || 0) + 1, total: ((item.cantidad || 0) + 1) * parseFloat(item.precio) } 
        : item
      ));
    } else {
      setItems([...items, { 
        id: productoSeleccionado.idProducto,
        nombre: productoSeleccionado.nombre, 
        categoria: productoSeleccionado.categoria?.nombre || 'Sin categoría',
        precio: parseFloat(productoSeleccionado.precio),
        cantidad: 1, 
        total: parseFloat(productoSeleccionado.precio)
      }]);
    }
    setShowProductoSelectModal(false);
  };

  const handleEliminarProductoRow = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleCambioItem = (index, campo, valor) => {
    const nuevosItems = [...items];
    const item = nuevosItems[index];
    let numValor = parseFloat(valor);
    if (isNaN(numValor) || numValor < 0) {
        numValor = 0;
    }
    item[campo] = numValor;
    item.total = (item.cantidad || 0) * (item.precio || 0);
    setItems(nuevosItems);
  };

  return (
    <>
      <div className="form-group">
        <label htmlFor="proveedorSearch">Proveedor <span className="required-asterisk">*</span>:</label>
        <input
            type="text"
            className="buscar-proveedor-input"
            value={proveedorSeleccionado?.nombre || ''}
            onClick={() => setShowProveedorSelectModal(true)}
            placeholder="Seleccionar proveedor"
            readOnly
        />
      </div>

      <div className="form-group">
        <label htmlFor="fechaCompra">Fecha de Compra <span className="required-asterisk">*</span>:</label>
        <input 
          type="date" 
          id="fechaCompra" 
          value={fecha} 
          onChange={(e) => setFecha(e.target.value)} 
          className="LaFecha" 
          required 
          max={getTodayString()}
          min={getMinDateString()}
        />
        </div>

      <button type="button" className="btn-agregar-producto-compra" onClick={handleAgregarProductoRow}>
        Agregar Producto a la Compra
      </button>

      {items.length > 0 && (
        <div className="agregar-compra-table">
          <table>
            <thead>
              <tr>
                <th>Categoría</th><th>Producto</th><th>Cantidad</th><th>Precio Unit.</th><th>Total</th><th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id || index}>
                  <td><input type="text" value={item.categoria || ''} readOnly className="input-text-readonly" /></td>
                  <td><input type="text" value={item.nombre || ''} readOnly className="input-text-readonly" /></td>
                  <td><input className="input-cantidad-precio" type="number" value={item.cantidad || 1} onChange={(e) => handleCambioItem(index, "cantidad", e.target.value)} min="1" /></td>
                  <td><input className="input-cantidad-precio" type="number" value={item.precio || 0} onChange={(e) => handleCambioItem(index, "precio", e.target.value)} min="0" step="0.01" /></td>
                  <td>${item.total ? item.total.toLocaleString('es-CO') : '0.00'}</td>
                  <td><button type="button" className="btn-icono-eliminar-producto-compra" onClick={() => handleEliminarProductoRow(index)} title="Eliminar producto"><FontAwesomeIcon icon={faTrash} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="agregar-compra-totales">
        <p>Subtotal: ${subtotal.toLocaleString('es-CO')}</p>
        <p>IVA (19%): ${iva.toLocaleString('es-CO')}</p>
        <p><strong>Total: ${total.toLocaleString('es-CO')}</strong></p>
      </div>

      <ItemSelectionModal
        isOpen={showProveedorSelectModal}
        onClose={() => setShowProveedorSelectModal(false)}
        title="Seleccionar Proveedor"
        items={todosLosProveedoresParaModal}
        onSelectItem={(selectedItem) => { setProveedor(selectedItem); setShowProveedorSelectModal(false); }}
        searchPlaceholder="Buscar proveedor..."
      />
      <ItemSelectionModal
        isOpen={showProductoSelectModal}
        onClose={() => setShowProductoSelectModal(false)}
        title="Seleccionar Producto para Compra"
        items={todosLosProductosParaModal} 
        onSelectItem={handleSelectProductoParaAgregar}
        searchPlaceholder="Buscar producto..."
      />
    </>
  );
};

export default CompraForm;