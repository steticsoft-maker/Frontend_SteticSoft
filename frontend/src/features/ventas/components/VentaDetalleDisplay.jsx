import React from 'react';

const VentaDetalleDisplay = ({ venta }) => {
    if (!venta) {
        return <p>Cargando detalles de la venta...</p>;
    }

    const formatCurrency = (value) => {
        const number = parseFloat(value);
        if (isNaN(number)) {
            return '$0';
        }
        return `$${number.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    };

    const cliente = venta.cliente || {};
    const productos = venta.productos || [];
    const servicios = venta.servicios || [];
    
    // Cálculo seguro del subtotal
    const subtotal = (parseFloat(venta.total) || 0) - (parseFloat(venta.iva) || 0);

    return (
        <>
            <h2>Detalle de Venta #{venta.idVenta || 'N/A'}</h2>
            <p><strong>Cliente:</strong> {`${cliente.nombre || ''} ${cliente.apellido || ''}`.trim()}</p>
            <p><strong>Documento:</strong> {cliente.numeroDocumento || 'N/A'}</p>
            <p><strong>Teléfono:</strong> {cliente.telefono || 'N/A'}</p>
            <p><strong>Dirección:</strong> {cliente.direccion || 'N/A'}</p>
            <p><strong>Fecha:</strong> {venta.fecha ? new Date(venta.fecha).toLocaleDateString('es-CO') : 'N/A'}</p>
            {/* ✅ CORRECCIÓN: Usar 'venta.estadoDetalle.nombreEstado' para mostrar el estado correcto */}
            <p><strong>Estado:</strong> {venta.estadoDetalle?.nombreEstado || 'N/A'}</p>

            <table className="tablaDetallesVentas" style={{ width: '100%', marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Ítem</th>
                        <th>Cantidad</th>
                        <th>Valor Unitario</th>
                        <th>Total Ítem</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((item, index) => {
                        const detalle = item.detalleProductoVenta || {};
                        const cantidad = detalle.cantidad || 0;
                        const valorUnitario = detalle.valorUnitario || 0;
                        return (
                            <tr key={`prod-${item.idProducto || index}`}>
                                <td>{index + 1}</td>
                                <td>{item.nombre || 'N/A'}</td>
                                <td>{cantidad}</td>
                                <td>{formatCurrency(valorUnitario)}</td>
                                <td>{formatCurrency(cantidad * valorUnitario)}</td>
                            </tr>
                        );
                    })}
                    {servicios.map((item, index) => {
                        const detalle = item.detalleServicioVenta || {};
                        const valorServicio = detalle.valorServicio || 0;
                        return (
                            <tr key={`serv-${item.idServicio || index}`}>
                                <td>{productos.length + index + 1}</td>
                                <td>{item.nombre || 'N/A'}</td>
                                <td>1</td>
                                <td>{formatCurrency(valorServicio)}</td>
                                <td>{formatCurrency(valorServicio)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div style={{ marginTop: '20px', textAlign: 'right', fontWeight: 'bold' }}>
                <p>Subtotal: {formatCurrency(subtotal)}</p>
                <p>IVA (19%): {formatCurrency(venta.iva)}</p>
                <p>Total Venta: {formatCurrency(venta.total)}</p>
            </div>
        </>
    );
};

export default VentaDetalleDisplay;