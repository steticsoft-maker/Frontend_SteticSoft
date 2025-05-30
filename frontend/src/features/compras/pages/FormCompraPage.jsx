// src/features/compras/pages/FormCompraPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../../../shared/components/layout/NavbarAdmin';
import CompraForm from '../components/CompraForm'; // Nuevo componente de formulario
import ValidationModal from '../../../shared/components/common/ValidationModal';
import ConfirmModal from '../../../shared/components/common/ConfirmModal';
import {
  saveNuevaCompra,
  fetchCompras, // Para validar duplicados o obtener IDs, aunque saveNuevaCompra ya lo hace
  getProductosPorCategoriaParaCompra,
  getProveedoresParaCompra,
  getMetodosPagoParaCompra
} from '../services/comprasService';
import '../css/FormCompra.css'; // Nuevo CSS (adaptado de AgregarCompra.css)

function FormCompraPage() {
  const navigate = useNavigate();
  // Estados para los datos del formulario (proveedor, fecha, metodoPago, items, totales)
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState('');
  const [fechaCompra, setFechaCompra] = useState(new Date().toISOString().split("T")[0]);
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState('');
  const [itemsCompra, setItemsCompra] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [iva, setIva] = useState(0);
  const [total, setTotal] = useState(0);

  const [validationMessage, setValidationMessage] = useState('');
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [isConfirmSaveModalOpen, setIsConfirmSaveModalOpen] = useState(false);

  // Datos para los selectores del formulario
  const productosDisponiblesPorCategoria = getProductosPorCategoriaParaCompra();
  const proveedoresDisponibles = getProveedoresParaCompra();
  const metodosPagoDisponibles = getMetodosPagoParaCompra();

  useEffect(() => {
    const nuevoSubtotal = itemsCompra.reduce((sum, item) => sum + (item.total || 0), 0);
    const nuevoIva = nuevoSubtotal * 0.19;
    setSubtotal(nuevoSubtotal);
    setIva(nuevoIva);
    setTotal(nuevoSubtotal + nuevoIva);
  }, [itemsCompra]);

  const handleGuardar = () => {
    // Validaciones previas antes de mostrar el modal de confirmación
    if (!proveedorSeleccionado) {
      setValidationMessage("Debe seleccionar un proveedor.");
      setIsValidationModalOpen(true);
      return;
    }
    if (!metodoPagoSeleccionado) {
      setValidationMessage("Debe seleccionar un método de pago.");
      setIsValidationModalOpen(true);
      return;
    }
    if (itemsCompra.length === 0) {
      setValidationMessage("Debe agregar al menos un producto a la compra.");
      setIsValidationModalOpen(true);
      return;
    }
    for (let item of itemsCompra) {
        if (item.cantidad <= 0 || (item.nombre && item.precio <=0) ) {
             setValidationMessage(`Datos inválidos para el producto "${item.nombre}". Cantidad y precio deben ser mayores a 0.`);
             setIsValidationModalOpen(true);
             return;
        }
    }
    setIsConfirmSaveModalOpen(true);
  };

  const confirmSave = () => {
    const compraData = {
      proveedor: proveedorSeleccionado,
      fecha: fechaCompra,
      metodoPago: metodoPagoSeleccionado,
      items: itemsCompra.map(item => ({ // Asegurar formato correcto de items
          categoria: item.categoria, // Guardar también la categoría si es relevante
          nombre: item.nombre,
          cantidad: parseInt(item.cantidad, 10),
          precio: parseFloat(item.precio),
          total: parseFloat(item.total)
      })),
      subtotal,
      iva,
      total,
    };

    try {
      const existingCompras = fetchCompras();
      saveNuevaCompra(compraData, existingCompras);
      setValidationMessage("Compra guardada exitosamente. Redirigiendo...");
      setIsValidationModalOpen(true);
      setTimeout(() => {
        handleCloseModals();
        navigate("/compras");
      }, 2000);
    } catch (error) {
      setValidationMessage(error.message);
      setIsValidationModalOpen(true);
    }
    setIsConfirmSaveModalOpen(false);
  };

  const handleCloseModals = () => {
    setIsValidationModalOpen(false);
    setValidationMessage('');
    setIsConfirmSaveModalOpen(false);
  };

  return (
    <div className="agregar-compra-page-container"> {/* Nueva clase para la página */}
      <NavbarAdmin />
      <div className="agregar-compra-content"> {/* Clase del CSS original */}
        <h2 className="agregar-compra-title">Registrar Nueva Compra</h2>
        <CompraForm
          // Props para el estado del formulario
          proveedor={proveedorSeleccionado}
          setProveedor={setProveedorSeleccionado}
          fecha={fechaCompra}
          setFecha={setFechaCompra}
          metodoPago={metodoPagoSeleccionado}
          setMetodoPago={setMetodoPagoSeleccionado}
          items={itemsCompra}
          setItems={setItemsCompra}
          // Props para los datos de los selectores
          productosPorCategoria={productosDisponiblesPorCategoria}
          proveedoresList={proveedoresDisponibles}
          metodosPagoList={metodosPagoDisponibles}
          // Props para totales (si se muestran en el form)
          subtotal={subtotal}
          iva={iva}
          total={total}
        />
        <div className="agregar-compra-buttons"> {/* Clase del CSS original */}
          <button className="btn-guardar-agregar-compra" onClick={handleGuardar}>
            Guardar Compra
          </button>
          <button className="btnCancelarAgregarCompra" onClick={() => navigate("/compras")}>
            Cancelar
          </button>
        </div>
      </div>

      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={handleCloseModals}
        title="Aviso de Compra"
        message={validationMessage}
      />
      <ConfirmModal
        isOpen={isConfirmSaveModalOpen}
        onClose={() => setIsConfirmSaveModalOpen(false)}
        onConfirm={confirmSave}
        title="Confirmar Compra"
        message="¿Está seguro de que desea guardar esta compra?"
      />
    </div>
  );
}
export default FormCompraPage;