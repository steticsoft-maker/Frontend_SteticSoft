// ========================================================
// ============= EXPORTACIÓN DE ESTILOS UNIFICADOS =============
// ========================================================

// Estilos base y variables
export { default as variables } from "./_variables.css";
export { default as global } from "./global.css";

// Estilos de administración unificados
export { default as adminLayout } from "./admin-layout.css";
export { default as adminCrudUnified } from "./admin-crud-unified.css";
export { default as adminMigrationGuide } from "./admin-migration-guide.css";

// Estilos comunes (mantener para compatibilidad)
export { default as crudCommon } from "./crud-common.css";
export { default as tableCommon } from "./table-common.css";

// ========================================================
// ============= INSTRUCCIONES DE USO =============
// ========================================================

/*
  PARA USAR LOS ESTILOS UNIFICADOS EN UN MÓDULO:

  1. Importar los estilos necesarios:
     import '@/shared/styles/admin-crud-unified.css';
     import '@/shared/styles/admin-migration-guide.css';

  2. Reemplazar las clases específicas del módulo con las clases unificadas:
     - .usuarios-container → .admin-crud-container
     - .usuarios-content → .admin-crud-content
     - .usuarios-accionesTop → .admin-crud-actions-bar
     - .usuarios-barraBusqueda → .admin-crud-search-input
     - .usuarios-botonAgregar → .admin-crud-add-button
     - .usuarios-table → .admin-crud-table
     - etc.

  3. Usar las clases de migración temporalmente para mantener compatibilidad

  4. Eliminar gradualmente las clases específicas del módulo

  EJEMPLO DE MIGRACIÓN:
  
  ANTES:
  <div className="usuarios-container">
    <div className="usuarios-content">
      <h1>Gestión de Usuarios</h1>
      <div className="usuarios-accionesTop">
        <input className="usuarios-barraBusqueda" />
        <button className="usuarios-botonAgregar">Agregar</button>
      </div>
      <table className="usuarios-table">...</table>
    </div>
  </div>

  DESPUÉS:
  <div className="admin-crud-container">
    <div className="admin-crud-content">
      <h1>Gestión de Usuarios</h1>
      <div className="admin-crud-actions-bar">
        <div className="admin-crud-filters">
          <div className="admin-crud-search-bar">
            <input className="admin-crud-search-input" />
          </div>
          <div className="admin-crud-filter-group">
            <select className="admin-crud-filter-select">...</select>
          </div>
        </div>
        <button className="admin-crud-add-button">Agregar</button>
      </div>
      <div className="admin-crud-table-container">
        <table className="admin-crud-table">...</table>
      </div>
    </div>
  </div>
*/
