// src/features/ventas/components/VentaForm.jsx
import React, { useState, useEffect } from 'react'; // ¡Importante! Añadimos useState y useEffect
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

// VentaItemRow se puede definir aquí mismo o en archivo separado si crece mucho
const VentaItemRow = ({ item, index, onActualizarCantidad, onEliminarItem }) => (
    <tr>
        <td>{item.nombre}</td>
        <td>
            <input
                className="venta-item-cantidad-input" // Clase para estilos
                type="number"
                min="1"
                value={item.cantidad}
                onChange={(e) => {
                    const newQuantity = parseInt(e.target.value, 10);
                    if (newQuantity >= 1) { // Asegurar que la cantidad sea al menos 1
                        onActualizarCantidad(index, newQuantity);
                    } else if (e.target.value === "") { // Permitir borrar para escribir nuevo número
                        onActualizarCantidad(index, ""); // O podrías manejarlo como 0 o 1
                    }
                }}
            />
        </td>
        <td>${item.precio ? item.precio.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : '0'}</td>
        <td>${(item.precio * item.cantidad).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
        <td>
            <button type="button" onClick={() => onEliminarItem(index)} className="boton-eliminar-item-venta" title="Eliminar Ítem">
                <FontAwesomeIcon icon={faTrash} />
            </button>
        </td>
    </tr>
);

const VentaForm = ({
    modoCliente, setModoCliente,
    datosCliente, onDatosClienteChange,
    onAbrirModalSeleccionCliente,
    itemsTabla,
    onAbrirModalCatalogoProductos,
    onAbrirModalCatalogoServicios,
    onActualizarCantidadItem,
    onEliminarItem,
    subtotal, iva, total,
    errorDatosCliente, errorItemsTabla
}) => {

    // 1. Estados para controlar la habilitación de los campos
    const [documentoHabilitado, setDocumentoHabilitado] = useState(false);
    const [telefonoHabilitado, setTelefonoHabilitado] = useState(false);
    const [direccionHabilitada, setDireccionHabilitada] = useState(false);

    // 2. useEffect para actualizar el estado de los campos
    useEffect(() => {
        if (modoCliente === "nuevo") {
            // Habilita el campo 'documento' si el campo 'nombre' no está vacío
            setDocumentoHabilitado(!!datosCliente.nombre.trim());
            // Habilita 'telefono' si 'documento' no está vacío
            setTelefonoHabilitado(!!datosCliente.documento.trim());
            // Habilita 'direccion' si 'telefono' no está vacío
            setDireccionHabilitada(!!datosCliente.telefono.trim());
        } else {
            // Si el modo no es 'nuevo', deshabilita todos los campos
            setDocumentoHabilitado(false);
            setTelefonoHabilitado(false);
            setDireccionHabilitada(false);
        }
    }, [modoCliente, datosCliente]); // Dependencias del efecto


    return (
        <div className="proceso-venta-form-container"> {/* Clase principal para el formulario */}
            <div className="acciones"> {/* Clases del CSS original de ProcesoVentas */}
                <button
                    type="button"
                    className={`directa-button ${modoCliente === "existente" ? "activo" : ""}`}
                    onClick={() => {
                        setModoCliente("existente");
                        onAbrirModalSeleccionCliente();
                    }}
                >
                    Cliente Existente
                </button>
                <button
                    type="button"
                    className={`indirecta-button ${modoCliente === "nuevo" ? "activo" : ""}`}
                    onClick={() => setModoCliente("nuevo")}
                >
                    Cliente Nuevo
                </button>
            </div>
            {errorDatosCliente && <p className="error-message">{errorDatosCliente}</p>}

            {/* Sección de Información del Cliente */}
            <div className={`datos-cliente ${modoCliente === "nuevo" ? "" : "bloqueado"}`}>
                <h3>Información del Cliente {modoCliente === "existente" && datosCliente.nombre ? `(${datosCliente.nombre})` : ''}</h3>
                <div className="formulario-cliente">
                    <div className="campo-cliente">
                        <label htmlFor="nombreClienteProceso">Nombre: <span className="required-asterisk">*</span></label>
                        <input
                            id="nombreClienteProceso"
                            type="text"
                            name="nombre"
                            placeholder="Nombre y Apellido"
                            value={datosCliente.nombre}
                            onChange={onDatosClienteChange}
                            disabled={modoCliente !== "nuevo"} // Solo editable si es un cliente nuevo
                            required={modoCliente === "nuevo"}
                        />
                    </div>
                    <div className="campo-cliente">
                        <label htmlFor="documentoClienteProceso">Documento: <span className="required-asterisk">*</span></label>
                        <input
                            id="documentoClienteProceso"
                            type="text"
                            name="documento"
                            placeholder="Número de Documento"
                            value={datosCliente.documento}
                            onChange={onDatosClienteChange}
                            disabled={!documentoHabilitado || modoCliente !== "nuevo"}
                            required={modoCliente === "nuevo"}
                        />
                    </div>
                    <div className="campo-cliente">
                        <label htmlFor="telefonoClienteProceso">Teléfono: <span className="required-asterisk">*</span></label>
                        <input
                            id="telefonoClienteProceso"
                            type="text"
                            name="telefono"
                            placeholder="Teléfono"
                            value={datosCliente.telefono}
                            onChange={onDatosClienteChange}
                            disabled={!telefonoHabilitado || modoCliente !== "nuevo"}
                            required={modoCliente === "nuevo"}
                        />
                    </div>
                    <div className="campo-cliente">
                        <label htmlFor="direccionClienteProceso">Dirección: <span className="required-asterisk">*</span></label>
                        <input
                            id="direccionClienteProceso"
                            type="text"
                            name="direccion"
                            placeholder="Dirección"
                            value={datosCliente.direccion}
                            onChange={onDatosClienteChange}
                            disabled={!direccionHabilitada || modoCliente !== "nuevo"}
                            required={modoCliente === "nuevo"}
                        />
                    </div>
                </div>
            </div>

            {/* Botones para agregar Productos y Servicios */}
            <div className="botones-agregar-catalogos">
                <button type="button" className="catalogo-button" onClick={onAbrirModalCatalogoProductos}>
                    Agregar Producto
                </button>
                <button type="button" className="catalogo-button" onClick={onAbrirModalCatalogoServicios}>
                    Agregar Servicio
                </button>
            </div>
            
            {/* Tabla de Ítems Agregados */}
            {errorItemsTabla && <p className="error-message" style={{textAlign: 'center'}}>{errorItemsTabla}</p>}
            {itemsTabla.length > 0 ? (
                <table className="tabla-items tabla-items-proceso-venta"> {/* Clase del CSS original */}
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Cantidad</th>
                            <th>Precio Unit.</th>
                            <th>Precio Total</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemsTabla.map((item, index) => (
                            <VentaItemRow
                                key={item.id ? `${item.tipo}-${item.id}-${index}` : index}
                                item={item}
                                index={index}
                                onActualizarCantidad={onActualizarCantidadItem}
                                onEliminarItem={onEliminarItem}
                            />
                        ))}
                    </tbody>
                </table>
            ) : (
                <p style={{textAlign: 'center', margin: '20px 0', color: '#777'}}>
                    Aún no has agregado productos o servicios a la venta.
                </p>
            )}

            {/* Resumen de la Venta */}
            <div className="resumen-venta"> {/* Clase del CSS original */}
                <p><strong>Subtotal:</strong> ${subtotal.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p><strong>IVA (19%):</strong> ${iva.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p><strong>Total Venta:</strong> ${total.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
        </div>
    );
};

export default VentaForm;