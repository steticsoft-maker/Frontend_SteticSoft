// src/features/roles/services/rolesService.js

const MODULOS_PERMISOS = [
    { id: 1, nombre: "Usuarios" }, { id: 2, nombre: "Ventas" },
    { id: 3, nombre: "Productos" }, { id: 4, nombre: "Reportes" },
    { id: 5, nombre: "Clientes" }, { id: 6, nombre: "Proveedores" },
    { id: 7, nombre: "Inventario" }, { id: 8, nombre: "Configuración" },
    { id: 9, nombre: "Dashboard" },
  ];
  
  const INITIAL_ROLES = [
    { id: 1, nombre: "Administrador", descripcion: "Acceso completo.", permisos: MODULOS_PERMISOS.map(m => m.nombre), anulado: false },
    { id: 2, nombre: "Vendedor", descripcion: "Acceso a ventas, clientes, productos.", permisos: ["Ventas", "Clientes", "Productos"], anulado: false },
    { id: 3, nombre: "Consulta", descripcion: "Solo visualización.", permisos: ["Reportes", "Inventario"], anulado: true },
  ];
  
  const ROLES_STORAGE_KEY = 'roles_steticsoft'; // Nueva clave para evitar colisiones
  
  export const getModulosPermisos = () => {
    return MODULOS_PERMISOS;
  };
  
  export const fetchRoles = () => {
    // En el futuro, esto será una llamada API
    const storedRoles = localStorage.getItem(ROLES_STORAGE_KEY);
    return storedRoles ? JSON.parse(storedRoles) : INITIAL_ROLES;
  };
  
  export const saveRole = (roleToSave, existingRoles) => {
    // Lógica de validación de nombre único y manejo de ID
    if (!roleToSave.nombre.trim()) {
      throw new Error("El nombre del rol es obligatorio.");
    }
  
    let updatedRoles;
    if (roleToSave.id) { // Editando
      const nameExists = existingRoles.some(
        r => r.nombre.toLowerCase() === roleToSave.nombre.toLowerCase() && r.id !== roleToSave.id
      );
      if (nameExists) {
        throw new Error("Ya existe otro rol con este nombre.");
      }
      updatedRoles = existingRoles.map(r => (r.id === roleToSave.id ? roleToSave : r));
    } else { // Creando
      const nameExists = existingRoles.some(
        r => r.nombre.toLowerCase() === roleToSave.nombre.toLowerCase()
      );
      if (nameExists) {
        throw new Error("Ya existe un rol con este nombre.");
      }
      const newRole = { ...roleToSave, id: Date.now(), anulado: roleToSave.anulado || false };
      updatedRoles = [...existingRoles, newRole];
    }
    localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(updatedRoles));
    return updatedRoles;
  };
  
  export const deleteRoleById = (roleId, existingRoles) => {
    const roleToDelete = existingRoles.find(r => r.id === roleId);
    if (roleToDelete && roleToDelete.nombre === "Administrador") {
      throw new Error("El rol 'Administrador' no puede ser eliminado.");
    }
    const updatedRoles = existingRoles.filter(r => r.id !== roleId);
    localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(updatedRoles));
    return updatedRoles;
  };
  
  export const toggleRoleStatus = (roleId, existingRoles) => {
      const roleToToggle = existingRoles.find(r => r.id === roleId);
      if (roleToToggle && roleToToggle.nombre === "Administrador") {
          throw new Error("El rol 'Administrador' no puede ser anulado/activado.");
      }
      const updatedRoles = existingRoles.map(r =>
          r.id === roleId ? { ...r, anulado: !r.anulado } : r
      );
      localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(updatedRoles));
      return updatedRoles;
  };