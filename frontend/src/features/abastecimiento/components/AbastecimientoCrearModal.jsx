// src/features/abastecimiento/components/AbastecimientoCrearModal.jsx
import React, { useState, useEffect } from "react";
// import ReactDOM from 'react-dom'; // ELIMINADO: Ya no se necesita el portal.
import AbastecimientoForm from "./AbastecimientoForm";
import ItemSelectionModal from "../../../shared/components/common/ItemSelectionModal";
// import { abastecimientoService } from "../services/abastecimientoService"; // Ya no se usa directamente aquí

const AbastecimientoCrearModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting, // Para el estado de guardado del formulario
  // --- INICIO: Nuevas props ---
  productosInternos,
  empleadosActivos,
  isLoadingProductos, // Para el estado de carga de las listas de productos/empleados
  // --- FIN: Nuevas props ---
}) => {
  const getInitialFormState = () => ({
    productoId: null,
    productoNombre: "",
    empleadoId: null,
    empleadoNombre: "",
    cantidad: "",
  });

  const [formData, setFormData] = useState(getInitialFormState());
  const [formErrors, setFormErrors] = useState({});
  // const [isLoading, setIsLoading] = useState(false); // Se reemplaza por isLoadingProductos y isSubmitting

  // const [productos, setProductos] = useState([]); // Se reemplaza por productosInternos (prop)
  // const [empleados, setEmpleados] = useState([]); // Se reemplaza por empleadosActivos (prop)

  const [showProductSelectModal, setShowProductSelectModal] = useState(false);
  const [showEmployeeSelectModal, setShowEmployeeSelectModal] = useState(false);


  useEffect(() => {
    if (isOpen) {
      // Las dependencias (productos, empleados) ahora se cargan en el hook/página padre
      // y se pasan como props. Solo reseteamos el formulario.
      setFormData(getInitialFormState());
      setFormErrors({});
    }
  }, [isOpen]); // Ya no depende de cargarDependencias

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error específico cuando el usuario empieza a corregir
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // NUEVA FUNCIÓN DE VALIDACIÓN
  const validateForm = () => {
    const errors = {};
    if (!formData.productoId) {
      errors.productoId = "Debe seleccionar un producto.";
    }
    if (!formData.empleadoId) {
      errors.empleadoId = "Debe seleccionar un empleado.";
    }
    if (
      !formData.cantidad ||
      isNaN(parseInt(formData.cantidad)) ||
      parseInt(formData.cantidad) <= 0
    ) {
      errors.cantidad = "La cantidad debe ser un número positivo.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ¡CORRECCIÓN CLAVE!
  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    const dataToSubmit = {
      idProducto: formData.productoId,
      cantidad: Number(formData.cantidad),
      empleadoAsignado: formData.empleadoId,
    };
    onSubmit(dataToSubmit);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-abastecimiento-overlay">
        <div className="modal-abastecimiento-content formulario-modal">
          <button
            type="button"
            className="modal-close-button-x"
            onClick={onClose}
            disabled={isSubmitting}
          >
            &times;
          </button>
          <h2 className="abastecimiento-modal-title">
            Registrar Salida de Producto
          </h2>
          {/* isLoadingProductos podría usarse aquí si se quiere mostrar un loader general para el modal */}
          {/* Por ahora, el loader se maneja en los botones de selección o en la página principal */}
          <form
            className="abastecimiento-form-grid"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <AbastecimientoForm
              formData={formData}
              onInputChange={handleInputChange}
              onSelectProduct={() =>
                !isLoadingProductos && setShowProductSelectModal(true)
              } // No abrir si las dependencias están cargando
              onSelectEmployee={() =>
                !isLoadingProductos && setShowEmployeeSelectModal(true)
              } // No abrir si las dependencias están cargando
              isEditing={false}
              formErrors={formErrors}
            />
            <div className="form-actions-abastecimiento">
              <button
                type="submit"
                className="form-button-guardar-abastecimiento"
                disabled={isSubmitting || isLoadingProductos}
              >
                {isSubmitting ? "Guardando..." : "Guardar Registro"}
              </button>
              <button
                type="button"
                className="form-button-cancelar-abastecimiento"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>

      <ItemSelectionModal
        isOpen={showProductSelectModal}
        onClose={() => setShowProductSelectModal(false)}
        title="Seleccionar Producto"
        // Usar productosInternos de las props
        items={(productosInternos || []).map((p) => ({
          label: p.nombre,
          value: p.idProducto,
        }))}
        onSelectItem={(item) => {
          setFormData((prev) => ({
            ...prev,
            productoId: item.value,
            productoNombre: item.label,
          }));
          setShowProductSelectModal(false);
        }}
        searchPlaceholder="Buscar producto..."
        isLoading={isLoadingProductos} // Pasar estado de carga al modal de selección
      />

      <ItemSelectionModal
        isOpen={showEmployeeSelectModal}
        onClose={() => setShowEmployeeSelectModal(false)}
        title="Seleccionar Empleado"
        // Usar empleadosActivos de las props
        items={(empleadosActivos || []).map((emp) => ({
          label: emp.empleadoInfo?.nombre || emp.correo,
          value: emp.empleadoInfo?.idEmpleado || emp.idUsuario,
        }))}
        onSelectItem={(item) => {
          setFormData((prev) => ({
            ...prev,
            empleadoId: item.value,
            empleadoNombre: item.label,
          }));
          setShowEmployeeSelectModal(false);
        }}
        searchPlaceholder="Buscar empleado..."
        isLoading={isLoadingProductos} // Pasar estado de carga al modal de selección
      />
    </>
  );
};

export default AbastecimientoCrearModal;