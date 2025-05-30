// src/features/proveedores/services/proveedoresService.js

const INITIAL_PROVEEDORES = [
    { id: 1, nombre: "Proveedor Ejemplo Ana", tipoDocumento: "Natural", tipoDocumentoNatural: "CC", numeroDocumento: "123456789", telefono: "3001234567", email: "ana@example.com", direccion: "Calle Falsa 123", estado: "Activo", personaEncargadaNombre: "Laura Paz", personaEncargadaTelefono: "3001112233", personaEncargadaEmail: "laura.paz@example.com" },
    { id: 2, nombreEmpresa: "Constructora XYZ S.A.S", tipoDocumento: "Jurídico", nit: "900123456-7", telefono: "3109876543", email: "contacto@constructoraxyz.com", direccion: "Carrera Inventada # 45-67", estado: "Inactivo", personaEncargadaNombre: "Carlos Gerente", personaEncargadaTelefono: "3101112233", personaEncargadaEmail: "carlos.gerente@constructoraxyz.com" },
  ];
  const PROVEEDORES_STORAGE_KEY = 'proveedores_steticsoft';
  
  export const fetchProveedores = () => {
    const stored = localStorage.getItem(PROVEEDORES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : INITIAL_PROVEEDORES.map(p => ({...p, id: p.id || Date.now() + Math.random()})); // Ensure IDs
  };
  
  const persistProveedores = (proveedores) => {
    localStorage.setItem(PROVEEDORES_STORAGE_KEY, JSON.stringify(proveedores));
  };
  
  const generateId = (proveedor) => {
      return proveedor.tipoDocumento === "Natural"
        ? `${proveedor.tipoDocumentoNatural}-${proveedor.numeroDocumento}`
        : proveedor.nit;
  };
  
  export const saveProveedor = (proveedorData, existingProveedores, currentEditingProveedorId = null) => {
    // Validaciones
    if (proveedorData.tipoDocumento === "Natural") {
      if (!proveedorData.nombre?.trim()) throw new Error("El nombre (Natural) es obligatorio.");
      if (!proveedorData.tipoDocumentoNatural) throw new Error("El tipo de documento (Natural) es obligatorio.");
      if (!proveedorData.numeroDocumento?.trim()) throw new Error("El número de documento (Natural) es obligatorio.");
    } else if (proveedorData.tipoDocumento === "Jurídico") {
      if (!proveedorData.nombreEmpresa?.trim()) throw new Error("El nombre de la empresa es obligatorio.");
      if (!proveedorData.nit?.trim()) throw new Error("El NIT es obligatorio.");
    }
    if (!proveedorData.telefono?.trim()) throw new Error("El teléfono principal es obligatorio.");
    if (!proveedorData.email?.trim() || !/\S+@\S+\.\S+/.test(proveedorData.email)) throw new Error("El email principal es inválido o vacío.");
    if (!proveedorData.direccion?.trim()) throw new Error("La dirección es obligatoria.");
    if (!proveedorData.personaEncargadaNombre?.trim()) throw new Error("El nombre de la persona encargada es obligatorio.");
    if (!proveedorData.personaEncargadaTelefono?.trim()) throw new Error("El teléfono de la persona encargada es obligatorio.");
    if (proveedorData.personaEncargadaEmail?.trim() && !/\S+@\S+\.\S+/.test(proveedorData.personaEncargadaEmail)) {
      throw new Error("El email de la persona encargada es inválido.");
    }
  
    const isCreating = !currentEditingProveedorId;
    const newIdKey = proveedorData.tipoDocumento === "Natural"
      ? `${proveedorData.tipoDocumentoNatural}-${proveedorData.numeroDocumento}`
      : proveedorData.nit;
  
    const idExists = existingProveedores.some(p => {
      const existingIdKey = p.tipoDocumento === "Natural" ? `${p.tipoDocumentoNatural}-${p.numeroDocumento}` : p.nit;
      return existingIdKey === newIdKey && p.id !== currentEditingProveedorId;
    });
  
    if (idExists) {
      throw new Error("Ya existe un proveedor con ese tipo y número de documento/NIT.");
    }
  
    let updatedProveedores;
    if (isCreating) {
      const newProveedor = { ...proveedorData, id: Date.now(), estado: "Activo" }; // Nuevos activos por defecto
      updatedProveedores = [...existingProveedores, newProveedor];
    } else {
      updatedProveedores = existingProveedores.map(p =>
        p.id === currentEditingProveedorId ? { ...p, ...proveedorData } : p
      );
    }
    persistProveedores(updatedProveedores);
    return updatedProveedores;
  };
  
  export const deleteProveedorById = (proveedorId, existingProveedores) => {
    const updatedProveedores = existingProveedores.filter(p => p.id !== proveedorId);
    persistProveedores(updatedProveedores);
    return updatedProveedores;
  };
  
  export const toggleProveedorEstado = (proveedorId, existingProveedores) => {
    const updatedProveedores = existingProveedores.map(p =>
      p.id === proveedorId ? { ...p, estado: p.estado === "Activo" ? "Inactivo" : "Activo" } : p
    );
    persistProveedores(updatedProveedores);
    return updatedProveedores;
  };