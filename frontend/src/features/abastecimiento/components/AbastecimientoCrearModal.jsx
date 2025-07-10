// src/features/abastecimiento/components/AbastecimientoCrearModal.jsx
import React, { useState, useEffect } from "react";
import AbastecimientoForm from "./AbastecimientoForm";
import ItemSelectionModal from "../../../shared/components/common/ItemSelectionModal";

const AbastecimientoCrearModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  productosInternos,
  empleadosActivos,
  isLoadingProductos,
}) => {
  // Estado inicial del formulario
  const getInitialFormState = () => ({
    productoId: null,
    productoNombre: "",
    empleadoId: null,
    empleadoNombre: "",
    cantidad: "",
  });

  const [formData, setFormData] = useState(getInitialFormState());
  const [formErrors, setFormErrors] = useState({});
  const [showProductSelectModal, setShowProductSelectModal] = useState(false);
  const [showEmployeeSelectModal, setShowEmployeeSelectModal] = useState(false);

  // Resetear formulario y errores al abrir el modal
  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormState());
      setFormErrors({});
    }
  }, [isOpen]);

  // Manejar cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Validación del formulario
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

  // Guardar el registro
  const handleSave = () => {
    if (!validateForm()) return;
    const { productoNombre, empleadoNombre, ...dataToSubmit } = formData; // eslint-disable-line no-unused-vars
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
              }
              onSelectEmployee={() =>
                !isLoadingProductos && setShowEmployeeSelectModal(true)
              }
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
        isLoading={isLoadingProductos}
      />

      <ItemSelectionModal
        isOpen={showEmployeeSelectModal}
        onClose={() => setShowEmployeeSelectModal(false)}
        title="Seleccionar Empleado"
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
        isLoading={isLoadingProductos}
      />
    </>
  );
};

export default AbastecimientoCrearModal;