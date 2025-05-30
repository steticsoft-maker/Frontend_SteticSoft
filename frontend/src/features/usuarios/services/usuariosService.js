// src/features/usuarios/services/usuariosService.js

const INITIAL_USUARIOS = [
    { id: 1, nombre: "Administrador", tipoDocumento: "CC", documento: "123456789", email: "Admin@gmail.com", telefono: "3200000000", direccion: "Calle 123", rol: "Administrador", anulado: false }, // Admin no debería estar anulado por defecto
    { id: 2, nombre: "Pepe", tipoDocumento: "CC", documento: "987654321", email: "Pepe@gmail.com", telefono: "3209999999", direccion: "Calle 456", rol: "Empleado", anulado: false },
    { id: 3, nombre: "Maria", tipoDocumento: "CC", documento: "1122334455", email: "maria@gmail.com", telefono: "3101234567", direccion: "Avenida Siempre Viva 742", rol: "Cliente", anulado: false },
    // ... más usuarios si es necesario
  ];
  const USUARIOS_STORAGE_KEY = 'usuarios_steticsoft';
  
  export const fetchUsuarios = () => {
    const storedUsuarios = localStorage.getItem(USUARIOS_STORAGE_KEY);
    return storedUsuarios ? JSON.parse(storedUsuarios) : INITIAL_USUARIOS;
  };
  
  const persistUsuarios = (usuarios) => {
    localStorage.setItem(USUARIOS_STORAGE_KEY, JSON.stringify(usuarios));
  };
  
  export const getAvailableRoles = (allUsuarios, editingUserId = null) => {
    // Obtiene los roles de la tabla Rol de la BD (simulado por ahora)
    // En el futuro, esto vendría del rolesService.js
    const rolesDesdeBD = ["Empleado", "Cliente"]; // Ejemplo, esto debería venir de rolesService.js
    
    const adminExists = allUsuarios.some(u => u.rol === "Administrador" && u.id !== editingUserId);
    
    let available = [...rolesDesdeBD];
    if (!adminExists) {
      available.push("Administrador");
    }
    return available;
  };
  
  
  export const saveUsuario = (usuarioData, existingUsuarios, currentEditingUser = null) => {
    if (!usuarioData.nombre || !usuarioData.tipoDocumento || !usuarioData.documento || !usuarioData.email || !usuarioData.telefono || !usuarioData.direccion || !usuarioData.rol) {
      throw new Error("Por favor, completa todos los campos obligatorios.");
    }
  
    const isCreating = !currentEditingUser;
    const userIdBeingEdited = currentEditingUser ? currentEditingUser.id : null;
  
    const documentoExists = existingUsuarios.some(
      (u) => u.documento === usuarioData.documento && u.id !== userIdBeingEdited
    );
    if (documentoExists) {
      throw new Error("Ya existe un usuario con este número de documento.");
    }
  
    // Lógica para el rol Administrador
    if (usuarioData.rol === "Administrador") {
      const adminAlreadyExists = existingUsuarios.some(u => u.rol === "Administrador" && u.id !== userIdBeingEdited);
      if (isCreating && adminAlreadyExists) {
        throw new Error("No se puede crear otro usuario 'Administrador'.");
      }
      if (!isCreating && currentEditingUser.rol !== "Administrador" && adminAlreadyExists) {
           throw new Error("No se puede asignar el rol 'Administrador', ya existe otro.");
      }
    }
  
  
    let updatedUsuarios;
    if (isCreating) {
      const newUsuario = { ...usuarioData, id: Date.now(), anulado: false };
      updatedUsuarios = [...existingUsuarios, newUsuario];
    } else { // Editando
      updatedUsuarios = existingUsuarios.map((u) =>
        u.id === userIdBeingEdited ? { ...u, ...usuarioData } : u
      );
    }
    persistUsuarios(updatedUsuarios);
    return updatedUsuarios;
  };
  
  export const deleteUsuarioById = (usuarioId, existingUsuarios) => {
    const usuarioToDelete = existingUsuarios.find(u => u.id === usuarioId);
    if (usuarioToDelete && usuarioToDelete.rol === "Administrador") {
      throw new Error("El usuario 'Administrador' no puede ser eliminado.");
    }
    const updatedUsuarios = existingUsuarios.filter(u => u.id !== usuarioId);
    persistUsuarios(updatedUsuarios);
    return updatedUsuarios;
  };
  
  export const toggleUsuarioStatus = (usuarioId, existingUsuarios) => {
    const usuarioToToggle = existingUsuarios.find(u => u.id === usuarioId);
    if (usuarioToToggle && usuarioToToggle.rol === "Administrador") {
      throw new Error("El usuario 'Administrador' no puede ser anulado/activado.");
    }
    const updatedUsuarios = existingUsuarios.map(u =>
      u.id === usuarioId ? { ...u, anulado: !u.anulado } : u
    );
    persistUsuarios(updatedUsuarios);
    return updatedUsuarios;
  };