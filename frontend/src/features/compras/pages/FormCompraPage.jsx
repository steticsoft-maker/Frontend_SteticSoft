import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CompraForm from '../components/CompraForm';
import ValidationModal from '../../../shared/components/common/ValidationModal';
import ConfirmModal from '../../../shared/components/common/ConfirmModal';
import { comprasService } from '../services/comprasService';
import { proveedoresService } from '../../proveedores/services/proveedoresService';
import { productosAdminService } from '../../productosAdmin/services/productosAdminService';
import { useAuth } from '../../../shared/contexts/authHooks';
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

  // ✅ --- useEffect con validación de productos y proveedores activos --- ✅
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      setIsLoading(true);
      console.log("Iniciando carga de datos...");

      try {
        const results = await Promise.allSettled([
          proveedoresService.getProveedores(),
          productosAdminService.getProductos()
        ]);

        // -- PROVEEDORES --
        const proveedoresResult = results[0];
        if (proveedoresResult.status === 'fulfilled') {
          console.log('✅ Éxito al cargar proveedores. Datos:', proveedoresResult.value);
          const proveedoresData = proveedoresResult.value;

          // 🔎 Filtrar solo los proveedores activos
          const proveedoresActivos = Array.isArray(proveedoresData)
            ? proveedoresData.filter(p => p.estado === true || p.activo === true)
            : [];

          setProveedoresList(proveedoresActivos);
        } else {
          console.error('❌ Error al cargar proveedores:', proveedoresResult.reason);
          setProveedoresList([]);
        }

        // -- PRODUCTOS --
        const productosResult = results[1];
        if (productosResult.status === 'fulfilled') {
          console.log('✅ Éxito al cargar productos. Datos:', productosResult.value);
          const productosData = productosResult.value;

          // 🔎 Filtrar solo los productos activos
          const productosActivos = Array.isArray(productosData)
            ? productosData.filter(p => p.estado === true || p.activo === true)
            : [];

          setProductosList(productosActivos);
        } else {
          console.error('❌ Error al cargar productos:', productosResult.reason);
          setProductosList([]);
        }

      } catch (error) {
        console.error("Error inesperado en cargarDatosIniciales:", error);
        setValidationMessage('Ocurrió un error general al cargar los datos.');
        setIsValidationModalOpen(true);
        setProveedoresList([]);
        setProductosList([]);
      } finally {
        setIsLoading(false);
        console.log("Carga de datos finalizada.");
      }
    };

    cargarDatosIniciales();
  }, []);

  const subtotal = itemsCompra.reduce((sum, item) => sum + (item.total || 0), 0);
  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  const handleGuardar = () => {
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
      setValidationMessage("Revise los productos. Todos deben tener cantidad y precio válidos.");
      setIsValidationModalOpen(true);
      return;
    }
    setIsConfirmSaveModalOpen(true);
  };

  const confirmSave = async () => {
    setIsConfirmSaveModalOpen(false);
    setIsSubmitting(true);

    const compraData = {
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
      setValidationMessage(error.response?.data?.errors[0]?.msg || error.message || 'Error al guardar la compra.');
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
      <div className="agregar-compra-content"> 
        <div className="agregar-compra-form-wrapper">
          <h2 className="agregar-compra-title">Registrar Nueva Compra</h2>
          {isLoading ? (
            <p style={{ textAlign: 'center' }}>Cargando datos necesarios...</p>
          ) : (
            <CompraForm
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
