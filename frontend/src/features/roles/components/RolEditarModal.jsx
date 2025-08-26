// src/features/roles/components/RolEditarModal.jsx
import React, { useState, useEffect, useCallback } from "react";
import RolForm from "./RolForm";
import { getRoleDetailsAPI, verificarNombreUnico } from "../services/rolesService.js";

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
  const [originalNombre, setOriginalNombre] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
    setErrors({});
    try {
      const roleDetails = await getRoleDetailsAPI(roleId);
      setFormData({
        id: roleDetails.idRol,
        nombre: roleDetails.nombre,
        descripcion: roleDetails.descripcion || "",
        estado: roleDetails.estado,
        tipoPerfil: roleDetails.tipoPerfil,
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

  const validateField = async (name, value) => {
    let errorMessage = null;
    switch (name) {
      case 'nombre':
        if (!value.trim()) {
          errorMessage = "El nombre del rol es obligatorio.";
        } else if (value.length > 50) {
          errorMessage = "El nombre no puede exceder los 50 caracteres.";
        } else if (value !== originalNombre) {
            try {
                const uniquenessErrors = await verificarNombreUnico({ nombre: value });
                if (uniquenessErrors.nombre) {
                    errorMessage = uniquenessErrors.nombre;
                }
            } catch (error) {
                console.error(`API error during nombre validation:`, error);
                errorMessage = "No se pudo conectar con el servidor para validar.";
            }
        }
        break;
      case 'tipoPerfil':
        if (!value) {
            errorMessage = "Debe seleccionar un tipo de perfil."
        }
        break;
      default:
        break;
    }
    return errorMessage;
  };

  const handleBlur = async (e) => {
    const { name, value } = e.target;
    const errorMessage = await validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: errorMessage }));
  };

  const validateFormOnSubmit = async () => {
    const newErrors = {};
    const fieldsToValidate = ['nombre', 'tipoPerfil'];

    for (const field of fieldsToValidate) {
        const errorMessage = await validateField(field, formData[field]);
        if (errorMessage) {
            newErrors[field] = errorMessage;
        }
    }

    if (!isRoleAdminProtected && (!formData.idPermisos || formData.idPermisos.length === 0)) {
      newErrors.permisos = "Debe seleccionar al menos un permiso.";
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
    const isValid = await validateFormOnSubmit();
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
            <form onSubmit={handleSubmitForm} noValidate>
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
              {errors.permisos && (
                <p className="rol-error-permisos">{errors.permisos}</p>
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
