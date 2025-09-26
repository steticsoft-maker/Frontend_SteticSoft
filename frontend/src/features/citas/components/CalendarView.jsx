// src/features/citas/components/CalendarView.jsx
import React, { useState, useMemo } from "react";
import moment from "moment";
import "moment/locale/es";
import {
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaEdit,
  FaTrashAlt,
} from "react-icons/fa";
import "../css/CalendarView.css";

moment.locale("es");

const CalendarView = ({
  citas = [],
  onViewDetails,
  onEdit,
  onDelete,
  onStatusChange,
  estadosCita = [],
}) => {
  const [currentDate, setCurrentDate] = useState(moment());

  // Obtener el primer día del mes y el número de días
  const startOfMonth = currentDate.clone().startOf("month");
  const endOfMonth = currentDate.clone().endOf("month");
  const startOfCalendar = startOfMonth.clone().startOf("week");
  const endOfCalendar = endOfMonth.clone().endOf("week");

  // Generar array de días del calendario
  const calendarDays = useMemo(() => {
    const days = [];
    const day = startOfCalendar.clone();

    while (day.isSameOrBefore(endOfCalendar, "day")) {
      days.push(day.clone());
      day.add(1, "day");
    }

    return days;
  }, [startOfCalendar, endOfCalendar]);

  // Filtrar citas del mes actual
  const citasDelMes = useMemo(() => {
    return citas.filter((cita) => {
      const citaDate = moment(cita.start);
      return citaDate.isSame(currentDate, "month");
    });
  }, [citas, currentDate]);

  // Agrupar citas por día
  const citasPorDia = useMemo(() => {
    const agrupadas = {};
    citasDelMes.forEach((cita) => {
      const fecha = moment(cita.start).format("YYYY-MM-DD");
      if (!agrupadas[fecha]) {
        agrupadas[fecha] = [];
      }
      agrupadas[fecha].push(cita);
    });
    return agrupadas;
  }, [citasDelMes]);

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => prev.clone().add(direction, "month"));
  };

  const goToToday = () => {
    setCurrentDate(moment());
  };

  const getEstadoClass = (estado) => {
    return (estado || "desconocido").toLowerCase().replace(/\s+/g, "-");
  };

  const isActionable = (estado) => {
    const lowerCaseEstado = (estado || "").toLowerCase();
    return (
      lowerCaseEstado !== "finalizado" &&
      lowerCaseEstado !== "cancelado" &&
      lowerCaseEstado !== "completado"
    );
  };

  const getCitasDelDia = (day) => {
    const fecha = day.format("YYYY-MM-DD");
    return citasPorDia[fecha] || [];
  };

  const isToday = (day) => {
    return day.isSame(moment(), "day");
  };

  const isCurrentMonth = (day) => {
    return day.isSame(currentDate, "month");
  };

  const renderCitaEnCalendario = (cita) => {
    const hora = moment(cita.start).format("HH:mm");
    const estadoClass = getEstadoClass(cita.estadoCita);

    return (
      <div
        key={cita.id}
        className={`calendar-cita-item ${estadoClass}`}
        onClick={(e) => {
          e.stopPropagation();
          onViewDetails(cita);
        }}
        title={`${cita.clienteNombre}${cita.clienteDocumento ? ` (Doc: ${cita.clienteDocumento})` : ''} - ${hora} - ${cita.estadoCita}`}
      >
        <div className="cita-hora">{hora}</div>
        <div className="cita-cliente">
          <div className="cliente-nombre">{cita.clienteNombre}</div>
          {cita.clienteDocumento && (
            <div className="cliente-documento">Doc: {cita.clienteDocumento}</div>
          )}
        </div>
        <div className="cita-estado">{cita.estadoCita}</div>
      </div>
    );
  };

  return (
    <div className="calendar-view-container">
      {/* Header del calendario */}
      <div className="calendar-header">
        <div className="calendar-navigation">
          <button
            className="nav-button"
            onClick={() => navigateMonth(-1)}
            title="Mes anterior"
          >
            <FaChevronLeft />
          </button>

          <div className="calendar-month-year">
            <h2 className="month-title">{currentDate.format("MMMM YYYY")}</h2>
            <button
              className="today-button"
              onClick={goToToday}
              title="Ir a hoy"
            >
              Hoy
            </button>
          </div>

          <button
            className="nav-button"
            onClick={() => navigateMonth(1)}
            title="Mes siguiente"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Días de la semana */}
      <div className="calendar-weekdays">
        {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
          <div key={day} className="weekday-header">
            {day}
          </div>
        ))}
      </div>

      {/* Grid del calendario */}
      <div className="calendar-grid">
        {calendarDays.map((day, index) => {
          const citasDelDia = getCitasDelDia(day);
          const esHoy = isToday(day);
          const esMesActual = isCurrentMonth(day);

          return (
            <div
              key={index}
              className={`calendar-day ${esHoy ? "today" : ""} ${
                !esMesActual ? "other-month" : ""
              }`}
            >
              <div className="day-number">{day.format("D")}</div>

              <div className="day-citas">
                {citasDelDia.length > 0 ? (
                  <div className="citas-container">
                    {citasDelDia.slice(0, 3).map(renderCitaEnCalendario)}
                    {citasDelDia.length > 3 && (
                      <div className="more-citas">
                        +{citasDelDia.length - 3} más
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="no-citas">Sin citas</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Leyenda de estados */}
      <div className="calendar-legend">
        <h4>Estados de Citas:</h4>
        <div className="legend-items">
          {estadosCita.map((estado) => (
            <div key={estado.idEstado} className="legend-item">
              <div
                className={`legend-color ${getEstadoClass(
                  estado.nombreEstado
                )}`}
              ></div>
              <span>{estado.nombreEstado}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
