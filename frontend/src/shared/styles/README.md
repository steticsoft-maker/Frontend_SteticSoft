# Estilos Unificados para CRUDs de Administración

## Descripción

Este sistema de estilos unificados proporciona una estructura consistente y centrada para todos los CRUDs del área de administración, basándose en los módulos de Roles y Usuarios como referencia.

## Archivos Principales

### 1. `admin-crud-unified.css`

Contiene todos los estilos unificados para CRUDs de administración:

- Contenedores principales centrados
- Barras de acciones estandarizadas
- Tablas con diseño consistente
- Modales unificados
- Formularios estandarizados
- Estilos responsive

### 2. `admin-migration-guide.css`

Guía de migración que mapea las clases específicas de cada módulo a las clases unificadas.

### 3. `admin-layout.css`

Estilos base para el layout de administración (ya existente).

## Estructura de Clases Unificadas

### Contenedores Principales

```css
.admin-crud-container          /* Contenedor principal de la página */
/* Contenedor principal de la página */
.admin-crud-content            /* Contenido principal centrado */
.admin-crud-table-container; /* Contenedor de la tabla */
```

### Barra de Acciones

```css
.admin-crud-actions-bar        /* Barra superior con filtros y botón agregar */
/* Barra superior con filtros y botón agregar */
.admin-crud-filters            /* Contenedor de filtros */
.admin-crud-search-bar         /* Contenedor de búsqueda */
.admin-crud-search-input       /* Input de búsqueda */
.admin-crud-filter-group       /* Grupo de filtro */
.admin-crud-filter-select      /* Select de filtro */
.admin-crud-add-button; /* Botón agregar */
```

### Tabla

```css
.admin-crud-table              /* Tabla principal */
/* Tabla principal */
.admin-crud-table-actions      /* Contenedor de acciones en tabla */
.admin-crud-action-button      /* Botones de acción */
.admin-crud-switch; /* Switch de estado */
```

### Modales

```css
.admin-crud-modal-overlay      /* Overlay del modal */
/* Overlay del modal */
.admin-crud-modal-content      /* Contenido del modal */
.admin-crud-modal-header       /* Encabezado del modal */
.admin-crud-modal-title        /* Título del modal */
.admin-crud-modal-close-button /* Botón cerrar */
.admin-crud-modal-body; /* Cuerpo del modal */
```

### Formularios

```css
.admin-crud-form-grid          /* Grid del formulario */
/* Grid del formulario */
.admin-crud-form-group         /* Grupo de campo */
.admin-crud-form-group.full-width /* Campo de ancho completo */
.admin-crud-form-label         /* Label del campo */
.admin-crud-form-input         /* Input de texto */
.admin-crud-form-select        /* Select */
.admin-crud-form-textarea      /* Textarea */
.admin-crud-form-actions       /* Acciones del formulario */
.admin-crud-form-button-save   /* Botón guardar */
.admin-crud-form-button-cancel; /* Botón cancelar */
```

## Cómo Migrar un Módulo

### Paso 1: Importar los Estilos

```css
@import "@/shared/styles/_variables.css";
@import "@/shared/styles/admin-crud-unified.css";
@import "@/shared/styles/admin-migration-guide.css";
```

### Paso 2: Actualizar el JSX

Reemplazar las clases específicas con las clases unificadas:

**ANTES:**

```jsx
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
```

**DESPUÉS:**

```jsx
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
```

### Paso 3: Migración Gradual

El archivo `admin-migration-guide.css` proporciona clases de compatibilidad que permiten una migración gradual sin romper la funcionalidad existente.

## Características Principales

### 1. Centrado Consistente

- Todos los CRUDs están centrados en la pantalla
- Ancho máximo de 1200px para el contenido
- Espaciado uniforme

### 2. Diseño Responsive

- Adaptación automática a diferentes tamaños de pantalla
- Tablas que se convierten en tarjetas en móviles
- Modales adaptativos

### 3. Estilos Unificados

- Colores consistentes usando variables CSS
- Tipografía estandarizada
- Espaciado uniforme
- Efectos de hover y transiciones

### 4. Accesibilidad

- Contraste adecuado
- Navegación por teclado
- Estados de focus visibles

## Módulos Actualizados

Los siguientes módulos ya han sido actualizados para usar los estilos unificados:

- ✅ **Usuarios** - `frontend/src/features/usuarios/css/Usuarios.css`
- ✅ **Roles** - `frontend/src/features/roles/css/Rol.css`
- ✅ **Productos Admin** - `frontend/src/features/productosAdmin/css/ProductosAdmin.css`
- ✅ **Categorías Producto** - `frontend/src/features/categoriasProductoAdmin/css/CategoriasProducto.css`
- ✅ **Proveedores** - `frontend/src/features/proveedores/css/Proveedores.css`
- ✅ **Clientes** - `frontend/src/features/clientes/css/Clientes.css`

## Próximos Pasos

1. **Migrar módulos restantes:**

   - Servicios Admin
   - Categorías Servicio
   - Compras
   - Ventas
   - Abastecimiento
   - Citas
   - Novedades

2. **Eliminar clases específicas:**

   - Una vez que todos los módulos estén migrados
   - Eliminar gradualmente las clases específicas de cada módulo

3. **Optimización:**
   - Revisar y optimizar los estilos unificados
   - Añadir nuevas funcionalidades según necesidades

## Beneficios

- **Consistencia:** Todos los CRUDs tienen la misma apariencia y comportamiento
- **Mantenibilidad:** Cambios centralizados en un solo archivo
- **Escalabilidad:** Fácil añadir nuevos módulos con el mismo diseño
- **UX Mejorada:** Experiencia de usuario consistente en toda la aplicación
- **Desarrollo Rápido:** Plantillas listas para usar en nuevos módulos
