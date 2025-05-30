// src/features/novedades/pages/ConfigHorariosPage.jsx
import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../../shared/components/layout/NavbarAdmin";
import HorariosTable from "../components/HorariosTable";
import HorarioFormModal from "../components/HorarioFormModal";
import HorarioDetalleModal from "../components/HorarioDetalleModal";
import ConfirmModal from "../../../shared/components/common/ConfirmModal";
import ValidationModal from "../../../shared/components/common/ValidationModal";
import {
  fetchHorarios,
  saveHorario,
  deleteHorarioById,
  toggleHorarioEstado,
  getEmpleadosParaHorarios, // Para pasar a la tabla y otros componentes si es necesario
} from "../services/horariosService";
import "../css/ConfigHorarios.css"; // Nuevo CSS

function ConfigHorariosPage() {
  const [horarios, setHorarios] = useState([]);
  const [empleados, setEmpleados] = useState([]); // Para pasar a la tabla
  const [search, setSearch] = useState("");

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);

  const [currentHorario, setCurrentHorario] = useState(null);
  const [formModalType, setFormModalType] = useState("agregar");
  const [validationMessage, setValidationMessage] = useState("");

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
    } else {
      // 'agregar' o 'editar'
      setFormModalType(type);
      setIsFormModalOpen(true);
    }
  };

  const handleCloseModals = () => {
    setIsFormModalOpen(false);
    setIsDetailsModalOpen(false);
    setIsConfirmDeleteOpen(false);
    setIsValidationModalOpen(false);
    setCurrentHorario(null);
    setValidationMessage("");
  };

  const handleSave = (horarioData) => {
    try {
      const updatedHorarios = saveHorario(horarioData, horarios);
      setHorarios(updatedHorarios);
      handleCloseModals();
    } catch (error) {
      setValidationMessage(error.message);
      setIsValidationModalOpen(true);
    }
  };

  const handleDelete = () => {
    if (currentHorario) {
      const updatedHorarios = deleteHorarioById(currentHorario.id, horarios);
      setHorarios(updatedHorarios);
      handleCloseModals();
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

  // Filtrar por nombre de empleado
  const filteredHorarios = horarios.filter((h) => {
    const empleado = empleados.find((e) => e.id === parseInt(h.empleadoId));
    return empleado
      ? empleado.nombre.toLowerCase().includes(search.toLowerCase())
      : true;
  });

  return (
    <div className="novedades-page-container">
      {" "}
      {/* Clase principal para la página */}
      <NavbarAdmin />
      <div className="novedades-content">
        {" "}
        {/* Contenedor para el contenido principal */}
        <h1>Configuración de Horarios de Empleados (Novedades)</h1>
        <div className="accionesBarraBusqueda-botonAgregar">
          {" "}
          {/* Clase del CSS original de Horarios.css */}
          <input
            className="barraBusquedaHorarioCitas" // Clase del CSS original
            type="text"
            placeholder="Buscar por encargado..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="botonAgregarHorario"
            onClick={() => handleOpenModal("agregar")}
          >
            {" "}
            {/* Clase del CSS original */}
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
      <HorarioFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleSave}
        initialData={currentHorario}
        modalType={formModalType}
      />
      <HorarioDetalleModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseModals}
        horario={currentHorario}
      />
      <ConfirmModal // Usar el genérico de shared
        isOpen={isConfirmDeleteOpen}
        onClose={handleCloseModals}
        onConfirm={handleDelete}
        title="Confirmar Eliminación"
        message={`¿Está seguro de que desea eliminar este horario?`}
      />
      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={handleCloseModals}
        title="Aviso de Novedades"
        message={validationMessage}
      />
    </div>
  );
}

export default ConfigHorariosPage;
