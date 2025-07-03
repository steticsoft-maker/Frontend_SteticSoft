import React from "react"; // useState, useEffect, useCallback, useMemo removidos
import NavbarAdmin from "../../../shared/components/layout/NavbarAdmin";
import UsuariosTable from "../components/UsuariosTable";
import UsuarioCrearModal from "../components/UsuarioCrearModal";
import UsuarioEditarModal from "../components/UsuarioEditarModal";
import UsuarioDetalleModal from "../components/UsuarioDetalleModal";
import ConfirmModal from "../../../shared/components/common/ConfirmModal";
import ValidationModal from "../../../shared/components/common/ValidationModal";
import Pagination from "../../../shared/components/common/Pagination";
import useUsuarios from "../hooks/useUsuarios"; // Importar el custom hook
import "../css/Usuarios.css";
// Los imports de servicios API ya no son necesarios aquí

function ListaUsuariosPage() {
  const {
    usuarios, // Ya filtrados y paginados para la tabla
    totalUsuariosFiltrados, // Para el componente de paginación
    availableRoles,
    isLoadingPage,
    isSubmitting,
    errorPage,
    currentUsuario,
    isCrearModalOpen,
    isEditarModalOpen,
    isDetailsModalOpen,
    isDeleteModalOpen, // Para el ConfirmModal de desactivación
    isValidationModalOpen,
    validationMessage,
    inputValue,      // Para el input de búsqueda
    setInputValue,   // Para actualizar el término de búsqueda inmediato
    filterEstado,    // Para el control de filtro (se implementará en Req 3)
    setFilterEstado, // Para actualizar el filtro de estado (se implementará en Req 3)
    currentPage,
    usersPerPage,
    paginate,
    closeModal,
    handleOpenModal,
    handleSaveUsuario,
    handleConfirmDesactivarUsuario,
    handleToggleEstadoUsuario,
    // Props para el formulario y su validación
    formData,
    formErrors,
    isFormValid,
    isVerifyingEmail,
    handleInputChange,
    handleInputBlur,
  } = useUsuarios();

  // El título ahora puede usar totalUsuariosFiltrados para reflejar el total después de aplicar filtros
  // o podrías querer otro estado en el hook para el conteo total sin filtros.
  // Por ahora, lo dejamos con usuarios.length que sería los usuarios de la página actual.
  // Para mostrar el total real de usuarios en el sistema (antes de filtrar/paginar),
  // el hook useUsuarios debería exponer ese conteo también.
  // const [usuariosSinFiltrar, setUsuariosSinFiltrar] = useState([]); // en el hook
  // y luego usar usuariosSinFiltrar.length aquí. De momento, usamos totalUsuariosFiltrados.

  return (
    <div className="usuarios-container">
      <NavbarAdmin />
      <div className="usuarios-content">
        <h1>Gestión de Usuarios ({totalUsuariosFiltrados})</h1>
        <div className="usuarios-accionesTop">
          <input
            type="text"
            placeholder="Buscar por nombre, correo, documento o rol..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)} // Usar setInputValue del hook
            className="usuarios-barraBusqueda"
            disabled={isLoadingPage} // Deshabilitar si la página está cargando datos iniciales
          />
          <div className="usuarios-filtro-estado">
            <span>Filtrar por estado: </span>
            <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)} disabled={isLoadingPage}>
              <option value="todos">Todos</option>
              <option value="activos">Activos</option>
              <option value="inactivos">Inactivos</option>
            </select>
          </div>
          {/* <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="activos">Activos</option>
            <option value="inactivos">Inactivos</option>
          </select> */}
          <button
            className="usuarios-botonAgregar"
            onClick={() => handleOpenModal("create")}
            disabled={isLoadingPage || isSubmitting} // Deshabilitar si carga o envía
          >
            Crear Usuario
          </button>
        </div>

        {isLoadingPage && <p style={{ textAlign: 'center', margin: '20px 0' }}>Cargando datos...</p>}
        {errorPage && <p className="auth-form-error" style={{ textAlign: 'center', marginTop: '20px' }}>Error: {errorPage}</p>}
        
        {!isLoadingPage && !errorPage && (
          <>
            <UsuariosTable
              usuarios={usuarios} // Estos son los currentUsersForTable del hook
              onView={(usuario) => handleOpenModal("details", usuario)}
              onEdit={(usuario) => handleOpenModal("edit", usuario)}
              onDeleteConfirm={(usuario) => handleOpenModal("delete", usuario)} // Abre el modal de confirmación
              onToggleAnular={handleToggleEstadoUsuario}
              currentPage={currentPage}
              rowsPerPage={usersPerPage}
            />
            { totalUsuariosFiltrados > 0 && usersPerPage > 0 && totalUsuariosFiltrados > usersPerPage && (
                <Pagination
                itemsPerPage={usersPerPage}
                totalItems={totalUsuariosFiltrados} // Usar el total después de filtros
                paginate={paginate}
                currentPage={currentPage}
                />
            )}
          </>
        )}
      </div>

      <UsuarioCrearModal
        isOpen={isCrearModalOpen}
        onClose={closeModal}
         onSubmit={handleSaveUsuario} // Este es handleSaveUsuario del hook
        availableRoles={availableRoles}
        isLoading={isSubmitting}
         // Props para el formulario desde el hook
         formData={formData}
         formErrors={formErrors}
         isFormValid={isFormValid}
         isVerifyingEmail={isVerifyingEmail}
         handleInputChange={handleInputChange}
         handleInputBlur={handleInputBlur}
      />
      <UsuarioEditarModal
        isOpen={isEditarModalOpen}
        onClose={closeModal}
        onSubmit={handleSaveUsuario} // Este es handleSaveUsuario del hook
        initialData={currentUsuario} // Para determinar si es admin protegido, etc.
        availableRoles={availableRoles}
        isLoading={isSubmitting}
        // Props para el formulario desde el hook
        formData={formData}
        formErrors={formErrors}
        isFormValid={isFormValid}
        isVerifyingEmail={isVerifyingEmail}
        handleInputChange={handleInputChange}
        handleInputBlur={handleInputBlur}
      />
      <UsuarioDetalleModal
        isOpen={isDetailsModalOpen}
        onClose={closeModal}
        usuario={currentUsuario}
      />
      <ConfirmModal // Modal para confirmar la desactivación
        isOpen={isDeleteModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirmDesactivarUsuario} // Usar la función renombrada del hook
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
        title="Aviso" // El título podría ser dinámico también si se pasa desde el hook
      />
    </div>
  );
}

export default ListaUsuariosPage;