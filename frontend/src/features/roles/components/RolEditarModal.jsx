// INICIO DE MODIFICACIÓN
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
}) => {
  const [formData, setFormData] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    idPermisos: [],
    estado: true,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

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
    setInitialLoading(true);
    setErrors({});
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
      setErrors({
        general: err.message || "Error al cargar los detalles del rol.",
      });
    } finally {
      setInitialLoading(false);
    }
  }, [roleId]);

  useEffect(() => {
    if (isOpen) {
      cargarDetallesRol();
    }
  }, [isOpen, cargarDetallesRol]);

  const handleFormChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prevErr) => ({ ...prevErr, [name]: null }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRoleAdminProtected) {
      onClose();
      return;
    }
    setErrors({});
    setLoading(true);
    try {
        await onSubmit(formData);
    } catch (error) {
        if (error.response && error.response.status === 400) {
            const backendErrors = error.response.data.errors.reduce((acc, err) => {
                acc[err.param] = err.msg;
                return acc;
            }, {});
            setErrors(backendErrors);
        } else {
            setErrors({ general: error.message || "Ocurrió un error inesperado al actualizar el rol." });
        }
    } finally {
        setLoading(false);
    }
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
        {initialLoading ? (
          <p>Cargando...</p>
        ) : errors.general ? (
          <p className="error-message">{errors.general}</p>
        ) : (
          <>
            {isRoleAdminProtected && (
              <p className="rol-admin-message">
                El rol 'Administrador' tiene permisos fijos y no puede ser
                modificado.
              </p>
            )}
            <form onSubmit={handleSubmit}>
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
                errors={errors}
              />
              {errors.permisos && (
                <p className="rol-error-permisos">{errors.permisos}</p>
              )}
              {!isRoleAdminProtected ? (
                <div className="rol-form-actions">
                  <button type="submit" className="rol-form-buttonGuardar" disabled={loading}>
                    {loading ? 'Actualizando...' : 'Actualizar Rol'}
                  </button>
                  <button
                    type="button"
                    className="rol-form-buttonCancelar"
                    onClick={onClose}
                    disabled={loading}
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
// FIN DE MODIFICACIÓN

export default RolEditarModal;
