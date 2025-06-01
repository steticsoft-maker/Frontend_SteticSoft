// src/features/compras/pages/FormCompraPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../../../shared/components/layout/NavbarAdmin';
import CompraForm from '../components/CompraForm';
import ValidationModal from '../../../shared/components/common/ValidationModal';
import ConfirmModal from '../../../shared/components/common/ConfirmModal';
import {
  saveNuevaCompra,
  fetchCompras,
  getProductosPorCategoriaParaCompra,
  getProveedoresParaCompra,
  getMetodosPagoParaCompra
} from '../services/comprasService';
import '../css/FormCompra.css';

function FormCompraPage() {
  const navigate = useNavigate();
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
      items: itemsCompra.map(item => ({
          categoria: item.categoria,
          nombre: item.nombre,
          cantidad: parseInt(item.cantidad, 10),
          precio: parseFloat(item.precio),
          total: parseFloat(item.total) 
      })),
      subtotal,
      iva,
      total,
      estado: "Pendiente", // Estado inicial para nuevas compras
    };

    try {
      const existingCompras = fetchCompras();
      saveNuevaCompra(compraData, existingCompras);
      setValidationMessage("Compra guardada exitosamente. Redirigiendo...");
      setIsValidationModalOpen(true);
      setTimeout(() => {
        handleCloseModals(); // Asegúrate que esta función también cierre el ValidationModal si es necesario
        navigate("/compras");
      }, 2000);
    } catch (error) {
      setValidationMessage(error.message);
      setIsValidationModalOpen(true);
    }
    setIsConfirmSaveModalOpen(false); // Cerrar modal de confirmación después de intentar guardar
  };

  const handleCloseModals = () => {
    setIsValidationModalOpen(false);
    setValidationMessage('');
    setIsConfirmSaveModalOpen(false);
  };

  return (
    // Contenedor principal de la página para el layout flex con NavbarAdmin
    <div className="agregar-compra-page-container"> 
      <NavbarAdmin />
      {/* Contenedor del contenido principal con el margen para el NavbarAdmin */}
      <div className="agregar-compra-content"> 
        {/* Wrapper interno para centrar el formulario y su título */}
        <div className="agregar-compra-form-wrapper">
            <h2 className="agregar-compra-title">Registrar Nueva Compra</h2>
            <CompraForm
            proveedor={proveedorSeleccionado}
            setProveedor={setProveedorSeleccionado}
            fecha={fechaCompra}
            setFecha={setFechaCompra}
            metodoPago={metodoPagoSeleccionado}
            setMetodoPago={setMetodoPagoSeleccionado}
            items={itemsCompra}
            setItems={setItemsCompra}
            productosPorCategoria={productosDisponiblesPorCategoria}
            proveedoresList={proveedoresDisponibles}
            metodosPagoList={metodosPagoDisponibles}
            subtotal={subtotal}
            iva={iva}
            total={total}
            />
            <div className="agregar-compra-buttons">
            <button className="btn-guardar-agregar-compra" onClick={handleGuardar}>
                Guardar Compra
            </button>
            <button className="btnCancelarAgregarCompra" onClick={() => navigate("/compras")}>
                Cancelar
            </button>
            </div>
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