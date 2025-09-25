import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import DatePicker, { registerLocale } from 'react-datepicker';
import { es } from 'date-fns/locale/es';
import 'react-datepicker/dist/react-datepicker.css';
import { getUsuariosAPI } from '../../usuarios/services/usuariosService';
import { format, parseISO } from 'date-fns';
import { Badge } from 'react-bootstrap';
import '../../../shared/styles/admin-layout.css';
import '../css/ConfigHorarios.css';

registerLocale('es', es);

const DIAS_DE_LA_SEMANA_OPTIONS = [
  { value: 'Lunes', label: 'Lunes' },
  { value: 'Martes', label: 'Martes' },
  { value: 'Miércoles', label: 'Miércoles' },
  { value: 'Jueves', label: 'Jueves' },
  { value: 'Viernes', label: 'Viernes' },
  { value: 'Sábado', label: 'Sábado' },
  { value: 'Domingo', label: 'Domingo' },
];

// Generar opciones de horas de 00:00 a 23:45 en intervalos de 15 minutos
const HORAS_OPTIONS = [];
for (let hora = 0; hora < 24; hora++) {
  for (let minuto = 0; minuto < 60; minuto += 15) {
    const horaStr = hora.toString().padStart(2, '0');
    const minutoStr = minuto.toString().padStart(2, '0');
    const timeString = `${horaStr}:${minutoStr}`;
    const displayTime = `${horaStr}:${minutoStr}`;
    HORAS_OPTIONS.push({
      value: timeString,
      label: displayTime
    });
  }
}

// Funciones de validación

const validateTimeFormat = (value) => {
  if (!value) return 'La hora es obligatoria';
  
  // Verificar formato de hora (HH:mm)
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(value)) {
    return 'Formato de hora inválido. Use formato de 24 horas (HH:mm)';
  }
  
  return true;
};

// Función para comparar horas
const compareTimes = (time1, time2) => {
  const [h1, m1] = time1.split(':').map(Number);
  const [h2, m2] = time2.split(':').map(Number);
  const minutes1 = h1 * 60 + m1;
  const minutes2 = h2 * 60 + m2;
  return minutes1 - minutes2;
};


const getDiaPillClass = (dia) => {
  const diaNormalizado = dia
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace('á', 'a')
    .replace('é', 'e')
    .replace('í', 'i')
    .replace('ó', 'o')
    .replace('ú', 'u');
  return `dia-pill dia-pill-${diaNormalizado}`;
};

const DiaPill = ({ children, ...props }) => {
  return (
    <Badge
      pill
      className={getDiaPillClass(props.data.value)}
      style={{
        display: 'flex',
        alignItems: 'center',
        margin: '2px',
      }}
    >
      {children}
      <span
        onClick={props.removeProps.onClick}
        className="dia-pill-remove"
        title="Eliminar"
      >
        &times;
      </span>
    </Badge>
  );
};

