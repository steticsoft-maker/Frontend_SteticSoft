// src/features/compras/pages/FormCompraPage.jsx
import React, { useState, useEffect } from 'react'; // useCallback removed
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../../../shared/components/layout/NavbarAdmin';
import CompraForm from '../components/CompraForm';
import ValidationModal from '../../../shared/components/common/ValidationModal';
import ConfirmModal from '../../../shared/components/common/ConfirmModal';
import { comprasService } from '../services/comprasService';
import { proveedoresService } from '../../proveedores/services/proveedoresService';
import { productosAdminService } from '../../productosAdmin/services/productosAdminService';
import { useAuth } from '../../../shared/contexts/authHooks'; // Path updated
import '../css/FormCompra.css';

function FormCompraPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [fechaCompra, setFechaCompra] = useState(new Date().toISOString().split("T")[0]);
  const [itemsCompra, setItemsCompra] = useState([]);
  
  const [proveedoresList, setProveedoresList] = useState([]);
  const [productosList, setProductosList] = useState([]);
  
  const [validationMessage, setValidationMessage] = useState('');
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [isConfirmSaveModalOpen, setIsConfirmSaveModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cargarDatosIniciales = async () => {
      setIsLoading(true);
      try {
        const [proveedoresData, productosData] = await Promise.all([
          proveedoresService.getProveedores(),
          productosAdminService.getProductos()
        ]);
        setProveedoresList(proveedoresData || []);
        setProductosList(productosData?.productos || []);
      } catch (error) {
        setValidationMessage('Error al cargar datos necesarios: ' + (error.message || 'Error desconocido'));
        setIsValidationModalOpen(true);
      } finally {
        setIsLoading(false);
      }
    };
    cargarDatosIniciales();
  }, []);

  const subtotal = itemsCompra.reduce((sum, item) => sum + (item.total || 0), 0);
  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  const handleGuardar = () => {
    // La validación ahora funcionará porque 'proveedorSeleccionado' será el objeto correcto
    if (!proveedorSeleccionado) {
      setValidationMessage("Debe seleccionar un proveedor válido de la lista.");
      setIsValidationModalOpen(true);
      return;
    }
    if (itemsCompra.length === 0) {
      setValidationMessage("Debe agregar al menos un producto a la compra.");
      setIsValidationModalOpen(true);
      return;
    }
    const hasInvalidItems = itemsCompra.some(item => !item.id || item.cantidad <= 0 || item.precio < 0);
    if (hasInvalidItems) {
      setValidationMessage("Revise los productos. Todos deben tener cantidad y precio válidos (precio puede ser 0).");
      setIsValidationModalOpen(true);
      return;
    }
    setIsConfirmSaveModalOpen(true);
  };

  const confirmSave = async () => {
    setIsConfirmSaveModalOpen(false);
    setIsSubmitting(true);

    const compraData = {
      // Ahora 'proveedorSeleccionado.idProveedor' no dará error
      proveedorId: proveedorSeleccionado.idProveedor,
      usuarioId: user.idUsuario,
      fecha: fechaCompra,
      total: total,
      iva: iva,
      estado: true, 
      productos: itemsCompra.map(item => ({
        productoId: item.id,
        cantidad: Number(item.cantidad),
        valorUnitario: Number(item.precio)
      })),
    };

    try {
      await comprasService.createCompra(compraData);
      setValidationMessage("Compra guardada exitosamente. Redirigiendo...");
      setIsValidationModalOpen(true);
      setTimeout(() => {
        navigate("/admin/compras");
      }, 2000);
    } catch (error) {
      setValidationMessage(error.response?.data?.message || error.message || 'Error al guardar la compra.');
      setIsValidationModalOpen(true);
      setIsSubmitting(false);
    }
  };

  const handleCloseModals = () => {
    setIsValidationModalOpen(false);
    setValidationMessage('');
    setIsConfirmSaveModalOpen(false);
  };

  return (
    <div className="agregar-compra-page-container"> 
      <NavbarAdmin />
      <div className="agregar-compra-content"> 
        <div className="agregar-compra-form-wrapper">
            <h2 className="agregar-compra-title">Registrar Nueva Compra</h2>
            {isLoading ? (
              <p style={{ textAlign: 'center' }}>Cargando datos necesarios...</p>
            ) : (
              <CompraForm
                  // CORRECCIÓN CLAVE: La prop ahora se llama 'proveedorSeleccionado' y pasa el objeto completo.
                  proveedorSeleccionado={proveedorSeleccionado} 
                  setProveedor={setProveedorSeleccionado}
                  fecha={fechaCompra}
                  setFecha={setFechaCompra}
                  items={itemsCompra}
                  setItems={setItemsCompra}
                  productosList={productosList}
                  proveedoresList={proveedoresList}
                  subtotal={subtotal}
                  iva={iva}
                  total={total}
              />
            )}
            <div className="agregar-compra-buttons">
              <button className="btn-guardar-agregar-compra" onClick={handleGuardar} disabled={isSubmitting || isLoading}>
                  {isSubmitting ? 'Guardando...' : 'Guardar Compra'}
              </button>
              <button className="btnCancelarAgregarCompra" onClick={() => navigate("/admin/compras")} disabled={isSubmitting || isLoading}>
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