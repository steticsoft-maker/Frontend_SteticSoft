// src/features/roles/components/RolEditarModal.jsx
import React, { useState, useEffect, useCallback } from "react";
import RolForm from "./RolForm";
import { getRoleDetailsAPI } from "../services/rolesService";

const descriptionRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,:;_-]+$/;
const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ_\s]+$/;


const RolEditarModal = ({
  isOpen,
  onClose,
  onSubmit,
  roleId,
  permisosDisponibles,
  permisosAgrupados,
}) => {
  const [formData, setFormData] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    tipoPerfil: "EMPLEADO", // Agregado: valor por defecto para tipoPerfil
    idPermisos: [],
    estado: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const isRoleAdminProtected = formData.nombre === "Administrador";

  // Funciones para Marcar/Desmarcar Todos los permisos
  const handleSelectAll = () => {
    if (isRoleAdminProtected) return;
    const allIds = permisosDisponibles.map((p) => p.idPermiso);
    setFormData((prev) => ({ ...prev, idPermisos: allIds }));
  };

  const handleDeselectAll = () => {
    if (isRoleAdminProtected) return;
    setFormData((prev) => ({ ...prev, idPermisos: [] }));
  };

  const cargarDetallesRol = useCallback(async () => {
    if (!roleId) return;
    setIsLoading(true);
    setFormErrors({});
    try {
      const roleDetails = await getRoleDetailsAPI(roleId);
      setFormData({
        id: roleDetails.idRol,
        nombre: roleDetails.nombre,
        descripcion: roleDetails.descripcion || "",
        tipoPerfil: roleDetails.tipoPerfil || "EMPLEADO", // Agregado: cargar tipoPerfil desde la API
        estado: roleDetails.estado,
        idPermisos: roleDetails.permisos?.map((p) => p.idPermiso) || [],
      });
    } catch (err) {
      setFormErrors({
        _general: err.message || "Error al cargar los detalles del rol.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [roleId]);

  useEffect(() => {
    if (isOpen) {
      cargarDetallesRol();
    }
  }, [isOpen, cargarDetallesRol]);

  const handleFormChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prevErr) => ({ ...prevErr, [name]: "" }));
    }
  };

  const handleToggleModulo = (permisoId) => {
    if (isRoleAdminProtected) return;
    setFormData((prev) => {
      const idPermisosActuales = prev.idPermisos || [];
      const idPermisosNuevos = idPermisosActuales.includes(permisoId)
        ? idPermisosActuales.filter((id) => id !== permisoId)
        : [...idPermisosActuales, permisoId];
      return { ...prev, idPermisos: idPermisosNuevos };
    });
  };

  const validateForm = () => {
        const errors = {};
        const { nombre, descripcion, tipoPerfil, idPermisos } = formData;

        // Validación para Nombre
        if (!nombre || !nombre.trim()) {
            errors.nombre = "El nombre del rol es obligatorio.";
        } else if (nombre.trim().length < 3) {
            errors.nombre = "El nombre debe tener al menos 3 caracteres.";
        } else if (nombre.trim().length > 50) { // <-- AÑADIDO
            errors.nombre = "El nombre no debe exceder los 50 caracteres.";
        } else if (!nameRegex.test(nombre)) {
            errors.nombre = "El nombre solo puede contener letras, espacios y guiones bajos.";
        }

        // Validación para Descripción
        if (!descripcion || !descripcion.trim()) {
            errors.descripcion = "La descripción es obligatoria.";
        } else if (descripcion.trim().length < 3) {
            errors.descripcion = "La descripción debe tener al menos 3 caracteres.";
        } else if (descripcion.trim().length > 250) { // <-- AÑADIDO
            errors.descripcion = "La descripción no debe exceder los 250 caracteres.";
        } else if (!descriptionRegex.test(descripcion)) {
            errors.descripcion = "La descripción contiene caracteres no válidos.";
        }
        
        // Validación para Tipo de Perfil (Corregida)
        if (!tipoPerfil) { // <-- CORREGIDO: Solo valida si está vacío
            errors.tipoPerfil = "Debe seleccionar un tipo de perfil.";
        }
        
        // Validación para Permisos
        if (!isRoleAdminProtected && (!idPermisos || idPermisos.length === 0)) {
            errors.permisos = "Debe seleccionar al menos un módulo.";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (isRoleAdminProtected) {
      onClose();
      return;
    }
    if (!validateForm()) return;
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="rol-modalOverlay">
      <div className="rol-modalContent rol-modalContent-form">
        <button
          type="button"
          className="modal-close-button-x"
          onClick={onClose}
        >
          &times;
        </button>
        <h2>Editar Rol</h2>
        {isLoading ? (
          <p>Cargando...</p>
        ) : formErrors._general ? (
          <p className="error-message">{formErrors._general}</p>
        ) : (
          <>
            {isRoleAdminProtected && (
              <p className="rol-admin-message">
                El rol 'Administrador' tiene permisos fijos y no puede ser
                modificado.
              </p>
            )}
            <form onSubmit={handleSubmitForm}>
              <RolForm
                formData={formData}
                onFormChange={handleFormChange}
                permisosDisponibles={permisosDisponibles}
                permisosAgrupados={permisosAgrupados}
                onToggleModulo={handleToggleModulo}
                onSelectAll={handleSelectAll} // <-- Añadido
                onDeselectAll={handleDeselectAll} // <-- Añadido
                isEditing={true}
                isRoleAdmin={isRoleAdminProtected}
                formErrors={formErrors}
              />
              {formErrors.permisos && (
                <p className="rol-error-permisos">{formErrors.permisos}</p>
              )}
              {!isRoleAdminProtected ? (
                <div className="rol-form-actions">
                  <button type="submit" className="rol-form-buttonGuardar">
                    Actualizar Rol
                  </button>
                  <button
                    type="button"
                    className="rol-form-buttonCancelar"
                    onClick={onClose}
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <div className="rol-form-actions">
                  <button
                    type="button"
                    className="rol-modalButton-cerrar"
                    onClick={onClose}
                  >
                    Cerrar
                  </button>
                </div>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default RolEditarModal;
