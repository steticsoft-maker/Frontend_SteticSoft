import React, { useState, useEffect, useCallback } from "react";
import NavbarAdmin from "../../../shared/components/layout/NavbarAdmin";
import UsuariosTable from "../components/UsuariosTable";
import UsuarioCrearModal from "../components/UsuarioCrearModal";
import UsuarioEditarModal from "../components/UsuarioEditarModal";
import UsuarioDetalleModal from "../components/UsuarioDetalleModal";
import ConfirmModal from "../../../shared/components/common/ConfirmModal";
import ValidationModal from "../../../shared/components/common/ValidationModal";
import Pagination from "../../../shared/components/common/Pagination";
import {
  getUsuariosAPI,
  createUsuarioAPI,
  updateUsuarioAPI,
  toggleUsuarioEstadoAPI,
  getRolesAPI,
} from "../services/usuariosService";
import "../css/Usuarios.css";

function ListaUsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorPage, setErrorPage] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [currentUsuario, setCurrentUsuario] = useState(null);
  
  // --- Estados para Modales ---
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  // --- Estados para la Paginación ---
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  const cargarDatos = useCallback(async () => {
    try {
      const [usuariosResponse, rolesResponse] = await Promise.all([ getUsuariosAPI(), getRolesAPI() ]);
      const rolesFromAPI = rolesResponse.data || [];
      const filteredRoles = rolesFromAPI.filter(rol => rol.nombre !== 'Administrador');
      setUsuarios(usuariosResponse.data || []);
      setAvailableRoles(filteredRoles);
    } catch (err) {
      setErrorPage(err.message || "No se pudieron cargar los datos.");
    }
  }, []);

  useEffect(() => {
    setIsLoadingPage(true);
    cargarDatos().finally(() => setIsLoadingPage(false));
  }, [cargarDatos]);

  const filteredUsuarios = usuarios.filter((u) => {
    const perfil = u.clienteInfo || u.empleadoInfo || {};
    const busquedaLower = busqueda.toLowerCase();
    return (
      perfil.nombre?.toLowerCase().includes(busquedaLower) ||
      perfil.apellido?.toLowerCase().includes(busquedaLower) ||
      u.correo?.toLowerCase().includes(busquedaLower) ||
      perfil.numeroDocumento?.includes(busqueda)
    );
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [busqueda]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsuarios.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const closeModal = useCallback(() => {
        setIsCrearModalOpen(false);
        setIsEditarModalOpen(false);
        setIsDetailsModalOpen(false);
        setIsDeleteModalOpen(false);
        setIsValidationModalOpen(false);
        setCurrentUsuario(null);
        setValidationMessage("");
    }, []);

    const handleOpenModal = useCallback((type, usuario = null) => {
        const rolNombre = usuario?.rol?.nombre;
        if (rolNombre === "Administrador" && (type === "edit" || type === "delete")) {
        setValidationMessage(`El usuario 'Administrador' no puede ser ${type === "edit" ? "editado" : "eliminado"}.`);
        setIsValidationModalOpen(true);
        return;
        }
        setCurrentUsuario(usuario);
        if (type === "details") setIsDetailsModalOpen(true);
        else if (type === "delete") setIsDeleteModalOpen(true);
        else if (type === "create") setIsCrearModalOpen(true);
        else if (type === "edit" && usuario) setIsEditarModalOpen(true);
    }, []);

    const handleSaveUsuario = useCallback(async (formData) => {
        setIsSubmitting(true);
        try {
        const dataParaAPI = { ...formData };
        delete dataParaAPI.confirmarContrasena;
        if (dataParaAPI.idUsuario) {
            await updateUsuarioAPI(dataParaAPI.idUsuario, dataParaAPI);
        } else {
            await createUsuarioAPI(dataParaAPI);
        }
        closeModal();
        await cargarDatos();
        } catch (err) {
        setValidationMessage(err.response?.data?.message || err.message || "Error al guardar el usuario.");
        setIsValidationModalOpen(true);
        } finally {
        setIsSubmitting(false);
        }
    }, [cargarDatos, closeModal]);
    
    const handleDeleteUsuario = useCallback(async () => {
        if (!currentUsuario?.idUsuario) return;
        setIsSubmitting(true);
        try {
        await toggleUsuarioEstadoAPI(currentUsuario.idUsuario, false);
        closeModal();
        await cargarDatos();
        } catch (err) {
        setValidationMessage(err.message || "Error al eliminar el usuario.");
        setIsValidationModalOpen(true);
        } finally {
        setIsSubmitting(false);
        }
    }, [currentUsuario, cargarDatos, closeModal]);

    const handleToggleEstadoUsuario = useCallback(async (usuario) => {
        if (!usuario?.idUsuario) return;
        if (usuario.rol?.nombre === "Administrador") {
        setValidationMessage("El estado del usuario 'Administrador' no puede ser modificado.");
        setIsValidationModalOpen(true);
        return;
        }
        try {
        const nuevoEstado = !usuario.estado;
        await toggleUsuarioEstadoAPI(usuario.idUsuario, nuevoEstado);
        await cargarDatos();
        } catch (err) {
        setValidationMessage(err.message || "Error al cambiar el estado del usuario.");
        setIsValidationModalOpen(true);
        }
    }, [cargarDatos]);


  return (
    <div className="usuarios-container">
      <NavbarAdmin />
      <div className="usuarios-content">
        <h1>Gestión de Usuarios ({usuarios.length})</h1>
        <div className="usuarios-accionesTop">
          <input
            type="text"
            placeholder="Buscar por nombre, correo o documento..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="usuarios-barraBusqueda"
            disabled={isLoadingPage}
          />
          <button
            className="usuarios-botonAgregar"
            onClick={() => handleOpenModal("create")}
            disabled={isLoadingPage || isSubmitting}
          >
            Crear Usuario
          </button>
        </div>

        {isLoadingPage && <p style={{ textAlign: 'center', margin: '20px 0' }}>Cargando datos...</p>}
        {errorPage && <p className="auth-form-error" style={{ textAlign: 'center', marginTop: '20px' }}>Error: {errorPage}</p>}
        
        {!isLoadingPage && !errorPage && (
          <>
            <UsuariosTable
              usuarios={currentUsers} 
              onView={(usuario) => handleOpenModal("details", usuario)}
              onEdit={(usuario) => handleOpenModal("edit", usuario)}
              onDeleteConfirm={(usuario) => handleOpenModal("delete", usuario)}
              onToggleAnular={handleToggleEstadoUsuario}
            />
            <Pagination
              itemsPerPage={usersPerPage}
              totalItems={filteredUsuarios.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </>
        )}
      </div>

            <UsuarioCrearModal
                isOpen={isCrearModalOpen}
                onClose={closeModal}
                onSubmit={handleSaveUsuario}
                availableRoles={availableRoles}
                isLoading={isSubmitting}
            />
            <UsuarioEditarModal
                isOpen={isEditarModalOpen}
                onClose={closeModal}
                onSubmit={handleSaveUsuario}
                initialData={currentUsuario}
                availableRoles={availableRoles}
                isLoading={isSubmitting}
            />
            <UsuarioDetalleModal
                isOpen={isDetailsModalOpen}
                onClose={closeModal}
                usuario={currentUsuario}
            />
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={closeModal}
                onConfirm={handleDeleteUsuario}
                title="Confirmar Desactivación"
                message={`¿Estás seguro de que deseas desactivar al usuario "${
                currentUsuario?.clienteInfo?.nombre || currentUsuario?.empleadoInfo?.nombre || currentUsuario?.correo || ""
                }"?`}
                confirmText="Desactivar"
                cancelText="Cancelar"
                isLoading={isSubmitting}
            />
            <ValidationModal
                isOpen={isValidationModalOpen}
                onClose={closeModal}
                message={validationMessage}
                title="Aviso"
            />
    </div>
  );
}

export default ListaUsuariosPage;