// src/features/ventas/pages/ProcesoVentaPage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from "../../../shared/components/layout/NavbarAdmin";
import VentaForm from "../components/VentaForm";
import ItemSelectionModal from "../components/ItemSelectionModal";
import ConfirmModal from "../../../shared/components/common/ConfirmModal";
import ValidationModal from "../../../shared/components/common/ValidationModal";
import {
  getProductosParaVenta, // Ahora es una función asíncrona
  getServiciosParaVenta, // Ahora es una función asíncrona
  saveNuevaVenta,
  fetchVentas,
} from "../services/ventasService";
import { fetchClientes as getClientesParaVenta } from "../../clientes/services/clientesService";
import "../css/ProcesoVentas.css";

function ProcesoVentaPage() {
  const navigate = useNavigate();

  // Estado del formulario principal
  const [modoCliente, setModoCliente] = useState("");
  const [datosCliente, setDatosCliente] = useState({
    nombre: "",
    documento: "",
    telefono: "",
    direccion: "",
  });
  const [itemsTabla, setItemsTabla] = useState([]);

  // Estados para los modales de selección
  const [showClienteSelectModal, setShowClienteSelectModal] = useState(false);
  const [showProductoSelectModal, setShowProductoSelectModal] = useState(false);
  const [showServicioSelectModal, setShowServicioSelectModal] = useState(false);

  // Listas de datos para los selectores
  const [clientesDisponibles, setClientesDisponibles] = useState([]);
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);

  // Estados para la carga y errores de datos asíncronos
  const [isLoadingClientes, setIsLoadingClientes] = useState(false);
  const [errorClientes, setErrorClientes] = useState(null);

  // Estados para errores y confirmación del formulario
  const [errorDatosCliente, setErrorDatosCliente] = useState("");
  const [errorItemsTabla, setErrorItemsTabla] = useState("");
  const [isConfirmSaveModalOpen, setIsConfirmSaveModalOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    const loadInitialData = async () => {
      // Cargar productos y servicios al montar la página
      const productos = await getProductosParaVenta();
      const servicios = await getServiciosParaVenta();
      setProductosDisponibles(productos);
      setServiciosDisponibles(servicios);
    };

    loadInitialData();
  }, []);

  const handleDatosClienteChange = (e) => {
    const { name, value } = e.target;
    setDatosCliente((prev) => ({ ...prev, [name]: value }));
    if (errorDatosCliente) setErrorDatosCliente("");
  };

  const handleAbrirModalClientes = async () => {
    if (clientesDisponibles.length === 0) {
      try {
        setIsLoadingClientes(true);
        setErrorClientes(null);
        const clientes = await getClientesParaVenta();
        setClientesDisponibles(clientes);
      } catch (error) {
        console.error("Error al cargar clientes:", error);
        setErrorClientes("No se pudieron cargar los clientes. Inténtelo de nuevo.");
      } finally {
        setIsLoadingClientes(false);
      }
    }
    setShowClienteSelectModal(true);
  };

  const seleccionarClienteDesdeModal = (cliente) => {
    setDatosCliente({
      nombre: cliente.nombre,
      documento: cliente.numeroDocumento,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
    });
    setModoCliente("existente");
    setShowClienteSelectModal(false);
    setErrorDatosCliente("");
  };

  const agregarItemDesdeModal = (itemSeleccionado, tipo) => {
    setItemsTabla((prevItems) => {
      const itemExistente = prevItems.find(
        (item) => item.id === itemSeleccionado.id && item.tipo === tipo
      );

      if (itemExistente) {
        return prevItems.map((item) =>
          item.id === itemSeleccionado.id && item.tipo === tipo
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...itemSeleccionado, cantidad: 1, tipo }];
      }
    });
    setErrorItemsTabla("");
  };

  const handleActualizarCantidadItem = (index, nuevaCantidad) => {
    const cantidad = Math.max(1, nuevaCantidad);
    setItemsTabla((prevItems) =>
      prevItems.map((item, i) => (i === index ? { ...item, cantidad } : item))
    );
  };

  const handleEliminarItem = (index) => {
    setItemsTabla((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const subtotal = itemsTabla.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );
  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  const validarFormulario = () => {
    setErrorDatosCliente("");
    setErrorItemsTabla("");
    let isValid = true;

    if (itemsTabla.length === 0) {
      setErrorItemsTabla("Debes agregar al menos un producto o servicio.");
      isValid = false;
    } else {
      for (const item of itemsTabla) {
        if (item.cantidad < 1) {
          setErrorItemsTabla(`La cantidad para "${item.nombre}" debe ser al menos 1.`);
          isValid = false;
          break;
        }
      }
    }

    if (modoCliente === "existente" && !datosCliente.nombre) {
      setErrorDatosCliente("Por favor selecciona un cliente existente de la lista.");
      isValid = false;
    } else if (
      modoCliente === "nuevo" &&
      (!datosCliente.nombre.trim() ||
        !datosCliente.documento.trim() ||
        !datosCliente.telefono.trim() ||
        !datosCliente.direccion.trim())
    ) {
      setErrorDatosCliente("Por favor completa todos los campos del cliente nuevo.");
      isValid = false;
    } else if (!modoCliente) {
      setErrorDatosCliente("Por favor selecciona si el cliente es existente o nuevo.");
      isValid = false;
    }
    return isValid;
  };

  const handleGuardarVenta = () => {
    if (!validarFormulario()) {
      return;
    }
    setIsConfirmSaveModalOpen(true);
  };

  const confirmGuardar = () => {
    const ventaData = {
      cliente: datosCliente.nombre,
      documento: datosCliente.documento,
      telefono: datosCliente.telefono,
      direccion: datosCliente.direccion,
      items: itemsTabla.map((item) => ({
        id: item.id,
        nombre: item.nombre,
        cantidad: item.cantidad,
        precio: item.precio,
        total: item.precio * item.cantidad,
        tipo: item.tipo,
      })),
      subtotal,
      iva,
      total,
      fecha: new Date().toISOString().slice(0, 10),
      estado: "Activa",
    };

    try {
      const ventasActuales = fetchVentas();
      saveNuevaVenta(ventaData, ventasActuales);

      setValidationMessage("¡Venta guardada exitosamente! Redirigiendo...");
      setIsValidationModalOpen(true);
      setTimeout(() => {
        setIsConfirmSaveModalOpen(false);
        setIsValidationModalOpen(false);
        navigate("/admin/ventas");
      }, 2000);
    } catch (error) {
      setValidationMessage(error.message);
      setIsValidationModalOpen(true);
      setIsConfirmSaveModalOpen(false);
    }
  };

  const handleCloseValidationModal = () => {
    setIsValidationModalOpen(false);
    setValidationMessage("");
  };

  return (
    <div className="proceso-ventas-page">
      <NavbarAdmin />
      <div className="proceso-ventas-main-content">
        <h1>Proceso de Agregar Venta</h1>
        <form onSubmit={(e) => e.preventDefault()}>
          <VentaForm
            modoCliente={modoCliente}
            setModoCliente={setModoCliente}
            datosCliente={datosCliente}
            onDatosClienteChange={handleDatosClienteChange}
            onAbrirModalSeleccionCliente={handleAbrirModalClientes}
            itemsTabla={itemsTabla}
            onAbrirModalCatalogoProductos={() => setShowProductoSelectModal(true)}
            onAbrirModalCatalogoServicios={() => setShowServicioSelectModal(true)}
            onActualizarCantidadItem={handleActualizarCantidadItem}
            onEliminarItem={handleEliminarItem}
            subtotal={subtotal}
            iva={iva}
            total={total}
            errorDatosCliente={errorDatosCliente}
            errorItemsTabla={errorItemsTabla}
          />
          <div className="botones-accion">
            <button
              type="button"
              className="guardar-venta-button"
              onClick={handleGuardarVenta}
            >
              Guardar Venta
            </button>
            <button
              type="button"
              className="cancelar-venta-button"
              onClick={() => navigate("/admin/ventas")}
            >
              Cancelar Venta
            </button>
          </div>
        </form>
      </div>
      <ItemSelectionModal
        isOpen={showClienteSelectModal}
        onClose={() => setShowClienteSelectModal(false)}
        title="Seleccionar Cliente Existente"
        items={clientesDisponibles.map((c) => ({ ...c, tipo: "cliente" }))}
        onSelectItem={seleccionarClienteDesdeModal}
        searchPlaceholder="Buscar cliente por nombre o documento..."
        displayFields={["nombre", "documento"]}
        isLoading={isLoadingClientes}
        errorMessage={errorClientes}
      />
      <ItemSelectionModal
        isOpen={showProductoSelectModal}
        onClose={() => setShowProductoSelectModal(false)}
        title="Agregar Producto al Carrito"
        items={productosDisponibles.map((p) => ({ ...p, tipo: "producto" }))}
        onSelectItem={(producto) => agregarItemDesdeModal(producto, "producto")}
        searchPlaceholder="Buscar producto..."
        displayFields={["nombre", "precio"]}
      />
      <ItemSelectionModal
        isOpen={showServicioSelectModal}
        onClose={() => setShowServicioSelectModal(false)}
        title="Agregar Servicio al Carrito"
        items={serviciosDisponibles.map((s) => ({ ...s, tipo: "servicio" }))}
        onSelectItem={(servicio) => agregarItemDesdeModal(servicio, "servicio")}
        searchPlaceholder="Buscar servicio..."
        displayFields={["nombre", "precio"]}
      />
      <ConfirmModal
        isOpen={isConfirmSaveModalOpen}
        onClose={() => setIsConfirmSaveModalOpen(false)}
        onConfirm={confirmGuardar}
        title="Confirmar Guardar Venta"
        message="¿Está seguro de que desea guardar esta venta?"
      />
      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={handleCloseValidationModal}
        title="Aviso de Venta"
        message={validationMessage}
      />
    </div>
  );
}

export default ProcesoVentaPage;