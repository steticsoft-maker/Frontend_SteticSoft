// src/features/ventas/pages/ProcesoVentaPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VentaForm from "../components/VentaForm";
import ItemSelectionModal from "../components/ItemSelectionModal";
import ConfirmModal from "../../../shared/components/common/ConfirmModal";
import ValidationModal from "../../../shared/components/common/ValidationModal";
import {
  getProductosParaVenta,
  getServiciosParaVenta,
  saveNuevaVenta,
} from "../services/ventasService";
import { fetchClientes as getClientesParaVenta } from "../../clientes/services/clientesService";
import "../css/ProcesoVentas.css";

function ProcesoVentaPage() {
  const navigate = useNavigate();

  const [modoCliente, setModoCliente] = useState("");
  const [datosCliente, setDatosCliente] = useState({
    nombre: "",
    documento: "",
    telefono: "",
    direccion: "",
  });
  const [itemsTabla, setItemsTabla] = useState([]);

  const [showClienteSelectModal, setShowClienteSelectModal] = useState(false);
  const [showProductoSelectModal, setShowProductoSelectModal] = useState(false);
  const [showServicioSelectModal, setShowServicioSelectModal] = useState(false);

  const [clientesDisponibles, setClientesDisponibles] = useState([]);
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);

  const [isLoadingClientes, setIsLoadingClientes] = useState(false);
  const [errorClientes, setErrorClientes] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [errorDatosCliente, setErrorDatosCliente] = useState("");
  const [errorItemsTabla, setErrorItemsTabla] = useState("");
  const [isConfirmSaveModalOpen, setIsConfirmSaveModalOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const productos = await getProductosParaVenta();
        const servicios = await getServiciosParaVenta();

        // Mapea los IDs de productos y servicios a una propiedad consistente 'id'
        const productosConIdCorrecto = productos.map((p) => ({
          ...p,
          id: p.idProducto, // Asume que la propiedad es 'idProducto'
        }));
        
        const serviciosConIdCorrecto = servicios.map((s) => ({
          ...s,
          id: s.idServicio, // Asume que la propiedad es 'idServicio'
        }));
        
        setProductosDisponibles(productosConIdCorrecto);
        setServiciosDisponibles(serviciosConIdCorrecto);
      } catch (error) {
        console.error("Error al cargar productos y/o servicios:", error);
      }
    };

    loadInitialData();
  }, []);

  const handleDatosClienteChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === "nombre") {
      finalValue = value.replace(/[0-9]/g, "").replace(/\s{2,}/g, " ");
    } else if (name === "documento" || name === "telefono") {
      finalValue = value.replace(/[^0-9]/g, "");
    } else {
      finalValue = value.replace(/\s{2,}/g, " ");
    }

    finalValue = finalValue.startsWith(" ") ? finalValue.trimStart() : finalValue;

    setDatosCliente((prev) => ({ ...prev, [name]: finalValue }));
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
      id: cliente.idCliente,
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

    if (modoCliente === "nuevo") {
      const nombreValidacion = datosCliente.nombre.trim();
      const documentoValidacion = datosCliente.documento.trim();
      const telefonoValidacion = datosCliente.telefono.trim();
      const direccionValidacion = datosCliente.direccion.trim();

      if (!nombreValidacion || nombreValidacion.length <= 3 || /\d/.test(nombreValidacion)) {
        setErrorDatosCliente("El nombre es requerido, debe tener más de 3 letras y no puede contener números.");
        isValid = false;
      }

      if (!documentoValidacion || documentoValidacion.length < 7 || documentoValidacion.length > 10 || isNaN(documentoValidacion)) {
        setErrorDatosCliente("El documento es requerido y debe tener entre 7 y 10 dígitos.");
        isValid = false;
      }
      
      if (!telefonoValidacion || telefonoValidacion.length !== 10 || isNaN(telefonoValidacion)) {
        setErrorDatosCliente("El teléfono es requerido y debe tener 10 dígitos.");
        isValid = false;
      }

      if (!direccionValidacion) {
        setErrorDatosCliente("La dirección es un campo requerido.");
        isValid = false;
      }
    } else if (modoCliente === "existente" && !datosCliente.id) {
      setErrorDatosCliente("Por favor selecciona un cliente existente de la lista.");
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

  const confirmGuardar = async () => {
    setIsConfirmSaveModalOpen(false);
    setIsSaving(true);
    
    let clienteData;
    if (modoCliente === 'existente') {
      clienteData = { idCliente: datosCliente.id };
    } else if (modoCliente === 'nuevo') {
      clienteData = { cliente: datosCliente };
    } else {
      clienteData = {};
    }

    // Filtra y mapea los productos y servicios
    const productosParaEnviar = itemsTabla
      .filter(item => item.tipo === "producto")
      .map(item => ({
        idProducto: item.id,
        cantidad: item.cantidad,
        valorUnitario: parseFloat(item.precio),
      }));

    const serviciosParaEnviar = itemsTabla
      .filter(item => item.tipo === "servicio")
      .map(item => ({
        idServicio: item.id,
        valorServicio: parseFloat(item.precio),
        idCita: null,
      }));

    const dataToSend = {
      ...clienteData,
      productos: productosParaEnviar,
      servicios: serviciosParaEnviar,
      idEstado: 1,
    };

    console.log('Datos que se enviarán a la API:', dataToSend);

    try {
      await saveNuevaVenta(dataToSend);

      setValidationMessage("¡Venta guardada exitosamente! Redirigiendo...");
      setIsValidationModalOpen(true);
      
      setTimeout(() => {
        setIsValidationModalOpen(false);
        navigate("/admin/ventas");
      }, 2000);

    } catch (error) {
      console.error("Error al guardar la venta:", error);
      const errorMessage = error.response?.data?.message || "Ocurrió un error inesperado al guardar la venta.";
      setValidationMessage(errorMessage);
      setIsValidationModalOpen(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseValidationModal = () => {
    setIsValidationModalOpen(false);
    setValidationMessage("");
  };

  return (
    <div className="proceso-ventas-page">
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
              disabled={isSaving}
            >
              {isSaving ? "Guardando..." : "Guardar Venta"}
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
        searchPlaceholder="Buscar cliente"
        displayFields={["nombre", "documento"]}
        isLoading={isLoadingClientes}
        errorMessage={errorClientes}
      />
      <ItemSelectionModal
        isOpen={showProductoSelectModal}
        onClose={() => setShowProductoSelectModal(false)}
        title="Agregar Producto"
        items={productosDisponibles.map((p) => ({ ...p, tipo: "producto" }))}
        onSelectItem={(producto) => agregarItemDesdeModal(producto, "producto")}
        searchPlaceholder="Buscar producto"
        displayFields={["nombre", "precio"]}
      />
      <ItemSelectionModal
        isOpen={showServicioSelectModal}
        onClose={() => setShowServicioSelectModal(false)}
        title="Agregar Servicio"
        items={serviciosDisponibles.map((s) => ({ ...s, tipo: "servicio" }))}
        onSelectItem={(servicio) => agregarItemDesdeModal(servicio, "servicio")}
        searchPlaceholder="Buscar servicio"
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