// src/features/citas/components/CitaFormModal.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import moment from 'moment';
import CitaForm from './CitaForm';
import {
  fetchServiciosDisponiblesParaCitas,
  fetchEmpleadosDisponiblesParaCitas
} from '../services/citasService';
import { fetchClientes } from '../../clientes/services/clientesService';
import ItemSelectionModal from '../../../shared/components/common/ItemSelectionModal';

const CitaFormModal = ({ isOpen, onClose, onSubmit, initialSlotData, clientePreseleccionado }) => {
  const [formData, setFormData] = useState({});
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);
  const [empleadosDisponibles, setEmpleadosDisponibles] = useState([]);
  const [clientesList, setClientesList] = useState([]);
  const [showClienteSelectModal, setShowClienteSelectModal] = useState(false);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDependencies, setIsLoadingDependencies] = useState(false);

  const resetFormState = () => {
    setFormData({});
    setError('');
    setIsLoading(false);
  };

  // 🔹 Cargar dependencias al abrir modal
  useEffect(() => {
    if (isOpen) {
      setIsLoadingDependencies(true);
      setError('');

      Promise.all([
        fetchServiciosDisponiblesParaCitas(),
        fetchEmpleadosDisponiblesParaCitas(),
        fetchClientes()
      ]).then(([servicios, empleados, clientes]) => {
        setServiciosDisponibles(servicios);
        setEmpleadosDisponibles(empleados);
        setClientesList(clientes || []);

        // Inicializar datos
        let idInit = null;
        let clienteInit = clientePreseleccionado || null;
        let empleadoNombreInit = '';
        let empleadoIdInit = null;
        let servicioIdsInit = [];
        let estadoCitaIdInit = 1; // Por defecto Programada
        let startTimeInit = initialSlotData?.start || null;
        let endTimeInit = null;

        if (initialSlotData && initialSlotData.tipo === 'cita') {
          idInit = initialSlotData.id;
          clienteInit = initialSlotData.cliente;
          empleadoIdInit = initialSlotData.empleadoId;
          const emp = empleados.find(e => e.id === empleadoIdInit);
          empleadoNombreInit = emp ? emp.nombre : (initialSlotData.empleado || '');
          servicioIdsInit = initialSlotData.servicios?.map(s => s.id) || [];
          estadoCitaIdInit = initialSlotData.estadoCitaId || 1;
          startTimeInit = initialSlotData.start;
          endTimeInit = initialSlotData.end;
        } else if (initialSlotData && initialSlotData.resource?.empleadoId) {
          const empEncontrado = empleados.find(e => e.id === initialSlotData.resource.empleadoId);
          if (empEncontrado) {
            empleadoNombreInit = empEncontrado.nombre;
            empleadoIdInit = empEncontrado.id;
          }
          endTimeInit = startTimeInit ? moment(startTimeInit).add(30, 'minutes').toDate() : null;
        } else if (startTimeInit) {
          endTimeInit = moment(startTimeInit).add(30, 'minutes').toDate();
        }

        setFormData({
          id: idInit,
          cliente: clienteInit, // Objeto cliente para mostrar
          clienteId: clienteInit?.idCliente || null,
          empleado: empleadoNombreInit,
          empleadoId: empleadoIdInit,
          servicioIds: servicioIdsInit,
          start: startTimeInit,
          end: endTimeInit,
          estadoCitaId: estadoCitaIdInit,
        });
        setIsLoadingDependencies(false);
      }).catch(err => {
        console.error("Error cargando dependencias para el formulario de cita:", err);
        setError("Error al cargar datos necesarios: " + err.message);
        setIsLoadingDependencies(false);
      });
    } else {
      resetFormState();
    }
  }, [isOpen, initialSlotData, clientePreseleccionado]);

  // 🔹 Clientes para modal
  const todosLosClientesParaModal = useMemo(() => {
    if (!Array.isArray(clientesList)) return [];
    return clientesList.map(c => ({
      ...c,
      value: c.idCliente,
      label: `${c.nombre} ${c.apellido}` || "Cliente sin nombre"
    }));
  }, [clientesList]);

  const handleEmpleadoChange = useCallback((e) => {
    const selectedEmpleadoId = parseInt(e.target.value);
    const empleadoSeleccionado = empleadosDisponibles.find(emp => emp.id === selectedEmpleadoId);
    setFormData(prev => ({
      ...prev,
      empleadoId: selectedEmpleadoId || null,
      empleado: empleadoSeleccionado?.nombre || ''
    }));
    if (error && selectedEmpleadoId) setError('');
  }, [empleadosDisponibles, error]);

  // 👇 Nuevo handler compatible con el CitaForm
  const handleServicioChange = useCallback((serviciosData) => {
    setFormData(prev => ({
      ...prev,
      servicioIds: serviciosData.servicioIds,
      end: serviciosData.end || prev.end
    }));
    if (error && serviciosData.servicioIds.length > 0) setError('');
  }, [error]);

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.clienteId) { setError("Debe seleccionar un cliente."); return; }
    if (!formData.empleadoId) { setError("Debe seleccionar un empleado."); return; }
    if (!formData.servicioIds || formData.servicioIds.length === 0) { setError("Debe seleccionar al menos un servicio."); return; }
    if (!formData.start) { setError("No se ha definido una hora de inicio para la cita."); return; }

    setError('');
    setIsLoading(true);
    try {
      await onSubmit(formData); // ahora ya está listo con IDs
    } catch (submissionError) {
      setError(submissionError.message || "Error al guardar la cita.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-citas">
      <div className="modal-content-citas">
        <button className="cerrar-modal" onClick={onClose} disabled={isLoading}>&times;</button>
        <h3>{formData.id ? 'Editar Cita' : 'Agendar Nueva Cita'}</h3>

        {isLoadingDependencies ? (
          <div className="cargando-modal">Cargando datos...</div>
        ) : (
          <form onSubmit={handleSubmitForm}>
            <CitaForm
              formData={formData}
              onServicioChange={handleServicioChange}
              onEmpleadoChange={handleEmpleadoChange}
              empleadosDisponibles={empleadosDisponibles}
              serviciosDisponibles={serviciosDisponibles}
              isSlotSelection={!!(initialSlotData && initialSlotData.resource?.empleadoId && !initialSlotData.tipo)}
            />

            {/* Campo Cliente con modal */}
            <div className="form-group">
              <label htmlFor="clienteSearch">Cliente <span className="required-asterisk">*</span>:</label>
              <input
                type="text"
                className="buscar-cliente-input"
                value={formData?.cliente?.nombre ? `${formData.cliente.nombre} ${formData.cliente.apellido}` : ''}
                onClick={() => setShowClienteSelectModal(true)}
                placeholder="Seleccionar cliente"
                readOnly
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            <div className="botonesModalCitas">
              <button type="submit" disabled={isLoading || isLoadingDependencies}>
                {isLoading ? "Guardando..." : (formData.id ? "Actualizar Cita" : "Guardar Cita")}
              </button>
              <button type="button" onClick={onClose} disabled={isLoading}>Cancelar</button>
            </div>
          </form>
        )}
      </div>

      {/* Modal de selección de clientes */}
      <ItemSelectionModal
        isOpen={showClienteSelectModal}
        onClose={() => setShowClienteSelectModal(false)}
        title="Seleccionar Cliente"
        items={todosLosClientesParaModal}
        onSelectItem={(selectedItem) => { 
          setFormData({ ...formData, cliente: selectedItem, clienteId: selectedItem.idCliente }); 
          setShowClienteSelectModal(false); 
        }}
        searchPlaceholder="Buscar cliente..."
      />
    </div>
  );
};

export default CitaFormModal;
