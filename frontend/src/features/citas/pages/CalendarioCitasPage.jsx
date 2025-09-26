// src/features/citas/pages/CalendarioCitasPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import moment from "moment";
import "moment/locale/es";
import { useLocation, useNavigate } from "react-router-dom";

// Removido: NavbarAdmin no es necesario en el módulo de administración
import {
  CitaFormModal,
  CitaDetalleModal,
  CitasTable,
  CalendarView,
} from "../components";
import ConfirmModal from "../../../shared/components/common/ConfirmModal";
import ValidationModal from "../../../shared/components/common/ValidationModal";

import {
  fetchCitasAgendadas,
  saveCita,
  deleteCitaById as serviceDeleteCitaById,
  cambiarEstadoCita,
  fetchEstadosCita,
} from "../services/citasService";
import "../../../shared/styles/crud-common.css";
import "../../../shared/styles/admin-layout.css";
import "../css/Citas.css";

moment.locale("es");

function CitasPage() {
  const [citasAgendadas, setCitasAgendadas] = useState([]);
  const [estadosCita, setEstadosCita] = useState([]); // Estado para guardar los estados
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [vistaActual, setVistaActual] = useState("calendario"); // "calendario" o "tabla"

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);

  const [selectedSlotOrEvent, setSelectedSlotOrEvent] = useState(null);
  const [citaParaOperacion, setCitaParaOperacion] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [validationTitle, setValidationTitle] = useState("Aviso");

  const location = useLocation();
  const navigate = useNavigate();

  const clientePreseleccionado = location.state?.clientePreseleccionado || null;
  const cargarDatosCompletos = useCallback(async () => {
    setIsLoading(true);
    try {
      const [agendadas, estados] = await Promise.all([
        fetchCitasAgendadas(),
        fetchEstadosCita(),
      ]);
      setEstadosCita(estados);

      const normalizadas = agendadas.map((c) => ({
        ...c,
        id: c.idCita,
        clienteNombre: c.cliente
          ? `${c.cliente.nombre} ${c.cliente.apellido || ""}`.trim()
          : "Sin cliente",
        empleadoNombre: c.empleado?.empleado
          ? `${c.empleado.empleado.nombre} ${
              c.empleado.empleado.apellido || ""
            }`.trim()
          : "Sin asignar",
        serviciosNombres: (c.servicios || []).map((s) => s.nombre).join(", "),
        estadoCita: c.estadoDetalle?.nombreEstado || "Desconocido",
        idEstado: c.idEstado,
      }));

      setCitasAgendadas(normalizadas);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setValidationTitle("Error de Carga");
      setValidationMessage(
        "No se pudieron cargar los datos necesarios: " + error.message
      );
      setIsValidationModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatosCompletos();
  }, [cargarDatosCompletos]);

  const handleStatusChange = async (citaId, nuevoEstadoId) => {
    try {
      await cambiarEstadoCita(citaId, nuevoEstadoId);
      cargarDatosCompletos();
      setValidationTitle("Éxito");
      setValidationMessage(`Estado de la cita #${citaId} actualizado.`);
      setIsValidationModalOpen(true);
    } catch (error) {
      setValidationTitle("Error al actualizar");
      setValidationMessage(error.message);
      setIsValidationModalOpen(true);
    }
  };

  const handleCloseModals = () => {
    setIsFormModalOpen(false);
    setIsDetailsModalOpen(false);
    setIsConfirmDeleteOpen(false);
    setIsConfirmCancelOpen(false);
    setIsValidationModalOpen(false);
    setSelectedSlotOrEvent(null);
    setCitaParaOperacion(null);
  };

  const handleOpenEditModal = (citaAEditar) => {
    handleCloseModals();
    setSelectedSlotOrEvent(citaAEditar);
    setCitaParaOperacion(citaAEditar);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteConfirm = (citaAEliminar) => {
    handleCloseModals();
    setCitaParaOperacion(citaAEliminar);
    setIsConfirmDeleteOpen(true);
  };

  const handleOpenCancelConfirm = (citaACancelar) => {
    handleCloseModals();
    setCitaParaOperacion(citaACancelar);
    setIsConfirmCancelOpen(true);
  };

  const handleSaveCitaSubmit = async (formDataFromModal) => {
    try {
      await saveCita(formDataFromModal);
      cargarDatosCompletos();
      handleCloseModals();
      setValidationTitle("Éxito");
      setValidationMessage(
        formDataFromModal.id ? "Cita actualizada." : "Cita guardada."
      );
      setIsValidationModalOpen(true);
    } catch (error) {
      console.error("Error al guardar cita:", error);
      setValidationTitle("Error al Guardar");
      setValidationMessage(error.message || "No se pudo guardar la cita.");
      setIsValidationModalOpen(true);
    }
  };

  const handleDeleteCitaConfirmada = async () => {
    if (citaParaOperacion) {
      try {
        await serviceDeleteCitaById(citaParaOperacion.id);
        cargarDatosCompletos();
        handleCloseModals();
        setValidationTitle("Éxito");
        setValidationMessage(
          `Cita para "${citaParaOperacion.clienteNombre}" eliminada exitosamente.`
        );
        setIsValidationModalOpen(true);
      } catch (error) {
        console.error("Error al eliminar cita:", error);
        handleCloseModals();
        setValidationTitle("Error al Eliminar");
        setValidationMessage(error.message || "No se pudo eliminar la cita.");
        setIsValidationModalOpen(true);
      }
    }
  };

  const handleMarkAsCompleted = async (citaId) => {
    try {
      await cambiarEstadoCita(citaId, "Completada");
      cargarDatosCompletos();
      setValidationTitle("Éxito");
      setValidationMessage(`Cita #${citaId} marcada como Completada.`);
      setIsValidationModalOpen(true);
    } catch (error) {
      setValidationTitle("Error");
      setValidationMessage(error.message);
      setIsValidationModalOpen(true);
    }
  };

  const handleConfirmCancelCita = async () => {
    if (citaParaOperacion) {
      try {
        const motivo = "Cancelada por Administrador";
        await cambiarEstadoCita(citaParaOperacion.id, "Cancelada", motivo);
        cargarDatosCompletos();
        handleCloseModals();
        setValidationTitle("Éxito");
        setValidationMessage(
          `Cita #${citaParaOperacion.id} para "${citaParaOperacion.clienteNombre}" ha sido cancelada.`
        );
        setIsValidationModalOpen(true);
      } catch (error) {
        handleCloseModals();
        setValidationTitle("Error al Cancelar");
        setValidationMessage(error.message);
        setIsValidationModalOpen(true);
      }
    }
  };

  const citasFiltradas = useMemo(() => {
    const term = (searchTerm || "").trim().toLowerCase();
    return citasAgendadas.filter((cita) => {
      const matchesSearch =
        !term ||
        (cita.id && cita.id.toString().toLowerCase().includes(term)) ||
        (cita.clienteNombre &&
          cita.clienteNombre.toLowerCase().includes(term)) ||
        (cita.empleadoNombre &&
          cita.empleadoNombre.toLowerCase().includes(term)) ||
        (cita.estadoCita && cita.estadoCita.toLowerCase().includes(term)) ||
        (cita.serviciosNombres &&
          cita.serviciosNombres.toLowerCase().includes(term));

      const matchesEstado =
        estadoFiltro === "Todos" ||
        (cita.estadoCita &&
          cita.estadoCita.toLowerCase() === estadoFiltro.toLowerCase());

      return matchesSearch && matchesEstado;
    });
  }, [citasAgendadas, searchTerm, estadoFiltro]);

  // Paginación
  const paginatedCitas = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return citasFiltradas.slice(startIndex, startIndex + rowsPerPage);
  }, [citasFiltradas, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(citasFiltradas.length / rowsPerPage);

  // Manejadores de paginación
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (event) => {
    setEstadoFiltro(event.target.value);
    setCurrentPage(1);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  return (
    <div className="lista-citas-container">
      <div className="citas-content-wrapper">
        <h1>Gestión de Citas ({citasFiltradas.length})</h1>
        <div className="citas-actions-bar">
          <div className="citas-filters">
            <div className="citas-search-bar">
              <input
                type="search"
                className="citas-search-input"
                placeholder="Buscar por cliente, empleado..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <div className="citas-filtro-estado-grupo">
              <select
                className="citas-filtro-estado-select"
                value={estadoFiltro}
                onChange={handleFilterChange}
              >
                <option value="Todos">Todos los Estados</option>
                <option value="Activa">Activas</option>
                <option value="Pendiente">Pendientes</option>
                <option value="En proceso">En proceso</option>
                <option value="Completado">Completadas</option>
                <option value="Finalizado">Finalizadas</option>
                <option value="Cancelado">Canceladas</option>
              </select>
            </div>

            <div className="citas-vista-selector">
              <button
                className={`vista-button ${
                  vistaActual === "calendario" ? "active" : ""
                }`}
                onClick={() => setVistaActual("calendario")}
                title="Vista de calendario"
              >
                📅 Calendario
              </button>
              <button
                className={`vista-button ${
                  vistaActual === "tabla" ? "active" : ""
                }`}
                onClick={() => setVistaActual("tabla")}
                title="Vista de tabla"
              >
                📋 Tabla
              </button>
            </div>
          </div>

          <button
            className="citas-add-button"
            onClick={() => navigate("/admin/citas/agendar")}
          >
            Agendar Cita
          </button>
        </div>

        {isLoading && (
          <p style={{ textAlign: "center", margin: "20px 0" }}>
            Cargando citas...
          </p>
        )}

        {!isLoading && (
          <>
            {vistaActual === "calendario" ? (
              <CalendarView
                citas={citasFiltradas}
                onViewDetails={(cita) => {
                  setSelectedSlotOrEvent(cita);
                  setCitaParaOperacion(cita);
                  setIsDetailsModalOpen(true);
                }}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteConfirm}
                onStatusChange={handleStatusChange}
                estadosCita={estadosCita}
              />
            ) : (
              <>
                <div className="table-container">
                  <CitasTable
                    citas={paginatedCitas}
                    onViewDetails={(cita) => {
                      setSelectedSlotOrEvent(cita);
                      setCitaParaOperacion(cita);
                      setIsDetailsModalOpen(true);
                    }}
                    onEdit={handleOpenEditModal}
                    onMarkAsCompleted={handleMarkAsCompleted}
                    onCancel={handleOpenCancelConfirm}
                    onDelete={handleOpenDeleteConfirm}
                    onStatusChange={handleStatusChange}
                    estadosCita={estadosCita}
                  />
                </div>
                {citasFiltradas.length > 0 && (
                  <div className="pagination-wrapper">
                    <div className="pagination-container">
                      <label htmlFor="rows-per-page">Filas:</label>
                      <select
                        id="rows-per-page"
                        value={rowsPerPage}
                        onChange={handleRowsPerPageChange}
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                      </select>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (pageNumber) => (
                          <button
                            key={pageNumber}
                            className={`page-number ${
                              currentPage === pageNumber ? "active" : ""
                            }`}
                            onClick={() => setCurrentPage(pageNumber)}
                          >
                            {pageNumber}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      <CitaFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleSaveCitaSubmit}
        initialSlotData={selectedSlotOrEvent}
        clientePreseleccionado={clientePreseleccionado}
      />
      <CitaDetalleModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseModals}
        cita={citaParaOperacion}
        onEdit={handleOpenEditModal}
        onDeleteConfirm={() => handleOpenDeleteConfirm(citaParaOperacion)}
      />
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={handleCloseModals}
        onConfirm={handleDeleteCitaConfirmada}
        title="Confirmar Eliminación"
        message={`¿Está seguro que desea eliminar la cita para "${
          citaParaOperacion?.clienteNombre || ""
        }" con ${citaParaOperacion?.empleadoNombre || ""} el ${
          citaParaOperacion?.start
            ? moment(citaParaOperacion.start).format("DD/MM/YY HH:mm")
            : ""
        }?`}
        confirmText="Sí, Eliminar"
        cancelText="No, Conservar"
      />
      <ConfirmModal
        isOpen={isConfirmCancelOpen}
        onClose={handleCloseModals}
        onConfirm={handleConfirmCancelCita}
        title="Confirmar Cancelación de Cita"
        message={`¿Está seguro de que desea cancelar la cita #${
          citaParaOperacion?.id || ""
        } para "${citaParaOperacion?.clienteNombre || ""}"?`}
        confirmText="Sí, Cancelar Cita"
        cancelText="No, Mantener Cita"
      />
      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={handleCloseModals}
        title={validationTitle}
        message={validationMessage}
      />
    </div>
  );
}

export default CitasPage;
