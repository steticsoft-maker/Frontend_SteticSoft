// src/features/novedades/pages/ConfigHorariosPage.jsx
import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../../shared/components/layout/NavbarAdmin";
import HorariosTable from "../components/HorariosTable";
import HorarioCrearModal from "../components/HorarioCrearModal";
import HorarioEditarModal from "../components/HorarioEditarModal";
import HorarioDetalleModal from "../components/HorarioDetalleModal";
import ConfirmModal from "../../../shared/components/common/ConfirmModal";
import ValidationModal from "../../../shared/components/common/ValidationModal";
import {
  fetchHorarios,
  saveHorario,
  deleteHorarioById,
  toggleHorarioEstado,
  getEmpleadosParaHorarios,
} from "../services/horariosService";
import "../css/ConfigHorarios.css";

function ConfigHorariosPage() {
  const [horarios, setHorarios] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [search, setSearch] = useState("");

  // Estados para los nuevos modales
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  // Los otros modales se mantienen
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);

  const [currentHorario, setCurrentHorario] = useState(null);
  const [validationMessage, setValidationMessage] = useState("");
  // formModalType ya no es necesario

  useEffect(() => {
    setHorarios(fetchHorarios());
    setEmpleados(getEmpleadosParaHorarios());
  }, []);

  const handleOpenModal = (type, horario = null) => {
    setCurrentHorario(horario);
    if (type === "ver") {
      setIsDetailsModalOpen(true);
    } else if (type === "delete") {
      setIsConfirmDeleteOpen(true);
    } else if (type === "agregar") {
      // Para abrir el modal de creación
      setIsCrearModalOpen(true);
    } else if (type === "editar") {
      // Para abrir el modal de edición
      if (horario) {
        // Asegurarse de que hay datos para editar
        setIsEditarModalOpen(true);
      } else {
        console.error(
          "Intento de abrir modal de edición sin datos de horario."
        );
      }
    }
  };

  // Funciones de cierre específicas para cada modal de formulario
  const handleCrearModalClose = () => {
    setIsCrearModalOpen(false);
    // No es necesario resetear currentHorario aquí, ya que solo se usa para edición/detalle/borrado
  };

  const handleEditarModalClose = () => {
    setIsEditarModalOpen(false);
    setCurrentHorario(null); // Limpiar horario actual después de editar o cancelar
  };

  // Cierre para los otros modales
  const closeOtherModals = () => {
    setIsDetailsModalOpen(false);
    setIsConfirmDeleteOpen(false);
    setIsValidationModalOpen(false);
    setValidationMessage("");
    // Solo limpiar currentHorario si ninguno de los modales de formulario está abierto
    if (!isCrearModalOpen && !isEditarModalOpen) {
      setCurrentHorario(null);
    }
  };

  const handleSave = (horarioData) => {
    try {
      // La función saveHorario ya sabe si es creación o edición por la presencia de horarioData.id
      const updatedHorarios = saveHorario(horarioData, horarios);
      setHorarios(updatedHorarios);
      // Cerrar el modal correspondiente
      if (isCrearModalOpen) handleCrearModalClose();
      if (isEditarModalOpen) handleEditarModalClose();
    } catch (error) {
      setValidationMessage(error.message);
      setIsValidationModalOpen(true);
      // No cerramos el modal de formulario aquí para que el usuario pueda corregir errores de validación.
    }
  };

  const handleDelete = () => {
    if (currentHorario) {
      const updatedHorarios = deleteHorarioById(currentHorario.id, horarios);
      setHorarios(updatedHorarios);
      closeOtherModals();
    }
  };

  const handleToggleEstado = (horarioId) => {
    try {
      const updatedHorarios = toggleHorarioEstado(horarioId, horarios);
      setHorarios(updatedHorarios);
    } catch (error) {
      setValidationMessage(error.message);
      setIsValidationModalOpen(true);
    }
  };

  const filteredHorarios = horarios.filter((h) => {
    const empleado = empleados.find((e) => e.id === parseInt(h.empleadoId));
    return empleado
      ? empleado.nombre.toLowerCase().includes(search.toLowerCase())
      : true;
  });

  return (
    <div className="novedades-page-container">
      <NavbarAdmin />
      <div className="novedades-content">
        <h1>Configuración de Horarios de Empleados (Novedades)</h1>
        <div className="novedades-actions-bar">
          <input
            className="novedades-search-bar"
            type="text"
            placeholder="Buscar por encargado..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="novedades-add-button"
            onClick={() => handleOpenModal("agregar")} // Llama a 'agregar' para el modal de creación
          >
            Agregar Horario
          </button>
        </div>
        <HorariosTable
          horarios={filteredHorarios}
          empleados={empleados}
          onView={(h) => handleOpenModal("ver", h)}
          onEdit={(h) => handleOpenModal("editar", h)}
          onDeleteConfirm={(h) => handleOpenModal("delete", h)}
          onToggleEstado={handleToggleEstado}
        />
      </div>

      {/* Renderizar los nuevos modales */}
      <HorarioCrearModal
        isOpen={isCrearModalOpen}
        onClose={handleCrearModalClose}
        onSubmit={handleSave}
      />
      <HorarioEditarModal
        isOpen={isEditarModalOpen}
        onClose={handleEditarModalClose}
        onSubmit={handleSave}
        initialData={currentHorario} // Solo el modal de editar necesita initialData
      />

      <HorarioDetalleModal
        isOpen={isDetailsModalOpen}
        onClose={closeOtherModals}
        horario={currentHorario}
      />
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={closeOtherModals}
        onConfirm={handleDelete}
        title="Confirmar Eliminación"
        message={`¿Está seguro de que desea eliminar este horario?`}
      />
      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={closeOtherModals}
        title="Aviso de Novedades"
        message={validationMessage}
      />
    </div>
  );
}

export default ConfigHorariosPage;