const NovedadForm = ({ onFormSubmit, onCancel, isLoading, initialData, isEditing }) => {
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange', // Validar en tiempo real
    reValidateMode: 'onChange', // Revalidar en tiempo real
    defaultValues: {
      fechaInicio: null,
      fechaFin: null,
      horaInicio: null,
      horaFin: null,
      dias: [],
      empleados: [],
    },
  });

  const [empleadoOptions, setEmpleadoOptions] = useState([]);

  useEffect(() => {
    const cargarEmpleados = async () => {
      try {
        const usuarios = await getUsuariosAPI({ rol: 'Empleado', estado: true });
        const options = usuarios.map((user) => ({
          value: user.idUsuario,
          label: user.empleado
            ? `${user.nombre} ${user.apellido}`
            : `${user.nombre} ${user.apellido}`,
        }));
        setEmpleadoOptions(options);
      } catch (err) {
        console.error('Error al cargar empleados:', err);
      }
    };
    cargarEmpleados();
  }, []);

  useEffect(() => {
    if (isEditing && initialData) {
      // Convertir horas de formato HH:mm:ss a HH:mm para el select
      const horaInicioStr = initialData.horaInicio
        ? initialData.horaInicio.slice(0, 5) // Tomar solo HH:mm
        : null;
      const horaFinStr = initialData.horaFin
        ? initialData.horaFin.slice(0, 5) // Tomar solo HH:mm
        : null;

      setValue('fechaInicio', initialData.fechaInicio ? parseISO(initialData.fechaInicio) : null);
      setValue('fechaFin', initialData.fechaFin ? parseISO(initialData.fechaFin) : null);
      setValue('horaInicio', horaInicioStr);
      setValue('horaFin', horaFinStr);

      const diasAsignados =
        initialData.dias?.map((dia) => ({
          value: dia,
          label: dia,
        })) || [];
      setValue('dias', diasAsignados);

      const empleadosAsignados =
        initialData.empleados?.map((emp) => ({
          value: emp.idUsuario,
          label: emp.empleado
            ? `${emp.nombre} ${emp.apellido}`
            : emp.nombre,
        })) || [];
      setValue('empleados', empleadosAsignados);
    }
  }, [isEditing, initialData, setValue]);

  const onSubmit = (data) => {
    const datosParaEnviar = {
      ...data,
      fechaInicio: format(data.fechaInicio, 'yyyy-MM-dd'),
      fechaFin: format(data.fechaFin, 'yyyy-MM-dd'),
      horaInicio: `${data.horaInicio}:00`, // Agregar segundos para el formato esperado
      horaFin: `${data.horaFin}:00`, // Agregar segundos para el formato esperado
      dias: data.dias.map((dia) => dia.value),
      empleadosIds: data.empleados.map((emp) => emp.value),
    };
    onFormSubmit(datosParaEnviar);
  };

  const watchFechaInicio = watch('fechaInicio');
  const watchHoraInicio = watch('horaInicio');

  // Función para limpiar espacios automáticamente
  const handleFieldBlur = (fieldName, currentValue, setValue) => {
    if (typeof currentValue === 'string' && currentValue !== currentValue.trim()) {
      setValue(fieldName, currentValue.trim());
    }
  };

  // Función para limpiar espacios en arrays de objetos
  const handleArrayFieldBlur = (fieldName, currentValue, setValue) => {
    if (Array.isArray(currentValue)) {
      const cleanedValue = currentValue.map(item => ({
        ...item,
        label: typeof item.label === 'string' ? item.label.trim() : item.label
      }));
      setValue(fieldName, cleanedValue);
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="admin-form-section">
      <div className="admin-form-section-title">Información de la Novedad</div>
      
      <div className="admin-form-row-2">
        <div className="admin-form-group">
          <label htmlFor="fechaInicio" className="admin-form-label">Fecha de Inicio <span className="required-asterisk">*</span></label>
          <div className="date-input-container">
            <Controller
              name="fechaInicio"
              control={control}
              rules={{ 
                required: 'La fecha de inicio es obligatoria',
                validate: (value) => {
                  if (!value) return 'La fecha de inicio es obligatoria';
                  
                  // Verificar si es una fecha válida
                  if (!(value instanceof Date) || isNaN(value.getTime())) {
                    return 'Formato de fecha inválido. Use el formato DD/MM/YYYY';
                  }
                  
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  if (value < today) {
                    return 'La fecha no puede ser anterior a la fecha actual';
                  }
                  
                  return true;
                }
              }}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  selected={field.value}
                  onChange={(date) => {
                    field.onChange(date);
                    trigger('fechaInicio');
                  }}
                  onBlur={() => handleFieldBlur('fechaInicio', field.value, setValue)}
                  selectsStart
                  startDate={field.value}
                  endDate={watch('fechaFin')}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Seleccione una fecha"
                  locale="es"
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={10}
                  popperPlacement="bottom"
                  popperModifiers={[
                    {
                      name: 'offset',
                      options: {
                        offset: [0, 4],
                      },
                    },
                  ]}
                  minDate={new Date()}
                  filterDate={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date >= today;
                  }}
                />
              )}
            />
            <span className="date-icon">📅</span>
          </div>
          {errors.fechaInicio && <span className="admin-form-error">{errors.fechaInicio.message}</span>}
        </div>
        <div className="admin-form-group">
          <label htmlFor="fechaFin" className="admin-form-label">Fecha de Fin <span className="required-asterisk">*</span></label>
          <div className="date-input-container">
            <Controller
              name="fechaFin"
              control={control}
              rules={{
                required: 'La fecha de fin es obligatoria',
                validate: (value) => {
                  if (!value) return 'La fecha de fin es obligatoria';
                  
                  // Verificar si es una fecha válida
                  if (!(value instanceof Date) || isNaN(value.getTime())) {
                    return 'Formato de fecha inválido. Use el formato DD/MM/YYYY';
                  }
                  
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  if (value < today) {
                    return 'La fecha no puede ser anterior a la fecha actual';
                  }
                  
                  if (watchFechaInicio && value < watchFechaInicio) {
                    return 'La fecha de fin no puede ser anterior a la fecha de inicio';
                  }
                  
                  return true;
                }
              }}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  selected={field.value}
                  onChange={(date) => {
                    field.onChange(date);
                    trigger('fechaFin');
                  }}
                  onBlur={() => handleFieldBlur('fechaFin', field.value, setValue)}
                  selectsEnd
                  startDate={watchFechaInicio}
                  endDate={field.value}
                  minDate={watchFechaInicio || new Date()}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Seleccione una fecha"
                  locale="es"
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={10}
                  popperPlacement="bottom"
                  popperModifiers={[
                    {
                      name: 'offset',
                      options: {
                        offset: [0, 4],
                      },
                    },
                  ]}
                  filterDate={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (watchFechaInicio) {
                      return date >= watchFechaInicio;
                    }
                    return date >= today;
                  }}
                />
              )}
            />
            <span className="date-icon">📅</span>
          </div>
          {errors.fechaFin && <span className="admin-form-error">{errors.fechaFin.message}</span>}
        </div>
      </div>
      
      <div className="admin-form-row-2">
        <div className="admin-form-group">
          <label htmlFor="horaInicio" className="admin-form-label">Hora de Inicio <span className="required-asterisk">*</span></label>
          <div className="time-input-container">
            <Controller
              name="horaInicio"
              control={control}
              rules={{ 
                required: 'La hora de inicio es obligatoria',
                validate: (value) => {
                  if (!value) return 'La hora de inicio es obligatoria';
                  
                  // Verificar formato de hora (HH:mm)
                  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
                  if (!timeRegex.test(value)) {
                    return 'Formato de hora inválido. Use formato de 24 horas (HH:mm)';
                  }
                  
                  return true;
                }
              }}
              render={({ field }) => (
                <div>
                  <input
                    type="text"
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      trigger('horaInicio');
                    }}
                    onBlur={() => handleFieldBlur('horaInicio', field.value, setValue)}
                    placeholder="HH:mm (ej: 07:16)"
                    className="time-input"
                  />
                  <Select
                    value={field.value ? HORAS_OPTIONS.find(option => option.value === field.value) : null}
                    onChange={(selectedOption) => {
                      field.onChange(selectedOption ? selectedOption.value : null);
                      trigger('horaInicio');
                    }}
                    options={HORAS_OPTIONS}
                    className="react-select-container time-select"
                    classNamePrefix="react-select"
                    placeholder="O seleccione de la lista"
                    noOptionsMessage={() => 'No hay más opciones'}
                  />
                </div>
              )}
            />
            <span className="time-icon">🕐</span>
          </div>
          {errors.horaInicio && <span className="admin-form-error">{errors.horaInicio.message}</span>}
        </div>
        <div className="admin-form-group">
          <label htmlFor="horaFin" className="admin-form-label">Hora de Fin <span className="required-asterisk">*</span></label>
          <div className="time-input-container">
            <Controller
              name="horaFin"
              control={control}
              rules={{
                required: 'La hora de fin es obligatoria',
                validate: (value) => {
                  const timeValidation = validateTimeFormat(value);
                  if (timeValidation !== true) return timeValidation;
                  
                  if (watchHoraInicio && value) {
                    const comparison = compareTimes(value, watchHoraInicio);
                    if (comparison <= 0) {
                      return 'La hora de fin debe ser posterior a la de inicio';
                    }
                  }
                  return true;
                }
              }}
              render={({ field }) => (
                <div>
                  <input
                    type="text"
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      trigger('horaFin');
                    }}
                    onBlur={() => handleFieldBlur('horaFin', field.value, setValue)}
                    placeholder="HH:mm (ej: 08:30)"
                    className="time-input"
                  />
                  <Select
                    value={field.value ? HORAS_OPTIONS.find(option => option.value === field.value) : null}
                    onChange={(selectedOption) => {
                      field.onChange(selectedOption ? selectedOption.value : null);
                      trigger('horaFin');
                    }}
                    options={HORAS_OPTIONS}
                    className="react-select-container time-select"
                    classNamePrefix="react-select"
                    placeholder="O seleccione de la lista"
                    noOptionsMessage={() => 'No hay más opciones'}
                  />
                </div>
              )}
            />
            <span className="time-icon">🕐</span>
          </div>
          {errors.horaFin && <span className="admin-form-error">{errors.horaFin.message}</span>}
        </div>
      </div>
      
      <div className="admin-form-row-2">
        <div className="admin-form-group">
          <label className="admin-form-label">Días de la Semana Aplicables <span className="required-asterisk">*</span></label>
          <Controller
            name="dias"
            control={control}
            rules={{ 
              required: 'Debe seleccionar al menos un día',
              validate: (value) => {
                if (!value || value.length === 0) {
                  return 'Debe seleccionar al menos un día';
                }
                return true;
              }
            }}
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                options={DIAS_DE_LA_SEMANA_OPTIONS}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Seleccione los días..."
                noOptionsMessage={() => 'No hay más opciones'}
                onChange={(selectedOptions) => {
                  field.onChange(selectedOptions);
                  trigger('dias');
                }}
                onBlur={() => handleArrayFieldBlur('dias', field.value, setValue)}
                components={{
                  MultiValue: DiaPill,
                }}
              />
            )}
          />
          {errors.dias && <span className="admin-form-error">{errors.dias.message}</span>}
        </div>
        
        <div className="admin-form-group">
          <label className="admin-form-label">Asignar a Empleado(s) <span className="required-asterisk">*</span></label>
          <Controller
            name="empleados"
            control={control}
            rules={{ 
              required: 'Debe seleccionar al menos un empleado',
              validate: (value) => {
                if (!value || value.length === 0) {
                  return 'Debe seleccionar al menos un empleado';
                }
                return true;
              }
            }}
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                options={empleadoOptions}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Seleccione empleado(s)..."
                isLoading={!empleadoOptions.length}
                noOptionsMessage={() => 'No se encontraron empleados'}
                onChange={(selectedOptions) => {
                  field.onChange(selectedOptions);
                  trigger('empleados');
                }}
                onBlur={() => handleArrayFieldBlur('empleados', field.value, setValue)}
              />
            )}
          />
          {errors.empleados && <span className="admin-form-error">{errors.empleados.message}</span>}
        </div>
      </div>

      <div className="admin-form-actions">
        <button 
          type="submit" 
          disabled={isLoading || !isValid || Object.keys(errors).length > 0} 
          className="admin-form-button"
        >
          {isLoading ? 'Guardando...' : isEditing ? 'Actualizar Novedad' : 'Crear Novedad'}
        </button>
        <button type="button" onClick={onCancel} className="admin-form-button secondary" disabled={isLoading}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default NovedadForm;