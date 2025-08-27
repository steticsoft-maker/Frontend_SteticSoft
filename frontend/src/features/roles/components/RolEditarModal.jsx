// src/features/roles/components/RolEditarModal.jsx
import React, { useState, useEffect, useCallback } from "react";
import RolForm from "./RolForm";
import { getRoleDetailsAPI } from "../services/rolesService";

// INICIO DE MODIFICACIÓN: Aceptar 'errors' como prop.
const RolEditarModal = ({
  isOpen,
  onClose,
  onSubmit,
  roleId,
  permisosDisponibles,
  permisosAgrupados,
  errors,
}) => {
  // FIN DE MODIFICACIÓN

  const [formData, setFormData] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    idPermisos: [],
    estado: true,
  });
  // INICIO DE MODIFICACIÓN: Se elimina el estado de errores interno.
  // const [formErrors, setFormErrors] = useState({});
  // FIN DE MODIFICACIÓN
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null); // Estado para error de carga

  const isRoleAdminProtected = formData.nombre === "Administrador";

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
    setLoadError(null); // Limpiar error de carga anterior
    try {
      const roleDetails = await getRoleDetailsAPI(roleId);
      setFormData({
        id: roleDetails.idRol,
        nombre: roleDetails.nombre,
        descripcion: roleDetails.descripcion || "",
        estado: roleDetails.estado,
        tipoPerfil: roleDetails.tipo_perfil || 'EMPLEADO', // Asegurar que tipoPerfil se cargue
        idPermisos: roleDetails.permisos?.map((p) => p.idPermiso) || [],
      });
    } catch (err) {
      setLoadError(err.message || "Error al cargar los detalles del rol.");
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

  // INICIO DE MODIFICACIÓN: Se elimina la validación del lado del cliente.
  /*
  const validateForm = () => { ... };
  */
  // FIN DE MODIFICACIÓN

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (isRoleAdminProtected) {
      onClose();
      return;
    }
    // INICIO DE MODIFICACIÓN: Se elimina la llamada a la validación del cliente.
    // if (!validateForm()) return;
    onSubmit(formData);
    // FIN DE MODIFICACIÓN
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
        ) : loadError ? (
          <p className="error-message">{loadError}</p>
        ) : (
          <>
            {isRoleAdminProtected && (
              <p className="rol-admin-message">
                El rol 'Administrador' tiene permisos fijos y no puede ser
                modificado.
              </p>
            )}
            <form onSubmit={handleSubmitForm}>
              {/* INICIO DE MODIFICACIÓN: Pasar 'errors' en lugar de 'formErrors' */}
              <RolForm
                formData={formData}
                onFormChange={handleFormChange}
                permisosDisponibles={permisosDisponibles}
                permisosAgrupados={permisosAgrupados}
                onToggleModulo={handleToggleModulo}
                onSelectAll={handleSelectAll}
                onDeselectAll={handleDeselectAll}
                isEditing={true}
                isRoleAdmin={isRoleAdminProtected}
                errors={errors} // Se pasa el nuevo prop de errores
              />
              {/* FIN DE MODIFICACIÓN */}

              {errors.idPermisos && (
                <p className="rol-error-permisos">{errors.idPermisos}</p>
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
