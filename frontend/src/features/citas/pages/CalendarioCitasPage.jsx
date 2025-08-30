// src/features/citas/pages/CalendarioCitasPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import moment from 'moment';
import 'moment/locale/es';
import { useLocation, useNavigate } from 'react-router-dom';

import NavbarAdmin from '../../../shared/components/layout/NavbarAdmin';
import { CitaFormModal, CitaDetalleModal, CitasTable } from '../components';
import ConfirmModal from '../../../shared/components/common/ConfirmModal';
import ValidationModal from '../../../shared/components/common/ValidationModal';

import {
  fetchCitasAgendadas,
  saveCita,
  deleteCitaById as serviceDeleteCitaById,
  cambiarEstadoCita
} from '../services/citasService';
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
      const agendadas = await fetchCitasAgendadas();

      // 🔹 Normalizar los datos que vienen del backend
      const normalizadas = agendadas.map(c => ({
        ...c,
        clienteNombre: c.cliente?.nombre
          ? `${c.cliente.nombre} ${c.cliente.apellido || ""}`.trim()
          : (c.cliente || "Sin cliente"),
        empleadoNombre: c.empleado?.nombre || "Sin empleado",
        serviciosNombres: (c.servicios || []).map(s => s.nombre).join(", "),
      }));

      setCitasAgendadas(
        normalizadas.sort(
          (a, b) => moment(b.start).valueOf() - moment(a.start).valueOf()
        )
      );
    } catch (error) {
      console.error("Error al cargar citas:", error);
      setValidationTitle("Error de Carga");
      setValidationMessage("No se pudieron cargar las citas: " + error.message);
      setIsValidationModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatosCompletos();
    if (clientePreseleccionado) {
      // Podrías abrir el modal de creación con el cliente preseleccionado
    }
  }, [cargarDatosCompletos, clientePreseleccionado]);

  const handleCloseModals = () => {
    setIsFormModalOpen(false);
    setIsDetailsModalOpen(false);
    setIsConfirmDeleteOpen(false);
    setIsConfirmCancelOpen(false);
    setIsValidationModalOpen(false);
    setSelectedSlotOrEvent(null);
    setCitaParaOperacion(null);
    setValidationMessage('');
    setValidationTitle('Aviso');
    if (location.state?.clientePreseleccionado) {
      navigate(location.pathname, { replace: true, state: {} });
    }
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

  const handleOpenCancelConfirm = (citaACancelarId) => {
    handleCloseModals();
    const cita = citasAgendadas.find(c => c.id === citaACancelarId);
    if (cita) {
      setCitaParaOperacion(cita);
      setIsConfirmCancelOpen(true);
    } else {
      setValidationTitle("Error");
      setValidationMessage("No se encontró la cita para cancelar.");
      setIsValidationModalOpen(true);
    }
  };

  const handleSaveCitaSubmit = async (formDataFromModal) => {
    try {
      await saveCita(formDataFromModal); // ✅ ya no pasamos citasActuales
      cargarDatosCompletos();
      handleCloseModals();
      setValidationTitle("Éxito");
      setValidationMessage(formDataFromModal.id ? "Cita actualizada exitosamente." : "Cita guardada exitosamente.");
      setIsValidationModalOpen(true);
    } catch (error) {
      console.error("Error al guardar cita:", error);
      setValidationTitle("Error al Guardar");
      setValidationMessage(error.message || "Error desconocido.");
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
        setValidationMessage(`Cita #${citaParaOperacion.id} para "${citaParaOperacion.clienteNombre}" ha sido Cancelada.`);
      } catch (error) {
        setValidationTitle("Error al Cancelar");
        setValidationMessage(error.message);
      } finally {
        setIsValidationModalOpen(true);
        handleCloseModals();
      }
    }
  };

  // 🔍 Filtrado por búsqueda + estado
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
    <div className="admin-layout">
      <NavbarAdmin />
      <div className="main-content">
        <div className="citas-page-content-wrapper">
          <h1>Gestión de Citas</h1>
          {isLoading && <div className="cargando-pagina"><span>Cargando citas...</span><div className="spinner"></div></div>}

          {/* Barra de búsqueda, filtro de estado y botón */}
          <div className="citas-header-actions" style={{ width: '100%', display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
            <input
              type="text"
              placeholder="Busca por cualquier campo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="citas-search-input"
              style={{ flex: 1 }}
            />

            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className="citas-filter-select"
              style={{ padding: '8px 10px', borderRadius: 6 }}
            >
              <option value="Todos">Todos los Estados</option>
              <option value="Programada">Programadas</option>
              <option value="En proceso">En proceso</option>
              <option value="Completada">Completadas</option>
              <option value="Cancelada">Canceladas</option>
            </select>

            <button
              className="btn-agregar-cita"
              onClick={() => {
                setSelectedSlotOrEvent(null);
                setCitaParaOperacion(null);
                setIsFormModalOpen(true);
              }}
            >
              Agregar Cita
            </button>
          </div>

          {/* Tabla de citas */}
          <CitasTable
            citas={citasFiltradas}
            onViewDetails={(cita) => {
              setSelectedSlotOrEvent(cita);
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

      {/* Modales */}
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
        onDeleteConfirm={handleOpenDeleteConfirm}
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
