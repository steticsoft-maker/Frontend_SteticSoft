// src/features/ventas/pages/ProcesoVentaPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from "../../../shared/components/layout/NavbarAdmin";
import VentaForm from "../components/VentaForm";
import ItemSelectionModal from "../components/ItemSelectionModal"; // O el genérico de shared
import ConfirmModal from "../../../shared/components/common/ConfirmModal";
import ValidationModal from "../../../shared/components/common/ValidationModal";
import {
  getClientesParaVenta,
  getProductosParaVenta,
  getServiciosParaVenta,
  saveNuevaVenta,
  fetchVentas, // Para obtener la lista actual antes de guardar
} from "../services/ventasService";
import "../css/ProcesoVentas.css"; // Adaptado

function ProcesoVentaPage() {
  const navigate = useNavigate();

  // Estado del formulario principal
  const [modoCliente, setModoCliente] = useState(""); // 'existente' o 'nuevo'
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

  // Listas de datos para los selectores (se cargarán desde el servicio)
  const [clientesDisponibles, setClientesDisponibles] = useState([]);
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);

  // Estados para errores y confirmación
  const [errorDatosCliente, setErrorDatosCliente] = useState("");
  const [errorItemsTabla, setErrorItemsTabla] = useState("");
  const [isConfirmSaveModalOpen, setIsConfirmSaveModalOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    // Cargar datos para los selectores al montar la página
    setClientesDisponibles(getClientesParaVenta());
    setProductosDisponibles(getProductosParaVenta());
    setServiciosDisponibles(getServiciosParaVenta());
  }, []);

  const handleDatosClienteChange = (e) => {
    const { name, value } = e.target;
    setDatosCliente((prev) => ({ ...prev, [name]: value }));
    if (errorDatosCliente) setErrorDatosCliente(""); // Limpiar error al escribir
  };

  const seleccionarClienteDesdeModal = (cliente) => {
    setDatosCliente({
      // Autocompletar campos con el cliente seleccionado
      nombre: cliente.nombre,
      documento: cliente.documento,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
    });
    setModoCliente("existente"); // Asegurar que el modo refleje la acción
    setShowClienteSelectModal(false);
    setErrorDatosCliente("");
  };

  const agregarItemDesdeModal = (itemSeleccionado, tipo) => {
    // Verificar si el ítem ya está en la tabla
    const itemExistenteIndex = itemsTabla.findIndex(
      (item) => item.nombre === itemSeleccionado.nombre && item.tipo === tipo
    );

    if (itemExistenteIndex > -1) {
      // Si ya existe, incrementar cantidad
      const nuevaTabla = [...itemsTabla];
      nuevaTabla[itemExistenteIndex].cantidad += 1;
      setItemsTabla(nuevaTabla);
    } else {
      // Si no existe, agregarlo con cantidad 1
      setItemsTabla((prevItems) => [
        ...prevItems,
        { ...itemSeleccionado, cantidad: 1, tipo },
      ]);
    }
    setErrorItemsTabla("");
  };

  const handleActualizarCantidadItem = (index, nuevaCantidad) => {
    const cantidad = Math.max(1, nuevaCantidad); // Asegurar que la cantidad sea al menos 1
    setItemsTabla((prevItems) =>
      prevItems.map((item, i) => (i === index ? { ...item, cantidad } : item))
    );
  };

  const handleEliminarItem = (index) => {
    setItemsTabla((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  // Cálculo de totales
  const subtotal = itemsTabla.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );
  const iva = subtotal * 0.19; // Asumiendo 19%
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
          setErrorItemsTabla(
            `La cantidad para "${item.nombre}" debe ser al menos 1.`
          );
          isValid = false;
          break;
        }
      }
    }

    if (modoCliente === "existente" && !datosCliente.nombre) {
      // Solo verificar nombre si es existente y ya fue "seleccionado"
      setErrorDatosCliente(
        "Por favor selecciona un cliente existente de la lista."
      );
      isValid = false;
    } else if (
      modoCliente === "nuevo" &&
      (!datosCliente.nombre.trim() ||
        !datosCliente.documento.trim() ||
        !datosCliente.telefono.trim() ||
        !datosCliente.direccion.trim())
    ) {
      setErrorDatosCliente(
        "Por favor completa todos los campos del cliente nuevo."
      );
      isValid = false;
    } else if (!modoCliente) {
      setErrorDatosCliente(
        "Por favor selecciona si el cliente es existente o nuevo."
      );
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
        // Asegurar que se guardan los datos relevantes del ítem
        nombre: item.nombre,
        cantidad: item.cantidad,
        precio: item.precio,
        total: item.precio * item.cantidad,
        tipo: item.tipo, // Guardar si es producto o servicio
      })),
      subtotal,
      iva,
      total,
      fecha: new Date().toISOString().slice(0, 10), // Fecha actual
      estado: "Activa", // Estado por defecto
    };

    try {
      const ventasActuales = fetchVentas();
      saveNuevaVenta(ventaData, ventasActuales); // ventasActualizadas removed as it's unused
      // En lugar de pasar por estado, se actualiza localStorage y ListaVentasPage leerá de ahí
      // navigate('/ventas', { state: { nuevaVenta: ventaDataConId } }); // ventaDataConId vendría del servicio

      setValidationMessage("¡Venta guardada exitosamente! Redirigiendo...");
      setIsValidationModalOpen(true);
      setTimeout(() => {
        setIsConfirmSaveModalOpen(false);
        setIsValidationModalOpen(false);
        navigate("/ventas"); // Redirigir a la lista de ventas
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
      {" "}
      {/* Clase del CSS original */}
      <NavbarAdmin />
      <div className="proceso-ventas-main-content">
        {" "}
        {/* Clase del CSS original */}
        <h1>Proceso de Agregar Venta</h1>
        <form onSubmit={(e) => e.preventDefault()}>
          {" "}
          {/* Evitar submit tradicional del form */}
          <VentaForm
            modoCliente={modoCliente}
            setModoCliente={setModoCliente}
            datosCliente={datosCliente}
            onDatosClienteChange={handleDatosClienteChange}
            onAbrirModalSeleccionCliente={() => setShowClienteSelectModal(true)}
            itemsTabla={itemsTabla}
            onAbrirModalCatalogoProductos={() =>
              setShowProductoSelectModal(true)
            }
            onAbrirModalCatalogoServicios={() =>
              setShowServicioSelectModal(true)
            }
            onActualizarCantidadItem={handleActualizarCantidadItem}
            onEliminarItem={handleEliminarItem}
            subtotal={subtotal}
            iva={iva}
            total={total}
            errorDatosCliente={errorDatosCliente}
            errorItemsTabla={errorItemsTabla}
          />
          <div className="botones-accion">
            {" "}
            {/* Clase del CSS original */}
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
              onClick={() => navigate("/ventas")}
            >
              Cancelar Venta
            </button>
          </div>
        </form>
      </div>
      {/* Modales de Selección */}
      <ItemSelectionModal
        isOpen={showClienteSelectModal}
        onClose={() => setShowClienteSelectModal(false)}
        title="Seleccionar Cliente Existente"
        items={clientesDisponibles.map((c) => ({ ...c, tipo: "cliente" }))} // Añadir tipo para getItemDisplayLabel si es necesario
        onSelectItem={seleccionarClienteDesdeModal}
        searchPlaceholder="Buscar cliente por nombre o documento..."
        displayFields={["nombre", "documento"]}
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
      {/* Modal de Confirmación para Guardar */}
      <ConfirmModal
        isOpen={isConfirmSaveModalOpen}
        onClose={() => setIsConfirmSaveModalOpen(false)}
        onConfirm={confirmGuardar}
        title="Confirmar Guardar Venta"
        message="¿Está seguro de que desea guardar esta venta?"
      />
      {/* Modal de Validación/Error */}
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
