// src/features/roles/components/RolEditarModal.jsx
import React, { useState, useEffect, useCallback } from "react";
import RolForm from "./RolForm";
import { getRoleDetailsAPI } from "../services/rolesService";

const RolEditarModal = ({
  isOpen,
  onClose,
  onSubmit,
  roleId,
  permisosDisponibles,
  permisosAgrupados,
  formErrors = {}, // Recibir formErrors como prop
}) => {
  const [formData, setFormData] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    idPermisos: [],
    estado: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState(null); // Estado para errores de carga

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
    setGeneralError(null);
    try {
      const roleDetails = await getRoleDetailsAPI(roleId);
      setFormData({
        id: roleDetails.idRol,
        nombre: roleDetails.nombre,
        descripcion: roleDetails.descripcion || "",
        estado: roleDetails.estado,
        idPermisos: roleDetails.permisos?.map((p) => p.idPermiso) || [],
      });
    } catch (err) {
      setGeneralError(err.message || "Error al cargar los detalles del rol.");
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

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (isRoleAdminProtected) {
      onClose();
      return;
    }
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
        ) : generalError ? (
          <p className="error-message">{generalError}</p>
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
