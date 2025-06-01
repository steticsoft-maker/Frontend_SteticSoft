// src/features/compras/components/CompraForm.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import ItemSelectionModal from '../../../shared/components/common/ItemSelectionModal';

const CompraForm = ({
  proveedor, setProveedor,
  fecha, setFecha,
  metodoPago, setMetodoPago,
  items, setItems,
  productosPorCategoria, proveedoresList, metodosPagoList,
  subtotal, iva, total
}) => {
  // ... (lógica existente sin cambios) ...
  const [showProveedorSelectModal, setShowProveedorSelectModal] = useState(false);
  const [showProductoSelectModal, setShowProductoSelectModal] = useState(false);

  const handleAgregarProductoRow = () => {
    setShowProductoSelectModal(true); 
  };

  const handleSelectProductoParaAgregar = (productoSeleccionado) => {
    const productoExistente = items.find(item => item.id === productoSeleccionado.id); 

    if (productoExistente) {
      setItems(items.map(item => 
        item.id === productoSeleccionado.id 
        ? { ...item, cantidad: (item.cantidad || 0) + 1, total: ((item.cantidad || 0) + 1) * parseFloat(item.precio) } 
        : item
      ));
    } else {
      setItems([...items, { 
        id: productoSeleccionado.id,
        nombre: productoSeleccionado.nombre, 
        categoria: productoSeleccionado.categoria,
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

    if (campo === 'cantidad' || campo === 'precio') {
        let numValor = parseFloat(valor);
        if (isNaN(numValor)) {
            numValor = campo === 'cantidad' ? 1 : 0;
        }
        item[campo] = Math.max(0, numValor); 
        if (campo === 'cantidad' && item[campo] === 0) item[campo] = 1;
    } else {
        item[campo] = valor;
    }
    item.total = (item.cantidad || 0) * (item.precio || 0);
    setItems(nuevosItems);
  };

  const todosLosProductosParaModal = productosPorCategoria.reduce((acc, cat) => {
    cat.productos.forEach(p => {
      const productoIdUnico = p.id || `prod_${cat.categoria}_${p.nombre.replace(/\s+/g, '_')}`;
      acc.push({ 
        ...p, 
        id: productoIdUnico,
        value: productoIdUnico, 
        label: `${p.nombre} (${cat.categoria}) - $${p.precio ? p.precio.toLocaleString('es-CO') : '0'}`,
        categoria: cat.categoria
      });
    });
    return acc;
  }, []);


  return (
    <>
      {/* ... (resto del formulario: proveedor, fecha, método de pago) ... */}
      <div className="form-group">
        <label htmlFor="proveedorSearch">Proveedor <span className="required-asterisk">*</span>:</label>
        <input
            type="text"
            className="buscar-proveedor-input"
            value={proveedor || ''}
            onClick={() => setShowProveedorSelectModal(true)}
            placeholder="Seleccionar proveedor"
            readOnly
        />
      </div>

      <div className="form-group">
        <label htmlFor="fechaCompra">Fecha de Compra <span className="required-asterisk">*</span>:</label>
        <input type="date" id="fechaCompra" value={fecha} onChange={(e) => setFecha(e.target.value)} className="LaFecha" required />
      </div>

      <div className="form-group">
        <label htmlFor="metodoPago">Método de Pago <span className="required-asterisk">*</span>:</label>
        <select id="metodoPago" className="seleccionar-metodo-pago" value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)} required>
          <option value="">Seleccione un método</option>
          {metodosPagoList.map((metodo, index) => (
            <option key={index} value={metodo}>{metodo}</option>
          ))}
        </select>
      </div>

      <button type="button" className="btn-agregar-producto-compra" onClick={handleAgregarProductoRow}>
        Agregar Producto a la Compra
      </button>

      {items.length > 0 && (
        <div className="agregar-compra-table">
          <table><thead>{/* SIN ESPACIO */}
              <tr>{/* SIN ESPACIO */}
                <th>Categoría</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unit.</th>
                <th>Total</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>{/* SIN ESPACIO */}
              {items.map((item, index) => (
                // CORRECCIÓN AQUÍ: Sin espacio después de <tr...>
                <tr key={item.id || index}>{/* SIN ESPACIO */}
                  <td>
                    <input type="text" value={item.categoria || ''} readOnly className="input-text-readonly" />
                  </td>
                  <td>
                    <input type="text" value={item.nombre || ''} readOnly className="input-text-readonly" />
                  </td>
                  <td>
                    <input
                      className="input-cantidad-precio"
                      type="number"
                      value={item.cantidad || 1}
                      onChange={(e) => handleCambioItem(index, "cantidad", e.target.value)}
                      min="1"
                    />
                  </td>
                  <td>
                    <input
                      className="input-cantidad-precio"
                      type="number"
                      value={item.precio || 0}
                      onChange={(e) => handleCambioItem(index, "precio", e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </td>
                  <td>${item.total ? item.total.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}</td>
                  <td>
                    <button
                      type="button"
                      className="btn-icono-eliminar-producto-compra"
                      onClick={() => handleEliminarProductoRow(index)}
                      title="Eliminar producto"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ... (resto del formulario: totales y modales de selección) ... */}
      <div className="agregar-compra-totales">
        <p>Subtotal: ${subtotal.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p>IVA (19%): ${iva.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p><strong>Total: ${total.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></p>
      </div>

      <ItemSelectionModal
        isOpen={showProveedorSelectModal}
        onClose={() => setShowProveedorSelectModal(false)}
        title="Seleccionar Proveedor"
        items={proveedoresList.map(p => ({ label: p, value: p }))}
        onSelectItem={(selectedItem) => { setProveedor(selectedItem.value); setShowProveedorSelectModal(false); }}
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