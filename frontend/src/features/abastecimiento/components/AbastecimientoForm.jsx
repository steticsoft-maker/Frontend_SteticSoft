import React from 'react';
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
        <form className="abastecimiento-form-grid" noValidate>
            <div className="form-group-abastecimiento">
                <label className="form-label-abastecimiento">Fecha de Ingreso:</label>
                <input
                    type="text"
                    className="form-input-abastecimiento"
                    value={isEditing ? new Date(formData.fechaIngreso).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }) : fechaActual}
                    disabled
                />
            </div>

            <div className="form-group-abastecimiento">
                <label htmlFor="empleado" className="form-label-abastecimiento">
                    Empleado Asignado: <span className="required-asterisk">*</span>
                </label>
                <button
                    type="button"
                    className="form-button-select-abastecimiento"
                    onClick={onEmpleadoSelect}
                >
                    {/* CAMBIO CLAVE: Llama a la función de formato */}
                    {formatEmpleadoDisplay(formData.empleado)}
                </button>
                {formErrors.empleado && <p className="error-abastecimiento">{formErrors.empleado}</p>}
            </div>

            {isEditing ? (
                // --- VISTA DE EDICIÓN ---
                <>
                    <div className="form-group-abastecimiento">
                        <label className="form-label-abastecimiento">Producto:</label>
                        <input
                            type="text"
                            className="form-input-abastecimiento"
                            value={formData.producto?.nombre || ''}
                            disabled
                        />
                    </div>
                    <div className="form-group-abastecimiento">
                        <label className="form-label-abastecimiento">
                            Cantidad: <span className="required-asterisk">*</span>
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={formData.cantidad || ''}
                            onChange={(e) => onCantidadChange(null, e.target.value)}
                            className="form-input-abastecimiento"
                        />
                         {formErrors.cantidad && <p className="error-abastecimiento">{formErrors.cantidad}</p>}
                    </div>
                     <div className="form-group-abastecimiento" style={{ flexDirection: 'row', alignItems: 'center' }}>
                         <label htmlFor="estado" className="form-label-abastecimiento" style={{ marginBottom: 0, marginRight: '10px' }}>Estado:</label>
                         <label className="switch">
                           <input
                             type="checkbox" id="estado" name="estado"
                             checked={formData.estado ?? true} onChange={onEstadoChange}
                           />
                           <span className="slider round"></span>
                         </label>
                     </div>
                </>
            ) : (
                // --- VISTA DE CREACIÓN ---
                <>
                    <div className="form-group-abastecimiento">
                        <label className="form-label-abastecimiento">
                            Productos: <span className="required-asterisk">*</span>
                        </label>
                        <button
                            type="button"
                            className="form-button-select-abastecimiento"
                            onClick={onProductoSelect}
                        >
                            Añadir Productos
                        </button>
                        {formErrors.productos && <p className="error-abastecimiento">{formErrors.productos}</p>}
                    </div>

                    {formData.productos.length > 0 && (
                        <div className="selected-products-list">
                            {formData.productos.map((p) => (
                                <div key={p.idProducto} className="selected-product-item">
                                    <span>{p.nombre}</span>
                                    <div className="product-quantity-control">
                                        <input
                                            type="number"
                                            min="1"
                                            value={p.cantidad}
                                            onChange={(e) => onCantidadChange(p.idProducto, e.target.value)}
                                            className="form-input-abastecimiento quantity-input"
                                            placeholder="Cant."
                                        />
                                        <button type="button" onClick={() => onRemoveProducto(p.idProducto)} className="remove-product-btn">&times;</button>
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