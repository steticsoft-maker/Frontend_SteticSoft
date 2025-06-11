// src/features/usuarios/components/UsuarioEditarModal.jsx
import React, { useState, useEffect } from "react";
import UsuarioForm from "./UsuarioForm";
import { getRolesAPI } from "../services/usuariosService";

const UsuarioEditarModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData, // Espera un objeto usuario completo de la API, ej. con initialData.clienteInfo
}) => {
  const [formData, setFormData] = useState({});
  const [availableRoles, setAvailableRoles] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);

  // Determinar si el usuario es el admin protegido basándose en el nombre del rol.
  const isUserAdminProtected = initialData?.rol?.nombre === "Administrador";

  useEffect(() => {
    if (isOpen && initialData) {
      // Extraer información del perfil (cliente o empleado) para mayor claridad.
      // Ambos, Cliente y Empleado, ahora tienen 'nombre', 'apellido', 'correo', 'telefono'.
      const perfil = initialData.clienteInfo || initialData.empleadoInfo || {};

      setFormData({
        idUsuario: initialData.idUsuario,
        // Campos de Perfil
        nombre: perfil.nombre || "",
        apellido: perfil.apellido || "", // Usar apellido
        correo: perfil.correo || "", // Usar el correo del perfil
        telefono: perfil.telefono || "", // Usar telefono, ya no existe 'celular' en Empleado
        tipoDocumento: perfil.tipoDocumento || "Cédula de Ciudadanía",
        numeroDocumento: perfil.numeroDocumento || "",
        fechaNacimiento: perfil.fechaNacimiento || "",
        // direccion: perfil.direccion || '', // Omitido si no se usa consistentemente
        idRol: initialData.rol?.idRol || initialData.idRol || "", // Usar idRol del objeto rol si está presente
        estado: initialData.estado !== undefined ? initialData.estado : true, // Default a activo si no se define

        // La contraseña no se carga para edición. Se maneja en un flujo separado si se desea cambiar.
      });
      setFormErrors({});

      setIsLoadingRoles(true);
      const fetchRoles = async () => {
        try {
          const response = await getRolesAPI();
          // Asegúrate que response.data sea el array de roles, o response directamente si la API lo devuelve así.
          setAvailableRoles(response.data || response || []);
        } catch (error) {
          setFormErrors((prev) => ({
            ...prev,
            _general: "No se pudieron cargar los roles.",
          }));
          setAvailableRoles([]);
        } finally {
          setIsLoadingRoles(false);
        }
      };
      fetchRoles();
    } else if (isOpen && !initialData) {
      // Este caso no debería ocurrir si ListaUsuariosPage envía initialData correctamente.
      // console.warn("Modal de edición abierto sin initialData.");
      onClose(); // Cerrar si no hay datos para editar.
    }
  }, [isOpen, initialData, onClose]);

  const handleFormChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prevErr) => ({ ...prevErr, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /\S+@\S+\.\S+/;

    if (!formData.nombre?.trim()) errors.nombre = "El nombre es obligatorio.";
    if (!formData.apellido?.trim()) // Validar apellido
      errors.apellido = "El apellido es obligatorio.";
    if (!formData.correo?.trim()) { // Validar correo (del perfil y de la cuenta)
      errors.correo = "El correo es obligatorio.";
    } else if (!emailRegex.test(formData.correo)) {
      errors.correo = "El formato del correo no es válido.";
    }
    if (!formData.telefono?.trim()) // Validar teléfono
      errors.telefono = "El teléfono es obligatorio.";
    if (!formData.tipoDocumento)
      errors.tipoDocumento = "El tipo de documento es obligatorio.";
    if (!formData.numeroDocumento?.trim())
      errors.numeroDocumento = "El número de documento es obligatorio.";
    if (!formData.idRol) errors.idRol = "Debe seleccionar un rol.";

    // Validar fechaNacimiento si el rol es Cliente o Empleado
    const rolIdSeleccionado = parseInt(formData.idRol, 10);
    const rolSeleccionado = availableRoles.find(
      (r) => r.idRol === rolIdSeleccionado
    );
    if (
      rolSeleccionado &&
      (rolSeleccionado.nombre === "Cliente" ||
        rolSeleccionado.nombre === "Empleado")
    ) {
      if (!formData.fechaNacimiento)
        errors.fechaNacimiento =
          "La fecha de nacimiento es obligatoria para este rol.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (isUserAdminProtected) {
      onClose(); // No permitir edición del admin protegido desde aquí
      return;
    }
    if (!validateForm()) return;

    // El formData ya tiene los nombres de campo alineados con UsuarioForm y la API.
    // ListaUsuariosPage.handleSaveUsuario se encargará de llamar a updateUsuarioAPI.
    onSubmit(formData);
  };

  if (!isOpen || !initialData) return null;

  return (
    <div className="usuarios-modalOverlay">
      <div className="usuarios-modalContent usuarios-modalContent-form">
        <h2>Editar Usuario</h2>
        {isUserAdminProtected && (
          <p className="usuarios-admin-protected-message">
            El usuario 'Administrador' tiene campos y acciones restringidas.
          </p>
        )}
        <form onSubmit={handleSubmitForm}>
          {isLoadingRoles ? (
            <p style={{ textAlign: "center", margin: "20px 0" }}>
              Cargando información...
            </p>
          ) : (
            <UsuarioForm
              formData={formData}
              onFormChange={handleFormChange}
              availableRoles={availableRoles}
              isEditing={true}
              isUserAdmin={isUserAdminProtected}
              formErrors={formErrors}
            />
          )}
          {formErrors._general && (
            <p className="auth-form-error" style={{ textAlign: "center" }}>
              {formErrors._general}
            </p>
          )}

          {!isUserAdminProtected ? (
            <div className="usuarios-form-actions">
              <button
                type="submit"
                className="usuarios-form-buttonGuardar"
                disabled={isLoadingRoles}
              >
                Actualizar Usuario
              </button>
              <button
                type="button"
                className="usuarios-form-buttonCancelar"
                onClick={onClose}
              >
                Cancelar
              </button>
            </div>
          ) : (
            <div className="usuarios-form-actions">
              <button
                type="button"
                className="usuarios-modalButton-cerrar"
                onClick={onClose}
              >
                Cerrar
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UsuarioEditarModal;