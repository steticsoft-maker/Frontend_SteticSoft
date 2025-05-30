// src/features/compras/components/CompraForm.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import ItemSelectionModal from '../../../shared/components/common/ItemSelectionModal'; // Genérico

const CompraForm = ({
  proveedor, setProveedor,
  fecha, setFecha,
  metodoPago, setMetodoPago,
  items, setItems,
  productosPorCategoria, proveedoresList, metodosPagoList,
  subtotal, iva, total
}) => {

  const [showProveedorSelectModal, setShowProveedorSelectModal] = useState(false);
  const [showProductoSelectModal, setShowProductoSelectModal] = useState(false);
  const [currentProductoCategoria, setCurrentProductoCategoria] = useState('');

  const handleAgregarProductoRow = () => {
      // Abre modal para seleccionar categoría y luego producto
      // O un modal que liste todos los productos disponibles para compra
      setShowProductoSelectModal(true); 
  };

  const handleSelectProductoParaAgregar = (productoSeleccionado) => {
     // productoSeleccionado es el objeto {nombre, precio, categoria}
     const productoExistente = items.find(item => item.nombre === productoSeleccionado.nombre && item.categoria === productoSeleccionado.categoria);
     if (productoExistente) {
        setItems(items.map(item => item.nombre === productoSeleccionado.nombre ? {...item, cantidad: item.cantidad + 1, total: (item.cantidad + 1) * item.precio } : item));
     } else {
        setItems([...items, { ...productoSeleccionado, cantidad: 1, total: productoSeleccionado.precio }]);
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
        const numValor = parseFloat(valor) || 0;
        item[campo] = Math.max(0, numValor); // No permitir negativos
    } else {
        item[campo] = valor;
    }
    item.total = (item.cantidad || 0) * (item.precio || 0);
    setItems(nuevosItems);
  };

  // Aplanar productos para el modal de selección
  const todosLosProductosDisponibles = productosPorCategoria.reduce((acc, cat) => {
    cat.productos.forEach(p => acc.push({ ...p, categoria: cat.categoria, label: `<span class="math-inline">\{p\.nombre\} \(</span>{cat.categoria}) - $${p.precio}`, value: p.nombre }));
    return acc;
  }, []);


  return (
    <>
      <div className="form-group"> {/* Clase del CSS original */}
        <label htmlFor="proveedorSearch">Proveedor <span className="required-asterisk">*</span>:</label>
        <input
            type="text"
            className="buscar-proveedor-input" // Clase del CSS original
            value={proveedor}
            onClick={() => setShowProveedorSelectModal(true)} // Abre modal al hacer clic
            placeholder="Seleccionar proveedor"
            readOnly // Para forzar selección desde modal
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
        <div className="agregar-compra-table"> {/* Clase del CSS original */}
          <table>
            <thead>
              <tr>
                <th>Categoría</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unit.</th>
                <th>Total</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>
                    {/* Podrías hacer el select de categoría editable o mostrarlo como texto */}
                    <input type="text" value={item.categoria} readOnly className="input-text-readonly" />
                  </td>
                  <td>
                    <input type="text" value={item.nombre} readOnly className="input-text-readonly" />
                  </td>
                  <td>
                    <input
                      className="input-cantidad-precio" /* Clase del CSS original */
                      type="number"
                      value={item.cantidad}
                      onChange={(e) => handleCambioItem(index, "cantidad", e.target.value)}
                      min="1"
                    />
                  </td>
                  <td>
                    <input
                      className="input-cantidad-precio"
                      type="number"
                      value={item.precio}
                      onChange={(e) => handleCambioItem(index, "precio", e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </td>
                  <td>${item.total ? item.total.toFixed(2) : '0.00'}</td>
                  <td>
                    <button
                      type="button"
                      className="btn-icono-eliminar-producto-compra" /* Clase del CSS original */
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

      <div className="agregar-compra-totales"> {/* Clase del CSS original */}
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>IVA (19%): ${iva.toFixed(2)}</p>
        <p><strong>Total: ${total.toFixed(2)}</strong></p>
      </div>

      {/* Modales de Selección */}
      <ItemSelectionModal
        isOpen={showProveedorSelectModal}
        onClose={() => setShowProveedorSelectModal(false)}
        title="Seleccionar Proveedor"
        items={proveedoresList.map(p => ({ label: p, value: p }))}
        onSelectItem={(selected) => { setProveedor(selected); setShowProveedorSelectModal(false); }}
        searchPlaceholder="Buscar proveedor..."
      />
      <ItemSelectionModal
        isOpen={showProductoSelectModal}
        onClose={() => setShowProductoSelectModal(false)}
        title="Seleccionar Producto para Compra"
        items={todosLosProductosDisponibles} // Ya tiene label y value
        onSelectItem={handleSelectProductoParaAgregar} // Esta función espera el objeto completo
        searchPlaceholder="Buscar producto..."
      />
    </>
  );
};
export default CompraForm;