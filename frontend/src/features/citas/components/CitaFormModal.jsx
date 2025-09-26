// src/features/citas/components/CitaFormModal.jsx
import React, { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import Select from 'react-select';
import DatePicker, { registerLocale } from 'react-datepicker';
import { es } from 'date-fns/locale/es';
import 'react-datepicker/dist/react-datepicker.css';
import {
  fetchServiciosDisponiblesParaCitas,
  fetchEmpleadosDisponiblesParaCitas,
  fetchClientesParaCitas,
  fetchNovedades,
} from '../services/citasService';
import ItemSelectionModal from '../../../shared/components/common/ItemSelectionModal';
import '../../../shared/styles/admin-layout.css';
import '../css/Citas.css';
import '../../novedades/css/ConfigHorarios.css';

registerLocale('es', es);
moment.locale('es');

const CitaFormModal = ({ isOpen, onClose, onSubmit, initialSlotData, clientePreseleccionado, novedadId }) => {
  const [formData, setFormData] = useState({
    novedad: null,
    fecha: null,
    hora: null,
    cliente: null,
    empleado: null,
    servicios: [],
  });
  const [novedades, setNovedades] = useState([]);
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);
  const [empleadosDisponibles, setEmpleadosDisponibles] = useState([]);
  const [clientesList, setClientesList] = useState([]);
  const [showClienteSelectModal, setShowClienteSelectModal] = useState(false);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDependencies, setIsLoadingDependencies] = useState(false);
  
  // Cargar lista inicial de clientes al abrir el modal de selección
  useEffect(() => {
    if (showClienteSelectModal) {
      fetchClientesParaCitas('')
        .then(clientes => setClientesList(clientes))
        .catch(() => setClientesList([]));
    }
  }, [showClienteSelectModal]);
  useEffect(() => {
    if (isOpen) {
      setIsLoadingDependencies(true);
      setError('');

      const promises = [
        fetchNovedades(),
        fetchServiciosDisponiblesParaCitas(),
      ];

      Promise.all(promises).then(([novedadesRes, serviciosRes]) => {
        const novedadesData = novedadesRes.filter(novedad => novedad.estado === true);
        const servicios = serviciosRes;

        setNovedades(novedadesData);
        setServiciosDisponibles(servicios);

        // Si hay una novedad preseleccionada, cargar sus empleados
        if (novedadId) {
          const novedadSeleccionada = novedadesData.find(n => n.idNovedad === novedadId);
          if (novedadSeleccionada) {
            setFormData(prev => ({
              ...prev,
              novedad: novedadSeleccionada,
              empleados: novedadSeleccionada.empleados || []
            }));
            setEmpleadosDisponibles(novedadSeleccionada.empleados || []);
          }
        }

        // Si hay un cliente preseleccionado
        if (clientePreseleccionado) {
          setFormData(prev => ({
            ...prev,
            cliente: clientePreseleccionado
          }));
        }

      }).catch(err => {
        console.error("Error cargando dependencias:", err);
        setError("Error al cargar datos necesarios: " + (err.response?.data?.message || err.message));
      }).finally(() => {
        setIsLoadingDependencies(false);
      });
    }
  }, [isOpen, initialSlotData, clientePreseleccionado, novedadId]);

  // Lógica para el Calendario
  const diasPermitidosNumeros = useMemo(() => {
    if (!formData.novedad) return [];
    const diasMap = { 
      "Domingo": 0, "Lunes": 1, "Martes": 2, "Miércoles": 3, 
      "Jueves": 4, "Viernes": 5, "Sábado": 6 
    };
    return formData.novedad.dias.map(nombreDia => diasMap[nombreDia]).filter(dia => dia !== undefined);
  }, [formData.novedad]);

  const filtrarDiasDisponibles = (date) => {
    const diaDeLaSemana = moment(date).day();
    return diasPermitidosNumeros.includes(diaDeLaSemana);
  };

  // Lógica para generar Horas
  const horasDisponibles = useMemo(() => {
    if (!formData.novedad) return [];
    const horas = [];
    let tiempoActual = moment(formData.novedad.horaInicio, 'HH:mm:ss');
    const tiempoFin = moment(formData.novedad.horaFin, 'HH:mm:ss');
    while (tiempoActual.isBefore(tiempoFin)) {
      horas.push({
        value: tiempoActual.format('HH:mm'),
        label: tiempoActual.format('HH:mm')
      });
      tiempoActual.add(60, 'minutes');
    }
    return horas;
  }, [formData.novedad]);

  // Opciones para los selects
  const novedadOptions = useMemo(() => {
    return novedades
      .filter(novedad => {
        // Filtrar novedades que ya finalizaron
        const fechaFin = moment(novedad.fechaFin);
        const hoy = moment();
        return fechaFin.isAfter(hoy) || fechaFin.isSame(hoy, 'day');
      })
      .map(novedad => ({
        value: novedad,
        label: `${moment(novedad.fechaInicio).format('DD/MM/YYYY')} - ${moment(novedad.fechaFin).format('DD/MM/YYYY')}`
      }));
  }, [novedades]);

  const empleadoOptions = useMemo(() => {
    if (!formData.novedad) return [];
    return formData.novedad.empleados.map(empleado => ({
      value: empleado,
      label: `${empleado.nombre} ${empleado.apellido || ''}`.trim()
    }));
  }, [formData.novedad]);

  const servicioOptions = useMemo(() => {
    return serviciosDisponibles.map(servicio => ({
      value: servicio,
      label: `${servicio.nombre} - $${servicio.precio}`
    }));
  }, [serviciosDisponibles]);

  // Calcular total
  const totalServicios = useMemo(() => {
    return formData.servicios.reduce((total, servicio) => total + parseFloat(servicio.precio || 0), 0);
  }, [formData.servicios]);

  // Lógica para buscar clientes
  const handleClienteSearch = (term) => {
    const query = term?.trim() || '';
    fetchClientesParaCitas(query)
      .then(clientes => setClientesList(clientes))
      .catch(() => setClientesList([]));
  };

  const clientesParaModal = useMemo(() => {
    return clientesList.map(c => ({
      ...c,
      value: c.idCliente,
      label: `${c.nombre} ${c.apellido || ''}`.trim(),
      displayName: `${c.nombre} ${c.apellido || ''}`.trim()
    }));
  }, [clientesList]);
  
  // Lógica de envío del formulario
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    // Validaciones básicas del front-end
    if (!formData.cliente) { setError("Debe seleccionar un cliente."); return; }
    if (!formData.empleado) { setError("Debe seleccionar un empleado."); return; }
    if (!formData.servicios || formData.servicios.length === 0) { setError("Debe seleccionar al menos un servicio."); return; }
    if (!formData.fecha) { setError("Debe seleccionar una fecha."); return; }
    if (!formData.hora) { setError("Debe seleccionar una hora."); return; }

    setError('');
    setIsLoading(true);

    // Preparar el objeto final para la API
    const [horas, minutos] = formData.hora.split(':');
    const startDateTime = moment(formData.fecha).set({ hour: horas, minute: minutos }).toDate();
    
    const dataToSend = {
      start: startDateTime,
      clienteId: Number(formData.cliente.idCliente),
      empleadoId: Number(formData.empleado.idUsuario),
      servicios: formData.servicios.map(s => Number(s.id)),
      novedadId: Number(formData.novedad.idNovedad),
      estadoCitaId: 2,
      precioTotal: totalServicios
    };

    try {
      await onSubmit(dataToSend);
    } catch (submissionError) {
      setError(submissionError.message || "Error al guardar la cita.");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">Agendar Nueva Cita</h2>
          <button className="admin-modal-close" onClick={onClose} disabled={isLoading}>&times;</button>
        </div>
        <div className="admin-modal-body">
          {isLoadingDependencies ? (
            <div className="cargando-modal">Cargando datos...</div>
          ) : (
            <form onSubmit={handleSubmitForm} className="agendar-cita-form">
              
              {/* Paso 1: Selección de Novedad */}
              <div className="form-step">
                <h2>1. Selecciona una Novedad</h2>
                <div className="admin-form-group">
                  <Select
                    value={formData.novedad ? novedadOptions.find(opt => opt.value.idNovedad === formData.novedad.idNovedad) : null}
                    onChange={(selectedOption) => {
                      setFormData(prev => ({ 
                        ...prev, 
                        novedad: selectedOption?.value || null,
                        fecha: null,
                        hora: null,
                        empleado: null,
                        servicios: []
                      }));
                    }}
                    options={novedadOptions}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    placeholder="Selecciona una novedad..."
                    noOptionsMessage={() => 'No hay novedades disponibles'}
                  />
                </div>
              </div>

              {/* Paso 2: Calendario */}
              {formData.novedad && (
                <div className="form-step">
                  <h2>2. Elige una Fecha</h2>
                  <div className="datepicker-wrapper">
                    <DatePicker
                      selected={formData.fecha}
                      onChange={(date) => setFormData(prev => ({ ...prev, fecha: date, hora: null }))}
                      minDate={moment(formData.novedad.fechaInicio).toDate()}
                      maxDate={moment(formData.novedad.fechaFin).toDate()}
                      filterDate={filtrarDiasDisponibles}
                      locale="es"
                      inline
                      calendarClassName="novedad-calendar"
                      dayClassName={(date) => {
                        const diaDeLaSemana = moment(date).day();
                        const diaNombre = moment(date).format('dddd');
                        const diaNormalizado = diaNombre
                          .toLowerCase()
                          .normalize('NFD')
                          .replace(/[\u0300-\u036f]/g, '')
                          .replace('á', 'a')
                          .replace('é', 'e')
                          .replace('í', 'i')
                          .replace('ó', 'o')
                          .replace('ú', 'u');
                        
                        if (diasPermitidosNumeros.includes(diaDeLaSemana)) {
                          return `dia-disponible dia-${diaNormalizado}`;
                        }
                        return 'dia-no-disponible';
                      }}
                      disabled={(date) => {
                        const diaDeLaSemana = moment(date).day();
                        return !diasPermitidosNumeros.includes(diaDeLaSemana);
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Paso 3: Horarios */}
              {formData.fecha && (
                <div className="form-step">
                  <h2>3. Elige un Horario</h2>
                  <div className="horas-grid">
                    {horasDisponibles.map(hora => (
                      <button 
                        key={hora.value} 
                        type="button"
                        className={`hora-btn ${formData.hora === hora.value ? 'selected' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, hora: hora.value }))}
                      >
                        {hora.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Paso 4: Cliente */}
              {formData.hora && (
                <div className="form-step">
                  <h2>4. Busca y Selecciona el Cliente</h2>
                  <div className="admin-form-group">
                    <input
                      type="text"
                      className="buscar-cliente-input"
                      value={formData?.cliente ? `${formData.cliente.nombre} ${formData.cliente.apellido || ''}`.trim() : ''}
                      onClick={() => setShowClienteSelectModal(true)}
                      placeholder="Seleccionar cliente"
                      readOnly
                    />
                  </div>
                </div>
              )}

              {/* Paso 5: Empleado */}
              {formData.cliente && (
                <div className="form-step">
                  <h2>5. Selecciona el Empleado</h2>
                  <div className="admin-form-group">
                    <Select
                      value={formData.empleado ? empleadoOptions.find(opt => opt.value.idUsuario === formData.empleado.idUsuario) : null}
                      onChange={(selectedOption) => {
                        setFormData(prev => ({ ...prev, empleado: selectedOption?.value || null }));
                      }}
                      options={empleadoOptions}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      placeholder="Selecciona un empleado..."
                      noOptionsMessage={() => 'No hay empleados disponibles'}
                    />
                  </div>
                </div>
              )}

              {/* Paso 6: Servicios */}
              {formData.empleado && (
                <div className="form-step">
                  <h2>6. Selecciona los Servicios</h2>
                  <div className="admin-form-group">
                    <Select
                      value={formData.servicios.map(servicio => 
                        servicioOptions.find(opt => opt.value.id === servicio.id)
                      ).filter(Boolean)}
                      onChange={(selectedOptions) => {
                        setFormData(prev => ({ 
                          ...prev, 
                          servicios: selectedOptions?.map(opt => opt.value) || []
                        }));
                      }}
                      options={servicioOptions}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      placeholder="Selecciona uno o más servicios..."
                      noOptionsMessage={() => 'No hay servicios disponibles'}
                      isMulti
                    />
                  </div>
                </div>
              )}

              {/* Resumen y Botón de Agendar */}
              {formData.servicios.length > 0 && (
                <div className="form-step">
                  <h2>Resumen de la Cita</h2>
                  <div className="resumen-cita">
                    <div className="resumen-item">
                      <strong>Cliente:</strong> {formData.cliente?.nombre} {formData.cliente?.apellido}
                    </div>
                    <div className="resumen-item">
                      <strong>Empleado:</strong> {formData.empleado?.nombre} {formData.empleado?.apellido}
                    </div>
                    <div className="resumen-item">
                      <strong>Fecha y Hora:</strong> {moment(formData.fecha).format('DD/MM/YYYY')} a las {formData.hora}
                    </div>
                    <div className="resumen-item">
                      <strong>Servicios:</strong>
                      <ul className="servicios-lista">
                        {formData.servicios.map((servicio, index) => (
                          <li key={index} className="servicio-item">
                            <span>{servicio.nombre}</span>
                            <span>${servicio.precio}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="resumen-total">
                      <strong>Total: ${totalServicios}</strong>
                    </div>
                  </div>
                </div>
              )}

              {error && <div className="admin-form-error">{error}</div>}
            </form>
          )}
        </div>
        <div className="admin-modal-footer">
          <div className="modal-buttons-container">
            <button type="submit" className="admin-form-button primary" disabled={isLoading || isLoadingDependencies || !formData.servicios.length} onClick={handleSubmitForm}>
              {isLoading ? "Guardando..." : "Agendar Cita"}
            </button>
            <button type="button" className="admin-form-button secondary" onClick={onClose} disabled={isLoading}>
              Cancelar
            </button>
          </div>
        </div>
      </div>

      <ItemSelectionModal
        isOpen={showClienteSelectModal}
        onClose={() => setShowClienteSelectModal(false)}
        title="Seleccionar Cliente"
        items={clientesParaModal}
        onSearch={handleClienteSearch}
        onSelectItem={(selectedItem) => { 
          setFormData(prev => ({ ...prev, cliente: selectedItem })); 
          setShowClienteSelectModal(false); 
        }}
        itemKey="idCliente"
        itemName="nombre"
        displayProperty="displayName"
        searchPlaceholder="Buscar cliente por nombre..."
      />
    </div>
  );
};

export default CitaFormModal;