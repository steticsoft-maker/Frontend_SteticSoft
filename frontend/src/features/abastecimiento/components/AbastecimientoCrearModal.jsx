// src/features/abastecimiento/components/AbastecimientoCrearModal.jsx
import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from 'react-dom'; // Importar ReactDOM
import AbastecimientoForm from "./AbastecimientoForm";
import ItemSelectionModal from "../../../shared/components/common/ItemSelectionModal";
import { abastecimientoService } from "../services/abastecimientoService";

const AbastecimientoCrearModal = ({ isOpen, onClose, onSubmit }) => {
  const getInitialFormState = () => ({
    productoId: null,
    productoNombre: "",
    empleadoId: null,
    empleadoNombre: "",
    cantidad: "",
  });

  const [formData, setFormData] = useState(getInitialFormState());
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [productos, setProductos] = useState([]);
  const [empleados, setEmpleados] = useState([]);

  const [showProductSelectModal, setShowProductSelectModal] = useState(false);
  const [showEmployeeSelectModal, setShowEmployeeSelectModal] = useState(false);

  const cargarDependencias = useCallback(async () => {
    setIsLoading(true);
    try {
      const [prods, emps] = await Promise.all([
        abastecimientoService.getProductosActivosUsoInterno(),
        abastecimientoService.getEmpleadosActivos(),
      ]);
      setProductos(prods);
      setEmpleados(emps);
    } catch {
      setFormErrors({
        _general: "No se pudieron cargar los datos para el formulario.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      cargarDependencias();
      setFormData(getInitialFormState());
      setFormErrors({});
    }
  }, [isOpen, cargarDependencias]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const { ...dataToSubmit } = formData;
    onSubmit(dataToSubmit);
  };

  if (!isOpen) return null;

  const modalContent = (
    <>
      <div className="modal-abastecimiento-overlay">
        <div className="modal-abastecimiento-content formulario-modal">
          <button type="button" className="modal-close-button-x" onClick={onClose}>
            &times;
          </button>
          <h2 className="abastecimiento-modal-title">
            Registrar Salida de Producto
          </h2>
          {isLoading && <p>Cargando datos...</p>}
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
              onSelectProduct={() => setShowProductSelectModal(true)}
              onSelectEmployee={() => setShowEmployeeSelectModal(true)}
              isEditing={false}
              formErrors={formErrors}
              categorias={[]} // No se usa en creación
              onCategoryChange={() => {}} // No se usa en creación
            />
            <div className="form-actions-abastecimiento">
              <button
                type="submit"
                className="form-button-guardar-abastecimiento"
                disabled={isLoading}
              >
                Guardar Registro
              </button>
              <button
                type="button"
                className="form-button-cancelar-abastecimiento"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ItemSelectionModal también es un modal. Si sufre el mismo problema, necesitará un Portal.
          Por ahora, el requerimiento es solo para los modales principales de Abastecimiento.
          Si ItemSelectionModal se renderiza *dentro* de AbastecimientoCrearModal ANTES del portal,
          entonces el portal de AbastecimientoCrearModal también movería ItemSelectionModal.
          Si ItemSelectionModal se renderiza como hermano (como está aquí), entonces necesitaría su propio portal
          si el problema de stacking context le afecta. Vamos a asumir que ItemSelectionModal no tiene el problema
          o se tratará por separado. Por ahora, lo dejamos fuera del portal principal para que siga funcionando
          como un modal que puede aparecer sobre el modal de creación/edición si es necesario.
          Sin embargo, para una correcta visualización si el modal principal está en un portal,
          ItemSelectionModal también debería estar en un portal.
      */}
      <ItemSelectionModal
        isOpen={showProductSelectModal}
        onClose={() => setShowProductSelectModal(false)}
        title="Seleccionar Producto"
        items={productos.map((p) => ({
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
      />

      <ItemSelectionModal
        isOpen={showEmployeeSelectModal}
        onClose={() => setShowEmployeeSelectModal(false)}
        title="Seleccionar Empleado"
        items={empleados.map((emp) => ({
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
      />
    </>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.body
  );
};

export default AbastecimientoCrearModal;