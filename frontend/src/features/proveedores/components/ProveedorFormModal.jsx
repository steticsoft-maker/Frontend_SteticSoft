// src/features/proveedores/components/ProveedorFormModal.jsx
import React, { useState, useEffect } from 'react';
import ProveedorForm from './ProveedorForm';

const ProveedorFormModal = ({ isOpen, onClose, onSubmit, initialData, modalType }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({ ...initialData });
      } else { // Creación
        setFormData({
          tipoDocumento: "Natural", // Default
          tipoDocumentoNatural: "CC", // Default
          estado: "Activo", // Default para nuevos
          nombre: "", nombreEmpresa: "", numeroDocumento: "", nit: "",
          telefono: "", email: "", direccion: "",
          personaEncargadaNombre: "", personaEncargadaTelefono: "", personaEncargadaEmail: ""
        });
      }
    }
  }, [initialData, isOpen]);

  const handleFormChange = (name, value, resetData = null) => {
    setFormData(prev => ({
      ...prev,
      ...(resetData || {}), // Aplicar resetData si existe (para cambio de tipoDocumento)
      [name]: value
    }));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-Proveedores"> {/* Clase del CSS original */}
      <div className="modal-content-Proveedores"> {/* Clase del CSS original */}
        <h3>{modalType === 'agregar' ? 'Agregar Proveedor' : 'Editar Proveedor'}</h3>
        <form onSubmit={handleSubmitForm}> {/* El CSS original no usa grid explícito aquí, sino en el modal-content. Adaptar si es necesario. */}
          <ProveedorForm
            formData={formData}
            onFormChange={handleFormChange}
            isEditing={modalType === 'editar'}
          />
          <div className="botonesGuardarCancelarAgregarEditarProveedor"> {/* Clase del CSS original */}
            <button type="submit" className="botonGuardarEditarProveedor">Guardar</button> {/* Clase del CSS original */}
            <button type="button" className="botonCancelarEditarProveedor" onClick={onClose}>Cancelar</button> {/* Clase del CSS original */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProveedorFormModal;