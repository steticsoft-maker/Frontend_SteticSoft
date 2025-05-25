import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavbarAdmin from "../../components/NavbarAdmin/NavbarAdmin";
import "./Ventas.css";

const DetalleVenta = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venta, setVenta] = useState(null);

  useEffect(() => {
    const storedVentas = localStorage.getItem("ventas");
    if (storedVentas) {
      const ventas = JSON.parse(storedVentas);
      const foundVenta = ventas.find((v) => v.id === parseInt(id));
      setVenta(foundVenta);
    }
  }, [id]);

  if (!venta) {
    return (
      <div className="ventas-container">
        <NavbarAdmin />
        <div className="ventasContent">
          <h2>Cargando detalle de venta...</h2>
          <p>No se encontró la venta con ID: {id}</p>
          <button className="botonCerrarDetallesVenta" onClick={() => navigate('/ventas')}>Volver a Ventas</button>
        </div>
      </div>
    );
  }

  return (
    <div className="ventas-container">
      <NavbarAdmin />
      <div className="ventasContent"
        
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 60px)',
          padding: '20px' 
        }}
      >
        <div className="modal-content-ventas">
          <h2>Detalle de Venta #{venta.id}</h2>
          <p><strong>Cliente:</strong> {venta.cliente}</p>
          <p><strong>Documento:</strong> {venta.documento || 'N/A'}</p>
          <p><strong>Teléfono:</strong> {venta.telefono || 'N/A'}</p>
          <p><strong>Dirección:</strong> {venta.direccion || 'N/A'}</p>
          <p><strong>Fecha:</strong> {venta.fecha}</p>
          <p><strong>Subtotal:</strong> ${venta.subtotal.toFixed(2)}</p>
          <p><strong>IVA (19%):</strong> ${venta.iva.toFixed(2)}</p>
          <p><strong>Total:</strong> ${venta.total.toFixed(2)}</p>
          <p><strong>Estado:</strong> {venta.estado}</p>

          <table className="tablaDetallesVentas">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {venta.items.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.nombre}</td>
                  <td>{item.cantidad}</td>
                  <td>${item.precio.toLocaleString()}</td>
                  <td>${(item.precio * item.cantidad).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            className="botonCerrarDetallesVenta"
            onClick={() => navigate('/ventas')}
          >
            Volver a Ventas
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalleVenta;