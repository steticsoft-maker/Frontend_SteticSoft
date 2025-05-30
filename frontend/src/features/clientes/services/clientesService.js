// src/features/clientes/services/clientesService.js

const INITIAL_CLIENTES = [
    { id: 1, nombre: "Juan", apellido: "Pérez", email: "juan.perez@gmail.com", telefono: "3211234567", direccion: "Calle Principal 123", tipoDocumento: "Cédula", numeroDocumento: "123456789", ciudad: "Bogotá", fechaNacimiento: "1990-01-01", password: "12345", estado: true },
    { id: 2, nombre: "María", apellido: "Gómez", email: "maria.gomez@gmail.com", telefono: "3129876543", direccion: "Carrera Secundaria 456", tipoDocumento: "Pasaporte", numeroDocumento: "987654321", ciudad: "Medellín", fechaNacimiento: "1985-05-20", password: "54321", estado: true },
  ];
  const CLIENTES_STORAGE_KEY = 'clientes_steticsoft';
  
  export const fetchClientes = () => {
    const storedClientes = localStorage.getItem(CLIENTES_STORAGE_KEY);
    return storedClientes ? JSON.parse(storedClientes) : INITIAL_CLIENTES;
  };
  
  const persistClientes = (clientes) => {
    localStorage.setItem(CLIENTES_STORAGE_KEY, JSON.stringify(clientes));
  };
  
  export const saveCliente = (clienteData, existingClientes, currentEditingClienteId = null) => {
    // Validaciones básicas
    if (!clienteData.nombre || !clienteData.apellido || !clienteData.email || !clienteData.telefono || !clienteData.tipoDocumento || !clienteData.numeroDocumento || !clienteData.fechaNacimiento /*|| !clienteData.password (la contraseña puede ser opcional en edición o manejarse diferente)*/) {
      throw new Error("Por favor, completa todos los campos obligatorios marcados con *.");
    }
    if (!/\S+@\S+\.\S+/.test(clienteData.email)) {
      throw new Error("El formato del correo electrónico no es válido.");
    }
  
    const isCreating = !currentEditingClienteId;
  
    const numeroDocumentoExists = existingClientes.some(
      (c) => c.numeroDocumento === clienteData.numeroDocumento && c.id !== currentEditingClienteId
    );
    if (numeroDocumentoExists) {
      throw new Error("Ya existe un cliente con este número de documento.");
    }
    const emailExists = existingClientes.some(
      (c) => c.email === clienteData.email && c.id !== currentEditingClienteId
    );
    if (emailExists) {
      throw new Error("Ya existe un cliente con este correo electrónico.");
    }
  
  
    let updatedClientes;
    if (isCreating) {
      const newCliente = { ...clienteData, id: Date.now(), estado: true }; // Nuevos clientes activos por defecto
      updatedClientes = [...existingClientes, newCliente];
    } else { // Editando
      updatedClientes = existingClientes.map((c) =>
        c.id === currentEditingClienteId ? { ...c, ...clienteData } : c // Mantener estado original al editar si no se cambia explícitamente
      );
    }
    persistClientes(updatedClientes);
    return updatedClientes;
  };
  
  export const deleteClienteById = (clienteId, existingClientes) => {
    const updatedClientes = existingClientes.filter(c => c.id !== clienteId);
    persistClientes(updatedClientes);
    return updatedClientes;
  };
  
  export const toggleClienteEstado = (clienteId, existingClientes) => {
    const updatedClientes = existingClientes.map(c =>
      c.id === clienteId ? { ...c, estado: !c.estado } : c
    );
    persistClientes(updatedClientes);
    return updatedClientes;
  };