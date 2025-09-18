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

const getDiaPillClass = (dia) => {
  const diaNormalizado = dia
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
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
    formState: { errors },
  } = useForm({
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
      const horaInicioDate = initialData.horaInicio
        ? parseISO(`1970-01-01T${initialData.horaInicio}`)
        : null;
      const horaFinDate = initialData.horaFin
        ? parseISO(`1970-01-01T${initialData.horaFin}`)
        : null;

      setValue('fechaInicio', initialData.fechaInicio ? parseISO(initialData.fechaInicio) : null);
      setValue('fechaFin', initialData.fechaFin ? parseISO(initialData.fechaFin) : null);
      setValue('horaInicio', horaInicioDate);
      setValue('horaFin', horaFinDate);

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
      horaInicio: format(data.horaInicio, 'HH:mm:ss'),
      horaFin: format(data.horaFin, 'HH:mm:ss'),
      dias: data.dias.map((dia) => dia.value),
      empleadosIds: data.empleados.map((emp) => emp.value),
    };
    onFormSubmit(datosParaEnviar);
  };

  const watchFechaInicio = watch('fechaInicio');
  const watchHoraInicio = watch('horaInicio');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="admin-form-section">
      <div className="admin-form-section-title">Información de la Novedad</div>
      
      <div className="admin-form-row-2">
        <div className="admin-form-group">
          <label htmlFor="fechaInicio" className="admin-form-label">Fecha de Inicio</label>
          <Controller
            name="fechaInicio"
            control={control}
            rules={{ required: 'La fecha de inicio es obligatoria' }}
            render={({ field }) => (
              <DatePicker
                {...field}
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                selectsStart
                startDate={field.value}
                endDate={watch('fechaFin')}
                dateFormat="dd/MM/yyyy"
                placeholderText="Seleccione una fecha"
                locale="es"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={10}
              />
            )}
          />
          {errors.fechaInicio && <span className="admin-form-error">{errors.fechaInicio.message}</span>}
        </div>
        <div className="admin-form-group">
          <label htmlFor="fechaFin" className="admin-form-label">Fecha de Fin</label>
          <Controller
            name="fechaFin"
            control={control}
            rules={{
              required: 'La fecha de fin es obligatoria',
              validate: (value) =>
                !watchFechaInicio || value >= watchFechaInicio || 'La fecha de fin no puede ser anterior a la de inicio',
            }}
            render={({ field }) => (
              <DatePicker
                {...field}
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                selectsEnd
                startDate={watchFechaInicio}
                endDate={field.value}
                minDate={watchFechaInicio}
                dateFormat="dd/MM/yyyy"
                placeholderText="Seleccione una fecha"
                locale="es"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={10}
              />
            )}
          />
          {errors.fechaFin && <span className="admin-form-error">{errors.fechaFin.message}</span>}
        </div>
      </div>
      
      <div className="admin-form-row-2">
        <div className="admin-form-group">
          <label htmlFor="horaInicio" className="admin-form-label">Hora de Inicio</label>
          <Controller
            name="horaInicio"
            control={control}
            rules={{ required: 'La hora de inicio es obligatoria' }}
            render={({ field }) => (
              <DatePicker
                {...field}
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Hora"
                dateFormat="h:mm aa"
                placeholderText="Seleccione una hora"
                locale="es"
              />
            )}
          />
          {errors.horaInicio && <span className="admin-form-error">{errors.horaInicio.message}</span>}
        </div>
        <div className="admin-form-group">
          <label htmlFor="horaFin" className="admin-form-label">Hora de Fin</label>
          <Controller
            name="horaFin"
            control={control}
            rules={{
              required: 'La hora de fin es obligatoria',
              validate: (value) =>
                !watchHoraInicio || value > watchHoraInicio || 'La hora de fin debe ser posterior a la de inicio',
            }}
            render={({ field }) => (
              <DatePicker
                {...field}
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Hora"
                dateFormat="h:mm aa"
                placeholderText="Seleccione una hora"
                locale="es"
              />
            )}
          />
          {errors.horaFin && <span className="admin-form-error">{errors.horaFin.message}</span>}
        </div>
      </div>
      
      <div className="admin-form-group">
        <label className="admin-form-label">Días de la Semana Aplicables</label>
          <Controller
            name="dias"
            control={control}
            rules={{ required: 'Debe seleccionar al menos un día' }}
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                options={DIAS_DE_LA_SEMANA_OPTIONS}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Seleccione los días..."
                noOptionsMessage={() => 'No hay más opciones'}
                components={{
                  MultiValue: DiaPill,
                }}
              />
            )}
          />
          {errors.dias && <span className="admin-form-error">{errors.dias.message}</span>}
      </div>
      
      <div className="admin-form-group">
        <label className="admin-form-label">Asignar a Empleado(s)</label>
          <Controller
            name="empleados"
            control={control}
            rules={{ required: 'Debe seleccionar al menos un empleado' }}
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
              />
            )}
          />
          {errors.empleados && <span className="admin-form-error">{errors.empleados.message}</span>}
      </div>

      <div className="admin-form-actions">
        <button type="submit" disabled={isLoading} className="admin-form-button">
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