// src/features/usuarios/components/UsuarioEditarModal.jsx
import React, { useState, useEffect } from "react";
import UsuarioForm from "./UsuarioForm";
import { getRolesAPI, verificarCorreoUsuarioAPI } from "../services/usuariosService"; // Importar servicio

const UsuarioEditarModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading, // Nueva prop para el estado de carga del submit
}) => {
  const [formData, setFormData] = useState({});
  const [availableRoles, setAvailableRoles] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isLoadingRoles, setIsLoadingRoles] = useState(false); // Para la carga inicial de roles

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
        } catch { // error variable removed as it's unused
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

  const handleFieldBlur = async (name, value) => {
    if (name === 'correo' && initialData?.idUsuario) {
      if (!value?.trim()) {
        setFormErrors(prev => ({ ...prev, correo: "El correo es obligatorio." }));
        return;
      }
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(value)) {
        setFormErrors(prev => ({ ...prev, correo: "El formato del correo no es válido." }));
        return;
      }
      const originalEmail = initialData.clienteInfo?.correo || initialData.empleadoInfo?.correo || initialData.correo;
      if (value === originalEmail) {
         setFormErrors(prev => ({ ...prev, correo: "" }));
        return;
      }
      try {
        await verificarCorreoUsuarioAPI(value, initialData.idUsuario);
        setFormErrors(prev => ({ ...prev, correo: "" }));
      } catch (error) {
        if (error && error.field === "correo") {
          setFormErrors(prev => ({ ...prev, correo: error.message }));
        } else {
          setFormErrors(prev => ({ ...prev, correo: "Error al verificar correo." }));
        }
      }
    }
    // TODO: Añadir validación onBlur para numeroDocumento si es necesario,
    // llamando a un endpoint de verificación para clientes/empleados.
  };

  const isFormCompletelyValid = () => {
    const noActiveErrors = Object.values(formErrors).every(errorMsg => !errorMsg); // Verifica que no haya strings de error
    if (!noActiveErrors) return false;

    // Comprobación adicional de campos requeridos que no se validan en onBlur
    const selectedRole = availableRoles.find(rol => rol.idRol === parseInt(formData.idRol));
    const requiresProfile = selectedRole && (selectedRole.nombre === 'Cliente' || selectedRole.nombre === 'Empleado');

    if (requiresProfile) {
        if (!formData.nombre?.trim()) return false;
        if (!formData.apellido?.trim()) return false;
        if (!formData.tipoDocumento) return false;
        if (!formData.numeroDocumento?.trim()) return false;
        if (!formData.telefono?.trim()) return false;
        if (!formData.fechaNacimiento) return false;
    }
    if (!formData.idRol) return false;
    if (!formData.correo?.trim()) return false; // Correo es siempre requerido

    return true;
  };

  const validateForm = () => { // Esta función ahora se enfoca en validaciones que no son onBlur o como una última verificación
    const errors = {...formErrors}; // Mantener errores de onBlur
    const emailRegex = /\S+@\S+\.\S+/;

    // Validar campos de perfil solo si el rol los requiere y no hay error previo de onBlur
    const rolIdSeleccionado = parseInt(formData.idRol, 10);
    const rolSeleccionado = availableRoles.find(r => r.idRol === rolIdSeleccionado);
    const requierePerfil = rolSeleccionado && (rolSeleccionado.nombre === 'Cliente' || rolSeleccionado.nombre === 'Empleado');

    if (requierePerfil) {
        if (!formData.nombre?.trim() && !errors.nombre) errors.nombre = "El nombre es obligatorio.";
        if (!formData.apellido?.trim() && !errors.apellido) errors.apellido = "El apellido es obligatorio.";
        if (!formData.telefono?.trim() && !errors.telefono) errors.telefono = "El teléfono es obligatorio.";
        if (!formData.tipoDocumento && !errors.tipoDocumento) errors.tipoDocumento = "El tipo de documento es obligatorio.";
        if (!formData.numeroDocumento?.trim() && !errors.numeroDocumento) errors.numeroDocumento = "El número de documento es obligatorio.";
        if (!formData.fechaNacimiento && !errors.fechaNacimiento) errors.fechaNacimiento = "La fecha de nacimiento es obligatoria para este rol.";
    }

    if (!errors.correo) {
      if (!formData.correo?.trim()) {
        errors.correo = "El correo es obligatorio.";
      } else if (!emailRegex.test(formData.correo)) {
        errors.correo = "El formato del correo no es válido.";
      }
    }

    if (!formData.idRol && !errors.idRol) errors.idRol = "Debe seleccionar un rol.";

    setFormErrors(errors);
    // La validez general ahora la determina isFormCompletelyValid para el botón de submit
    return Object.values(errors).every(errorMsg => !errorMsg);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (isUserAdminProtected) {
      onClose();
      return;
    }
    // Re-validar todo antes de enviar, por si acaso.
    // Y luego comprobar con isFormCompletelyValid que incluye las validaciones onBlur.
    validateForm();
    if (!isFormCompletelyValid()) return;

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
              onFieldBlur={handleFieldBlur} // Pasar la función de onBlur
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
                disabled={isLoadingRoles || isLoading || !isFormCompletelyValid()} // Añadido isLoading
              >
                {isLoading ? "Actualizando..." : "Actualizar Usuario"}
              </button>
              <button
                type="button"
                className="usuarios-form-buttonCancelar"
                onClick={onClose}
                disabled={isLoading} // También deshabilitar cancelar durante la carga
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
                // No necesita disabled={isLoading} si solo cierra y no hace submit
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