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
    // isDeleteModalOpen se usará para el Hard Delete Confirm Modal
    isDeleteModalOpen,
    isValidationModalOpen,
    validationMessage,
    inputValue,
    setInputValue,
    filterEstado,
    setFilterEstado,
    currentPage,
    usersPerPage,
    paginate,
    closeModal,
    handleOpenModal,
    handleSaveUsuario,
    // handleConfirmDesactivarUsuario, // Eliminado, reemplazado por handleConfirmSoftDelete
    handleToggleEstadoUsuario,

    // Nuevos handlers y estados del hook para los nuevos flujos
    showSoftDeleteModal,    // Para abrir el modal de confirmación de soft delete
    showHardDeleteModal,    // Para abrir el modal de confirmación de hard delete
    handleConfirmSoftDelete, // Función a ejecutar en confirmación de soft delete
    handleConfirmHardDelete, // Función a ejecutar en confirmación de hard delete
    isConfirmSoftDeleteModalOpen, // Estado para el modal de confirmación de soft delete
    // currentUsuario ya está disponible y se usa como usuarioToAction

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
              usuarios={usuarios}
              onView={(usuario) => handleOpenModal("details", usuario)}
              onEditar={(usuario) => handleOpenModal("edit", usuario)} // Prop renombrada
              onToggleEstado={handleToggleEstadoUsuario} // Prop renombrada
              onDesactivar={showSoftDeleteModal} // Nueva prop para soft delete
              onEliminarFisico={showHardDeleteModal} // Nueva prop para hard delete
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

      {/* Modal para Borrado Lógico (Soft Delete) */}
      <ConfirmModal
        isOpen={isConfirmSoftDeleteModalOpen}
        onClose={closeModal} // closeModal ya resetea currentUsuario y cierra este modal específico
        onConfirm={handleConfirmSoftDelete}
        title="Confirmar Desactivación"
        // Usando message prop que puede interpretar HTML simple, o pasar children
        message={
          currentUsuario
          ? `¿Estás seguro de que deseas desactivar a <strong>${currentUsuario.correo}</strong>? El usuario no podrá iniciar sesión.`
          : ""
        }
        confirmText="Desactivar y Bloquear"
        cancelText="Cancelar"
        isLoading={isSubmitting}
      />

      {/* Modal para Borrado Físico (Hard Delete) - Modificando el existente */}
      <ConfirmModal
        isOpen={isDeleteModalOpen} // isDeleteModalOpen es para el hard delete
        onClose={closeModal} // closeModal resetea currentUsuario y cierra este modal
        onConfirm={handleConfirmHardDelete} // Usar el nuevo handler para hard delete
        title="¡ADVERTENCIA! ACCIÓN IRREVERSIBLE"
        message={
          currentUsuario
          ? `Estás a punto de <strong>ELIMINAR PERMANENTEMENTE</strong> al usuario <strong>${currentUsuario.correo}</strong> y todos sus datos asociados. ¿Estás absolutamente seguro?`
          : ""
        }
        confirmText="Eliminar Permanentemente"
        confirmButtonClass="btn-danger" // Clase para el botón de confirmación peligroso
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