import apiClient from '../../../shared/services/apiClient';

// Agrupa las "novedades" de la API en "horarios" para el frontend.
const transformarNovedadesAHorarios = (novedades) => {
  if (!Array.isArray(novedades) || novedades.length === 0) {
    return [];
  }
  const agrupadoPorEmpleado = novedades.reduce((acc, novedad) => {
    const { id_empleado, empleado, estado, idNovedad, diaSemana, horaInicio, horaFin } = novedad;
    if (!acc[id_empleado]) {
      acc[id_empleado] = {
        id: id_empleado,
        id_empleado: id_empleado,
        empleado: empleado,
        estado: estado,
        dias: [],
      };
    }
    acc[id_empleado].dias.push({
      idNovedad: idNovedad,
      dia: diaSemana,
      horaInicio: horaInicio,
      horaFin: horaFin,
    });
    return acc;
  }, {});
  return Object.values(agrupadoPorEmpleado);
};

// Mapa para convertir el nombre del día a número antes de enviar a la API.
const diasMapa = {
  "Domingo": 0, "Lunes": 1, "Martes": 2, "Miércoles": 3, "Jueves": 4, "Viernes": 5, "Sábado": 6,
};

export const getEmpleadosParaHorarios = async () => {
  const response = await apiClient.get('/empleados', { params: { estado: true } });
  return response.data.data;
};

export const fetchHorarios = async () => {
  const response = await apiClient.get('/novedades');
  return transformarNovedadesAHorarios(response.data.data);
};

export const saveHorario = async (horarioData) => {
  const promesasDeCreacion = horarioData.dias.map(dia => {
    // Construye el objeto con los nombres y tipos de datos que el backend espera.
    const nuevaNovedad = {
      empleadoId: parseInt(horarioData.id_empleado, 10),
      diaSemana: diasMapa[dia.diaSemana],
      horaInicio: dia.horaInicio,
      horaFin: dia.horaFin,
    };
    return apiClient.post('/novedades', nuevaNovedad);
  });
  return Promise.all(promesasDeCreacion);
};

export const updateHorario = async (idEmpleado, nuevosDatos) => {
  const response = await apiClient.get('/novedades', { params: { id_empleado: idEmpleado } });
  const novedadesExistentes = response.data.data;
  
  const promesasDeBorrado = novedadesExistentes.map(novedad =>
    apiClient.delete(`/novedades/${novedad.idNovedad}`)
  );
  await Promise.all(promesasDeBorrado);

  const promesasDeCreacion = nuevosDatos.dias.map(dia => {
    const nuevaNovedad = {
      empleadoId: parseInt(idEmpleado, 10),
      diaSemana: diasMapa[dia.diaSemana],
      horaInicio: dia.horaInicio,
      horaFin: dia.horaFin,
    };
    return apiClient.post('/novedades', nuevaNovedad);
  });
  return Promise.all(promesasDeCreacion);
};

export const deleteHorario = async (idEmpleado) => {
  const response = await apiClient.get('/novedades', { params: { id_empleado: idEmpleado } });
  const novedadesAEliminar = response.data.data;
  if (novedadesAEliminar.length === 0) return;
  const promesasDeBorrado = novedadesAEliminar.map(novedad =>
    apiClient.delete(`/novedades/${novedad.idNovedad}`)
  );
  return Promise.all(promesasDeBorrado);
}

export const toggleHorarioEstado = async (idEmpleado, nuevoEstado) => {
  const response = await apiClient.get('/novedades', { params: { id_empleado: idEmpleado } });
  const novedadesACambiar = response.data.data;
  if (novedadesACambiar.length === 0) return;
  const promesasDeCambio = novedadesACambiar.map(novedad =>
    apiClient.patch(`/novedades/${novedad.idNovedad}/estado`, { estado: nuevoEstado })
  );
  return Promise.all(promesasDeCambio);
}