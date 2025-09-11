import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import CompraForm from '../components/CompraForm';
import { comprasService } from '../services/comprasService';
import { proveedoresService } from '../../proveedores/services/proveedoresService';
import { productosAdminService } from '../../productosAdmin/services/productosAdminService';
import { useAuth } from '../../../shared/contexts/authHooks';
import '../css/FormCompra.css';

const MySwal = withReactContent(Swal);

function FormCompraPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [fechaCompra, setFechaCompra] = useState(new Date().toISOString().split("T")[0]);
  const [itemsCompra, setItemsCompra] = useState([]);
  
  const [proveedoresList, setProveedoresList] = useState([]);
  const [productosList, setProductosList] = useState([]);
  
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
      MySwal.fire("Error de validación", "Debe seleccionar un proveedor válido de la lista.", "error");
      return;
    }
    if (itemsCompra.length === 0) {
      MySwal.fire("Error de validación", "Debe agregar al menos un producto a la compra.", "error");
      return;
    }
    const hasInvalidItems = itemsCompra.some(item => !item.id || item.cantidad <= 0 || item.precio < 0);
    if (hasInvalidItems) {
      MySwal.fire("Error de validación", "Revise los productos. Todos deben tener cantidad y precio válidos.", "error");
      return;
    }

    MySwal.fire({
        title: 'Confirmar Compra',
        text: '¿Está seguro de que desea guardar esta compra?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, guardar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if(result.isConfirmed) {
            confirmSave();
        }
    });
  };

  const confirmSave = async () => {
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
      MySwal.fire({
          title: '¡Éxito!',
          text: 'Compra guardada exitosamente. Redirigiendo...',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
      }).then(() => {
        navigate("/admin/compras");
      });
    } catch (error) {
      MySwal.fire("Error", error.response?.data?.errors[0]?.msg || error.message || 'Error al guardar la compra.', "error");
      setIsSubmitting(false);
    }
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
    </div>
  );
}

export default FormCompraPage;
