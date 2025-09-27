// src/features/home/pages/PublicCitasPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import "moment/locale/es";
import {
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaGem,
  FaMagic,
  FaStar,
  FaCheck,
  FaTimes,
  FaInfoCircle,
  FaHeart,
} from "react-icons/fa";
import { getPublicServicios } from "../../../shared/services/publicServices";
import {
  getPublicEmpleados,
  getPublicNovedades,
  getPublicCitas,
} from "../services/publicCitasService";
import { createPublicCita } from "../../../shared/services/publicServices";
import { formatPrice } from "../../../shared/utils/priceUtils";
import { useAuth } from "../../../shared/contexts/authHooks";
import Footer from "../../../shared/components/layout/Footer";
import FooterSpacer from "../../../shared/components/layout/FooterSpacer";
import Swal from "sweetalert2";
import "../css/PublicCitas.css";

moment.locale("es");

function PublicCitasPage() {
  const [services, setServices] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [novedades, setNovedades] = useState([]);
  const [citasExistentes, setCitasExistentes] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessingCita, setIsProcessingCita] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Estados para el calendario
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [selectedNovedad, setSelectedNovedad] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Intentar cargar servicios primero (más crítico)
        let serviciosRes, empleadosRes, novedadesRes, citasRes;

        try {
          serviciosRes = await getPublicServicios({ activo: true });
        } catch (error) {
          serviciosRes = { data: { data: [] } };
        }

        try {
          empleadosRes = await getPublicEmpleados();
        } catch (error) {
          empleadosRes = { data: { data: [] } };
        }

        try {
          novedadesRes = await getPublicNovedades();
        } catch (error) {
          novedadesRes = { data: { data: [] } };
        }

        try {
          citasRes = await getPublicCitas();
        } catch (error) {
          citasRes = { data: { data: [] } };
        }

        // Procesar servicios
        if (serviciosRes.data && Array.isArray(serviciosRes.data.data)) {
          const validServices = serviciosRes.data.data.filter(
            (service) =>
              service && service.idServicio && service.estado === true
          );
          setServices(validServices);
        } else {
          const responseSinFiltro = await getPublicServicios({});
          if (
            responseSinFiltro.data &&
            Array.isArray(responseSinFiltro.data.data)
          ) {
            const serviciosSinFiltro = responseSinFiltro.data.data.filter(
              (service) =>
                service && service.idServicio && service.estado === true
            );
            setServices(serviciosSinFiltro);
          } else {
            setServices([]);
          }
        }

        // Procesar empleados
        const empleadosData = empleadosRes.data?.data || [];
        setEmpleados(empleadosData.filter((e) => e.estado === true));

        // Procesar novedades (horarios disponibles)
        const novedadesData = novedadesRes.data?.data || [];
        const novedadesActivas = novedadesData.filter((n) => n.estado === true);
        setNovedades(novedadesActivas);

        // Procesar citas existentes
        const citasData = citasRes.data?.data || [];
        setCitasExistentes(citasData);

        // Si no hay datos, agregar datos de prueba para desarrollo
        if (
          (serviciosRes.data?.data?.length || 0) === 0 &&
          process.env.NODE_ENV === "development"
        ) {
          setServices([
            {
              idServicio: 1,
              nombre: "Corte de Cabello",
              descripcion: "Corte profesional de cabello",
              precio: 25000,
              estado: true,
            },
            {
              idServicio: 2,
              nombre: "Peinado",
              descripcion: "Peinado elegante para ocasiones especiales",
              precio: 35000,
              estado: true,
            },
          ]);
        }

        if (
          (novedadesData.length || 0) === 0 &&
          process.env.NODE_ENV === "development"
        ) {
          setNovedades([
            {
              idNovedad: 1,
              nombre: "Horario Matutino",
              descripcion: "Horario disponible en las mañanas",
              dias: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
              horaInicio: "08:00:00",
              horaFin: "12:00:00",
              estado: true,
            },
            {
              idNovedad: 2,
              nombre: "Horario Vespertino",
              descripcion: "Horario disponible en las tardes",
              dias: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
              horaInicio: "14:00:00",
              horaFin: "18:00:00",
              estado: true,
            },
          ]);
        }

        // Cargar cita guardada del localStorage
        const savedCita = JSON.parse(localStorage.getItem("pendingCita")) || {};
        if (savedCita.servicios && savedCita.servicios.length > 0) {
          setSelectedServices(savedCita.servicios);
        }
        if (savedCita.fecha) {
          setSelectedDate(moment(savedCita.fecha));
        }
        if (savedCita.hora) {
          setSelectedTime(savedCita.hora);
        }
        if (savedCita.empleado) {
          setSelectedEmpleado(savedCita.empleado);
        }
        if (savedCita.novedad) {
          setSelectedNovedad(savedCita.novedad);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
        // En caso de error, establecer arrays vacíos para evitar errores
        setServices([]);
        setEmpleados([]);
        setNovedades([]);
        setCitasExistentes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Restaurar cita al autenticarse
  useEffect(() => {
    if (isAuthenticated && user?.rol?.nombre === "Cliente") {
      const savedCita = JSON.parse(localStorage.getItem("pendingCita")) || {};
      if (savedCita.servicios && savedCita.servicios.length > 0) {
        Swal.fire({
          title: "¡Bienvenido!",
          text: "Hemos restaurado tu cita pendiente. ¡Ya puedes proceder con tu agendamiento!",
          icon: "info",
          confirmButtonText: "Continuar",
          timer: 4000,
          timerProgressBar: true,
        });
      }
    }
  }, [isAuthenticated, user]);

  // Guardar cita en localStorage
  const saveCitaToLocalStorage = () => {
    const citaData = {
      servicios: selectedServices,
      fecha: selectedDate?.format("YYYY-MM-DD"),
      hora: selectedTime,
      empleado: selectedEmpleado,
      novedad: selectedNovedad,
    };
    localStorage.setItem("pendingCita", JSON.stringify(citaData));
  };

  // Actualizar localStorage cuando cambien los datos
  useEffect(() => {
    if (selectedServices.length > 0 || selectedDate || selectedTime) {
      saveCitaToLocalStorage();
    }
  }, [
    selectedServices,
    selectedDate,
    selectedTime,
    selectedEmpleado,
    selectedNovedad,
  ]);

  // Generar días disponibles del calendario
  const generateCalendarDays = () => {
    const startOfMonth = currentMonth.clone().startOf("month");
    const endOfMonth = currentMonth.clone().endOf("month");
    const startOfCalendar = startOfMonth.clone().startOf("week");
    const endOfCalendar = endOfMonth.clone().endOf("week");

    const days = [];
    const day = startOfCalendar.clone();

    while (day.isSameOrBefore(endOfCalendar, "day")) {
      days.push(day.clone());
      day.add(1, "day");
    }

    return days;
  };

  // Verificar si un día está disponible
  const isDayAvailable = (day) => {
    if (!selectedNovedad) return false;

    const dayOfWeek = day.day();
    const diasDisponibles = {
      Domingo: 0,
      Lunes: 1,
      Martes: 2,
      Miércoles: 3,
      Jueves: 4,
      Viernes: 5,
      Sábado: 6,
    };

    const diasPermitidos =
      selectedNovedad.dias?.map((dia) => diasDisponibles[dia]) || [];
    const hoy = moment().startOf("day");

    return day.isSameOrAfter(hoy) && diasPermitidos.includes(dayOfWeek);
  };

  // Generar horas disponibles
  const generateAvailableTimes = () => {
    if (!selectedNovedad || !selectedDate) return [];

    const horas = [];
    const horaInicio = moment(selectedNovedad.horaInicio, "HH:mm:ss");
    const horaFin = moment(selectedNovedad.horaFin, "HH:mm:ss");
    const ahora = moment();
    const esHoy = selectedDate.isSame(ahora, "day");

    let tiempoActual = horaInicio.clone();
    while (tiempoActual.isBefore(horaFin)) {
      const horaFormateada = tiempoActual.format("HH:mm");

      // Verificar si la hora no ha pasado (si es hoy)
      if (!esHoy || tiempoActual.isAfter(ahora)) {
        // Verificar si no hay cita en esa hora
        const tieneCita = citasExistentes.some((cita) => {
          const citaFecha = moment(cita.fecha);
          const citaHora = moment(cita.hora_inicio, "HH:mm:ss").format("HH:mm");
          return (
            citaFecha.isSame(selectedDate, "day") && citaHora === horaFormateada
          );
        });

        if (!tieneCita) {
          horas.push(horaFormateada);
        }
      }

      tiempoActual.add(30, "minutes"); // Intervalos de 30 minutos
    }

    return horas;
  };

  // Actualizar horas disponibles cuando cambien los datos
  useEffect(() => {
    const times = generateAvailableTimes();
    setAvailableTimes(times);

    // Limpiar hora seleccionada si no está disponible
    if (selectedTime && !times.includes(selectedTime)) {
      setSelectedTime(null);
    }
  }, [selectedNovedad, selectedDate, citasExistentes]);

  const toggleService = (service) => {
    setSelectedServices((prev) => {
      const isSelected = prev.some((s) => s.idServicio === service.idServicio);
      if (isSelected) {
        return prev.filter((s) => s.idServicio !== service.idServicio);
      } else {
        return [...prev, service];
      }
    });
  };

  const handleDateSelect = (date) => {
    if (isDayAvailable(date)) {
      setSelectedDate(date);
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleEmpleadoSelect = (empleado) => {
    setSelectedEmpleado(empleado);
  };

  const handleNovedadSelect = (novedad) => {
    setSelectedNovedad(novedad);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const calculateTotal = () => {
    return selectedServices.reduce(
      (total, service) => total + (service.precio || 0),
      0
    );
  };

  const handleAgendarCita = async () => {
    // Validaciones
    if (selectedServices.length === 0) {
      Swal.fire({
        title: "Servicios requeridos",
        text: "Por favor selecciona al menos un servicio",
        icon: "warning",
        confirmButtonText: "Entendido",
      });
      return;
    }

    if (!selectedDate) {
      Swal.fire({
        title: "Fecha requerida",
        text: "Por favor selecciona una fecha para tu cita",
        icon: "warning",
        confirmButtonText: "Entendido",
      });
      return;
    }

    if (!selectedTime) {
      Swal.fire({
        title: "Hora requerida",
        text: "Por favor selecciona una hora para tu cita",
        icon: "warning",
        confirmButtonText: "Entendido",
      });
      return;
    }

    if (!isAuthenticated) {
      Swal.fire({
        title: "Inicia sesión para continuar",
        text: "Necesitas iniciar sesión para agendar tu cita. Tu selección se guardará.",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Iniciar sesión",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    if (user?.rol?.nombre !== "Cliente") {
      Swal.fire({
        title: "Acceso restringido",
        text: "Solo los clientes pueden agendar citas",
        icon: "error",
        confirmButtonText: "Entendido",
      });
      return;
    }

    // Mostrar información del proceso
    const processInfo = await Swal.fire({
      title: "Confirmar Cita",
      html: `
        <div style="text-align: left;">
          <p><strong>Fecha:</strong> ${selectedDate.format(
            "dddd, D [de] MMMM, YYYY"
          )}</p>
          <p><strong>Hora:</strong> ${selectedTime}</p>
          <p><strong>Servicios:</strong></p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            ${selectedServices
              .map((s) => `<li>${s.nombre} - ${formatPrice(s.precio)}</li>`)
              .join("")}
          </ul>
          <p><strong>Total:</strong> ${formatPrice(calculateTotal())}</p>
          <hr style="margin: 15px 0;">
          <p style="color: #6B46C1; font-weight: bold;">
            <i class="fas fa-info-circle"></i> 
            Esta es una reserva de cita. Recibirás confirmación por correo.
          </p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirmar Cita",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#6B46C1",
    });

    if (!processInfo.isConfirmed) return;

    setIsProcessingCita(true);

    try {
      // Preparar datos para enviar
      const citaData = {
        fecha: selectedDate.format("YYYY-MM-DD"),
        horaInicio: selectedTime,
        servicios: selectedServices.map((s) => s.idServicio),
        empleadoId: selectedEmpleado?.idUsuario || null,
        novedadId: selectedNovedad?.idNovedad || null,
      };

      await createPublicCita(citaData);

      await Swal.fire({
        title: "¡Cita Agendada!",
        text: "Tu cita ha sido agendada exitosamente. Recibirás una confirmación por correo.",
        icon: "success",
        confirmButtonText: "Continuar",
      });

      // Limpiar datos
      setSelectedServices([]);
      setSelectedDate(null);
      setSelectedTime(null);
      setSelectedEmpleado(null);
      setSelectedNovedad(null);
      localStorage.removeItem("pendingCita");
    } catch (error) {
      console.error("Error al agendar cita:", error);

      let errorMessage = "Error al agendar la cita";
      let errorTitle = "Error";

      if (error.response?.status === 400) {
        errorMessage =
          error.response.data?.message ||
          "Datos inválidos. Verifica la información ingresada";
        errorTitle = "Datos incorrectos";
      } else if (error.response?.status === 403) {
        errorMessage =
          "Solo puedes agendar citas entre las 8:00 AM y las 6:00 PM";
        errorTitle = "Horario no válido";
      } else if (error.response?.status === 409) {
        errorMessage =
          "Ya hay una cita programada en esa fecha y hora. Selecciona otra hora.";
        errorTitle = "Horario ocupado";
      } else if (error.response?.status === 500) {
        errorMessage = "Error del servidor. Intenta nuevamente más tarde";
        errorTitle = "Error del servidor";
      }

      Swal.fire({
        title: errorTitle,
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Entendido",
      });
    } finally {
      setIsProcessingCita(false);
    }
  };

  const calendarDays = generateCalendarDays();

  if (loading) {
    return (
      <div className="public-citas-page">
        <div className="loading-container">
          <FaMagic className="loading-icon" />
          <p>Cargando servicios y horarios disponibles...</p>
        </div>
      </div>
    );
  }

  // Mostrar mensaje si no hay datos disponibles
  if (!loading && services.length === 0 && novedades.length === 0) {
    return (
      <div className="public-citas-page">
        {/* Hero Section */}
        <section className="citas-hero">
          <div className="citas-hero-content">
            <h1 className="citas-title">
              <FaCalendarAlt className="title-icon" />
              Agenda tu Cita
            </h1>
            <p className="citas-subtitle">
              Reserva tu espacio para una experiencia única de belleza y
              bienestar
            </p>
          </div>
        </section>

        <div className="citas-container">
          <div className="citas-section">
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <FaInfoCircle
                style={{
                  fontSize: "4rem",
                  color: "#6B7280",
                  marginBottom: "20px",
                }}
              />
              <h2 style={{ color: "#374151", marginBottom: "15px" }}>
                Servicios No Disponibles
              </h2>
              <p
                style={{
                  color: "#6B7280",
                  fontSize: "1.1rem",
                  lineHeight: "1.6",
                }}
              >
                En este momento no tenemos servicios u horarios disponibles para
                agendar citas.
                <br />
                Por favor, intenta nuevamente más tarde o contacta con nosotros
                directamente.
              </p>
              <div style={{ marginTop: "30px" }}>
                <button
                  onClick={() => window.location.reload()}
                  style={{
                    background: "#6B46C1",
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: "600",
                  }}
                >
                  <FaMagic style={{ marginRight: "8px" }} />
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>

        <FooterSpacer />
        <Footer />
      </div>
    );
  }

  return (
    <div className="public-citas-page">
      {/* Hero Section */}
      <section className="citas-hero">
        <div className="citas-hero-content">
          <h1 className="citas-title">
            <FaCalendarAlt className="title-icon" />
            Agenda tu Cita
          </h1>
          <p className="citas-subtitle">
            Reserva tu espacio para una experiencia única de belleza y bienestar
          </p>
        </div>
      </section>

      <div className="citas-container">
        {/* Selección de Horario */}
        <div className="citas-section">
          <h2 className="section-title">
            <FaClock className="section-icon" />
            Horario Disponible
          </h2>

          {novedades.length > 0 ? (
            <div className="novedades-grid">
              {novedades.map((novedad) => (
                <div
                  key={novedad.idNovedad}
                  className={`novedad-card ${
                    selectedNovedad?.idNovedad === novedad.idNovedad
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => handleNovedadSelect(novedad)}
                >
                  <h3>{novedad.nombre}</h3>
                  <p className="novedad-days">
                    {novedad.dias?.join(", ") || ""}
                  </p>
                  <p className="novedad-hours">
                    {novedad.horaInicio} - {novedad.horaFin}
                  </p>
                  <p className="novedad-description">{novedad.descripcion}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-novedades">
              <FaInfoCircle className="info-icon" />
              <p>No hay horarios disponibles en este momento</p>
            </div>
          )}
        </div>

        {/* Calendario */}
        {selectedNovedad && (
          <div className="citas-section">
            <h2 className="section-title">
              <FaCalendarAlt className="section-icon" />
              Selecciona una Fecha
            </h2>

            <div className="calendar-container">
              {/* Header del calendario */}
              <div className="calendar-header">
                <button
                  className="calendar-nav-btn"
                  onClick={() =>
                    setCurrentMonth(currentMonth.clone().subtract(1, "month"))
                  }
                >
                  ←
                </button>
                <h3 className="calendar-month">
                  {currentMonth.format("MMMM YYYY")}
                </h3>
                <button
                  className="calendar-nav-btn"
                  onClick={() =>
                    setCurrentMonth(currentMonth.clone().add(1, "month"))
                  }
                >
                  →
                </button>
              </div>

              {/* Días de la semana */}
              <div className="calendar-weekdays">
                {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(
                  (day) => (
                    <div key={day} className="weekday">
                      {day}
                    </div>
                  )
                )}
              </div>

              {/* Grid del calendario */}
              <div className="calendar-grid">
                {calendarDays.map((day, index) => {
                  const isAvailable = isDayAvailable(day);
                  const isSelected =
                    selectedDate && day.isSame(selectedDate, "day");
                  const isToday = day.isSame(moment(), "day");
                  const isCurrentMonth = day.isSame(currentMonth, "month");

                  return (
                    <div
                      key={index}
                      className={`calendar-day ${
                        !isCurrentMonth ? "other-month" : ""
                      } ${isToday ? "today" : ""} ${
                        isAvailable ? "available" : "unavailable"
                      } ${isSelected ? "selected" : ""}`}
                      onClick={() => isAvailable && handleDateSelect(day)}
                    >
                      <span className="day-number">{day.format("D")}</span>
                      {isAvailable && <FaCheck className="available-icon" />}
                      {!isAvailable && <FaTimes className="unavailable-icon" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Selección de Hora */}
        {selectedDate && availableTimes.length > 0 && (
          <div className="citas-section">
            <h2 className="section-title">
              <FaClock className="section-icon" />
              Selecciona una Hora
            </h2>

            <div className="times-grid">
              {availableTimes.map((time) => (
                <button
                  key={time}
                  className={`time-slot ${
                    selectedTime === time ? "selected" : ""
                  }`}
                  onClick={() => handleTimeSelect(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selección de Empleado (Opcional) */}
        {empleados.length > 0 && (
          <div className="citas-section">
            <h2 className="section-title">
              <FaUser className="section-icon" />
              Empleado (Opcional)
            </h2>

            <div className="empleados-grid">
              <div
                className={`empleado-card ${
                  !selectedEmpleado ? "selected" : ""
                }`}
                onClick={() => setSelectedEmpleado(null)}
              >
                <FaUser className="empleado-icon" />
                <h3>Asignación Automática</h3>
                <p>El sistema asignará un empleado disponible</p>
              </div>

              {empleados.map((empleado) => (
                <div
                  key={empleado.idUsuario}
                  className={`empleado-card ${
                    selectedEmpleado?.idUsuario === empleado.idUsuario
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => handleEmpleadoSelect(empleado)}
                >
                  <FaUser className="empleado-icon" />
                  <h3>
                    {empleado.nombre} {empleado.apellido}
                  </h3>
                  <p>{empleado.correo}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selección de Servicios */}
        <div className="citas-section">
          <h2 className="section-title">
            <FaGem className="section-icon" />
            Selecciona tus Servicios
          </h2>

          {services.length > 0 ? (
            <div className="services-grid">
              {services.map((service) => (
                <div
                  key={service.idServicio}
                  className={`service-card ${
                    selectedServices.some(
                      (s) => s.idServicio === service.idServicio
                    )
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => toggleService(service)}
                >
                  {service.imagen && (
                    <img
                      src={service.imagen}
                      alt={service.nombre}
                      className="service-image"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  )}
                  <div className="service-content">
                    <div className="service-header">
                      <h3>{service.nombre}</h3>
                      <span className="service-price">
                        {formatPrice(service.precio)}
                      </span>
                    </div>
                    {service.descripcion && (
                      <p className="service-description">
                        {service.descripcion}
                      </p>
                    )}
                  </div>
                  {selectedServices.some(
                    (s) => s.idServicio === service.idServicio
                  ) && <FaCheck className="selected-icon" />}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-services">
              <FaInfoCircle className="info-icon" />
              <p>No hay servicios disponibles en este momento</p>
            </div>
          )}
        </div>

        {/* Resumen y Total */}
        {selectedServices.length > 0 && (
          <div className="citas-section total-section">
            <h2 className="section-title">
              <FaStar className="section-icon" />
              Resumen de tu Cita
            </h2>

            <div className="cita-summary">
              {selectedDate && (
                <div className="summary-item">
                  <span>Fecha:</span>
                  <span>{selectedDate.format("dddd, D [de] MMMM, YYYY")}</span>
                </div>
              )}

              {selectedTime && (
                <div className="summary-item">
                  <span>Hora:</span>
                  <span>{selectedTime}</span>
                </div>
              )}

              {selectedEmpleado && (
                <div className="summary-item">
                  <span>Empleado:</span>
                  <span>
                    {selectedEmpleado.nombre} {selectedEmpleado.apellido}
                  </span>
                </div>
              )}

              <div className="summary-item">
                <span>Servicios:</span>
                <div className="services-list">
                  {selectedServices.map((service) => (
                    <div key={service.idServicio} className="service-item">
                      <span>{service.nombre}</span>
                      <span>{formatPrice(service.precio)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="summary-item total">
                <span>Total:</span>
                <span>{formatPrice(calculateTotal())}</span>
              </div>
            </div>

            {/* Mensajes de autenticación */}
            {!isAuthenticated && (
              <div className="auth-notice">
                <FaUser className="auth-icon" />
                <span>Inicia sesión para continuar con tu agendamiento</span>
              </div>
            )}

            {isAuthenticated && user?.rol?.nombre !== "Cliente" && (
              <div className="auth-notice error">
                <FaInfoCircle className="auth-icon" />
                <span>Solo los clientes pueden agendar citas</span>
              </div>
            )}

            {isAuthenticated && user?.rol?.nombre === "Cliente" && (
              <div className="auth-notice success">
                <FaUser className="auth-icon" />
                <span>
                  ¡Hola {user.nombre}! Tu cita está lista para agendar
                </span>
              </div>
            )}

            {/* Botón de agendar */}
            <button
              className="agendar-btn"
              onClick={handleAgendarCita}
              disabled={
                isProcessingCita ||
                selectedServices.length === 0 ||
                !selectedDate ||
                !selectedTime
              }
            >
              {isProcessingCita ? (
                <>
                  <div className="spinner-small"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <FaHeart />
                  Agendar Cita
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <FooterSpacer />
      <Footer />
    </div>
  );
}

export default PublicCitasPage;
