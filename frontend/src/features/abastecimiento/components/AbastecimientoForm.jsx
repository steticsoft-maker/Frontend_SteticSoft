import React from 'react';
import '../../../shared/styles/admin-layout.css';
import '../css/Abastecimiento.css';

const AbastecimientoForm = ({
    formData,
    formErrors,
    onEmpleadoSelect,
    onProductoSelect,
    onRemoveProducto,
    onCantidadChange,
    onEstadoChange,
    isEditing = false
}) => {
    const fechaActual = new Date().toLocaleDateString('es-CO', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    const formatEmpleadoDisplay = (empleado) => {
        if (!empleado) return 'Seleccionar un empleado';
        // Muestra: "Rol (correo@ejemplo.com)"
        return `${empleado.rol?.nombre || 'Empleado'} (${empleado.correo})`;
    };

    return (
        <form className="admin-form-section" noValidate>
            <div className="admin-form-section-title">Información del Abastecimiento</div>
            
            <div className="admin-form-row-2">
                <div className="admin-form-group">
                    <label className="admin-form-label">Fecha de Ingreso:</label>
                    <input
                        type="text"
                        className="admin-form-input"
                        value={isEditing ? new Date(formData.fechaIngreso).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }) : fechaActual}
                        disabled
                    />
                </div>

                <div className="admin-form-group">
                    <label htmlFor="empleado" className="admin-form-label">
                        Empleado Asignado: <span className="required-asterisk">*</span>
                    </label>
                    <button
                        type="button"
                        className="admin-form-button secondary"
                        onClick={onEmpleadoSelect}
                    >
                        {formatEmpleadoDisplay(formData.empleado)}
                    </button>
                    {formErrors.empleado && <p className="admin-form-error">{formErrors.empleado}</p>}
                </div>
            </div>

            {isEditing ? (
                // --- VISTA DE EDICIÓN ---
                <>
                    <div className="admin-form-row-2">
                        <div className="admin-form-group">
                            <label className="admin-form-label">Producto:</label>
                            <input
                                type="text"
                                className="admin-form-input"
                                value={formData.producto?.nombre || ''}
                                disabled
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">
                                Cantidad: <span className="required-asterisk">*</span>
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={formData.cantidad || ''}
                                onChange={(e) => onCantidadChange(null, e.target.value)}
                                className="admin-form-input"
                            />
                            {formErrors.cantidad && <p className="admin-form-error">{formErrors.cantidad}</p>}
                        </div>
                    </div>
                    <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <label htmlFor="estado" className="admin-form-label" style={{ marginBottom: 0 }}>Estado:</label>
                        <label className="switch">
                            <input
                                type="checkbox" id="estado" name="estado"
                                checked={formData.estado ?? true} onChange={onEstadoChange}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                </>
            ) : (
                // --- VISTA DE CREACIÓN ---
                <>
                    <div className="admin-form-group">
                        <label className="admin-form-label">
                            Productos: <span className="required-asterisk">*</span>
                        </label>
                        <button
                            type="button"
                            className="admin-form-button secondary"
                            onClick={onProductoSelect}
                        >
                            Añadir Productos
                        </button>
                        {formErrors.productos && <p className="admin-form-error">{formErrors.productos}</p>}
                    </div>

                    {formData.productos.length > 0 && (
                        <div className="selected-products-list">
                            <div className="admin-form-section-title">Productos Seleccionados</div>
                            {formData.productos.map((p) => (
                                <div key={p.idProducto} className="selected-product-item">
                                    <span>{p.nombre}</span>
                                    <div className="product-quantity-control">
                                        <input
                                            type="number"
                                            min="1"
                                            value={p.cantidad}
                                            onChange={(e) => onCantidadChange(p.idProducto, e.target.value)}
                                            className="admin-form-input quantity-input"
                                            placeholder="Cant."
                                        />
                                        <button type="button" onClick={() => onRemoveProducto(p.idProducto)} className="admin-form-button">&times;</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </form>
    );
};

export default AbastecimientoForm;