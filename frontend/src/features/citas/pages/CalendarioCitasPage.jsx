// src/features/citas/pages/CalendarioCitasPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import moment from 'moment';
import 'moment/locale/es';
import { useLocation, useNavigate } from 'react-router-dom';

// Removido: NavbarAdmin no es necesario en el módulo de administración
import { CitaFormModal, CitaDetalleModal, CitasTable } from '../components';
import ConfirmModal from '../../../shared/components/common/ConfirmModal';
import ValidationModal from '../../../shared/components/common/ValidationModal';

import {
  fetchCitasAgendadas,
  saveCita,
  deleteCitaById as serviceDeleteCitaById,
  cambiarEstadoCita
} from '../services/citasService';
import '../../../shared/styles/crud-common.css';
import '../../../shared/styles/admin-layout.css';
import '../css/Citas.css';

moment.locale('es');

function CitasPage() {
  const [citasAgendadas, setCitasAgendadas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);

  const [selectedSlotOrEvent, setSelectedSlotOrEvent] = useState(null);
  const [citaParaOperacion, setCitaParaOperacion] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [validationTitle, setValidationTitle] = useState('Aviso');

  const location = useLocation();
  const navigate = useNavigate();

  
  const clientePreseleccionado = location.state?.clientePreseleccionado || null;
  const cargarDatosCompletos = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (estadoFiltro !== "Todos") {
        params.estado = estadoFiltro;
      }
      if (searchTerm.trim() !== "") {
        params.search = searchTerm.trim();
      }
      const agendadas = await fetchCitasAgendadas();
      const normalizadas = agendadas.map(c => ({
        ...c,
        id: c.idCita, 
        start: c.fechaHora ? new Date(c.fechaHora) : null,
        end: c.fechaHora ? new Date(c.fechaHora) : null, 
        clienteNombre: c.cliente ? `${c.cliente.nombre} ${c.cliente.apellido || ""}`.trim() : "Sin cliente",
        empleadoNombre: c.empleado?.empleado ? `${c.empleado.nombre} ${c.empleado.apellido || ""}`.trim() : "Sin asignar",
        serviciosNombres: (c.serviciosProgramados || []).map(s => s.nombre).join(", "),
        estadoCita: c.estadoDetalle?.nombreEstado || (c.estado ? 'Activa' : 'Cancelada')
      }));

      setCitasAgendadas(normalizadas);
    } catch (error) {
      console.error("Error al cargar citas:", error);
      setValidationTitle("Error de Carga");
      setValidationMessage("No se pudieron cargar las citas: " + error.message);
      setIsValidationModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, estadoFiltro]);

 useEffect(() => {
    cargarDatosCompletos();
  }, [cargarDatosCompletos]);

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
      setValidationMessage(formDataFromModal.id ? "Cita actualizada." : "Cita guardada.");
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
        setValidationMessage(`Cita para "${citaParaOperacion.clienteNombre}" eliminada exitosamente.`);
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
        setValidationMessage(`Cita #${citaParaOperacion.id} para "${citaParaOperacion.clienteNombre}" ha sido cancelada.`);
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
    return citasAgendadas.filter(cita => {
      const matchesSearch =
        !term ||
        (cita.id && cita.id.toString().toLowerCase().includes(term)) ||
        (cita.clienteNombre && cita.clienteNombre.toLowerCase().includes(term)) ||
        (cita.empleadoNombre && cita.empleadoNombre.toLowerCase().includes(term)) ||
        (cita.estadoCita && cita.estadoCita.toLowerCase().includes(term)) ||
        (cita.serviciosNombres && cita.serviciosNombres.toLowerCase().includes(term));

      const matchesEstado =
        estadoFiltro === "Todos" ||
        (cita.estadoCita && cita.estadoCita.toLowerCase() === estadoFiltro.toLowerCase());

      return matchesSearch && matchesEstado;
    });
  }, [citasAgendadas, searchTerm, estadoFiltro]);

  return (
    <div className="admin-page-layout">
      <div className="admin-main-content-area">
        <div className="admin-content-wrapper">
          <h1>Gestión de Citas</h1>
          {isLoading && <div className="cargando-pagina"><span>Cargando citas...</span><div className="spinner"></div></div>}

          <div className="admin-actions-bar">
            <div className="admin-filters">
              <input
                type="text"
                placeholder="Busca por cualquier campo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="admin-search-input"
              />
              <select
                value={estadoFiltro}
                onChange={(e) => setEstadoFiltro(e.target.value)}
                className="admin-filter-select"
              >
                <option value="Todos">Todos los Estados</option>
                <option value="activa">Activas</option>
                <option value="Pendiente">Pendientes</option>
                <option value="Confirmada">Confirmadas</option>
                <option value="Finalizada">Finalizadas</option>
                <option value="Cancelada">Canceladas</option>
              </select>
            </div>
            <button
              className="admin-add-button"
              onClick={() => navigate('/admin/citas/agendar')}
            >
              Agregar Cita
            </button>
          </div>

          <div className="crud-table-container">
            <CitasTable
              citas={citasFiltradas}
              onViewDetails={(cita) => {
                setCitaParaOperacion(cita);
                setIsDetailsModalOpen(true);
              }}
              onEdit={handleOpenEditModal}
              onMarkAsCompleted={handleMarkAsCompleted}
              onCancel={handleOpenCancelConfirm}
              onDelete={handleOpenDeleteConfirm}
            />
          </div>
        </div>
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
        message={`¿Está seguro que desea eliminar la cita para "${citaParaOperacion?.clienteNombre || ''}" con ${citaParaOperacion?.empleadoNombre || ''} el ${citaParaOperacion?.start ? moment(citaParaOperacion.start).format("DD/MM/YY HH:mm") : ''}?`}
        confirmText="Sí, Eliminar"
        cancelText="No, Conservar"
      />
      <ConfirmModal
        isOpen={isConfirmCancelOpen}
        onClose={handleCloseModals}
        onConfirm={handleConfirmCancelCita}
        title="Confirmar Cancelación de Cita"
        message={`¿Está seguro de que desea cancelar la cita #${citaParaOperacion?.id || ''} para "${citaParaOperacion?.clienteNombre || ''}"?`}
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