// src/features/roles/components/RolEditarModal.jsx
import React, { useState, useEffect, useCallback } from "react";
import RolForm from "./RolForm";
import { getRoleDetailsAPI, rolesService } from "../services/rolesService";

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
  const [isLoading, setIsLoading] = useState(false);
  const [originalNombre, setOriginalNombre] = useState('');

  const isRoleAdminProtected = formData.nombre === "Administrador";

  const cargarDetallesRol = useCallback(async () => {
    if (!roleId) return;
    setIsLoading(true);
    setErrors({});
    try {
      const roleDetails = await getRoleDetailsAPI(roleId);
      setFormData({
        id: roleDetails.idRol,
        nombre: roleDetails.nombre,
        descripcion: roleDetails.descripcion || "",
        estado: roledetails.estado,
        idPermisos: roleDetails.permisos?.map((p) => p.idPermiso) || [],
      });
      setOriginalNombre(roleDetails.nombre);
    } catch (err) {
      setErrors({
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

  const validateField = async (name, value) => {
    let error = "";
    switch (name) {
      case "nombre":
        if (!value) {
          error = "El nombre del rol es obligatorio.";
        } else if (value.length < 3) {
          error = "El nombre del rol debe tener al menos 3 caracteres.";
        } else if (value.length > 50) {
          error = "El nombre del rol no debe exceder los 50 caracteres.";
        } else if (value !== originalNombre) {
            try {
                const uniquenessErrors = await rolesService.verificarDatosUnicos({ nombre: value });
                if (uniquenessErrors.nombre) {
                    error = uniquenessErrors.nombre;
                }
            } catch (err) {
                error = "No se pudo verificar el nombre del rol.";
            }
        }
        break;
      case "descripcion":
        if (value.length > 255) {
          error = "La descripción no debe exceder los 255 caracteres.";
        }
        break;
      case "tipoPerfil":
        if (!value) {
          error = "El tipo de perfil es obligatorio.";
        }
        break;
      case "idPermisos":
        if (!isRoleAdminProtected && (!value || value.length === 0)) {
            error = "Debe seleccionar al menos un permiso.";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleFormChange = async (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    const errorMessage = await validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: errorMessage }));
  };

  const handleBlur = async (e) => {
    const { name, value } = e.target;
    const errorMessage = await validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: errorMessage }));
  };

  const handleToggleModulo = (permisoId) => {
    if (isRoleAdminProtected) return;
    const idPermisosActuales = formData.idPermisos || [];
    const idPermisosNuevos = idPermisosActuales.includes(permisoId)
        ? idPermisosActuales.filter(id => id !== permisoId)
        : [...idPermisosActuales, permisoId];
    handleFormChange('idPermisos', idPermisosNuevos);
  };

  const handleSelectAll = () => {
    if (isRoleAdminProtected) return;
    const allIds = permisosDisponibles.map((p) => p.idPermiso);
    handleFormChange('idPermisos', allIds);
  };

  const handleDeselectAll = () => {
    if (isRoleAdminProtected) return;
    handleFormChange('idPermisos', []);
  };

  const validateForm = async () => {
    const newErrors = {};
    const fieldsToValidate = ['nombre', 'tipoPerfil', 'idPermisos'];

    for (const field of fieldsToValidate) {
        const errorMessage = await validateField(field, formData[field]);
        if (errorMessage) {
            newErrors[field] = errorMessage;
        }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (isRoleAdminProtected) {
      onClose();
      return;
    }
    const isValid = await validateForm();
    if (isValid) {
      onSubmit(formData);
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
        {isLoading ? (
          <p>Cargando...</p>
        ) : errors._general ? (
          <p className="error-message">{errors._general}</p>
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
                onBlur={handleBlur}
                permisosDisponibles={permisosDisponibles}
                permisosAgrupados={permisosAgrupados}
                onToggleModulo={handleToggleModulo}
                onSelectAll={handleSelectAll}
                onDeselectAll={handleDeselectAll}
                isEditing={true}
                isRoleAdmin={isRoleAdminProtected}
                errors={errors}
              />
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
