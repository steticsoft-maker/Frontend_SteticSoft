import React, { useState } from "react";
import NavbarAdmin from "../../components/NavbarAdmin";
import "./Compras.css";

const Compras = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [compras, setCompras] = useState([
    { proveedor: "Proveedor A", fecha: "24/03/2025", total: "$500,000", estado: "Completado", productos: [] },
    { proveedor: "Proveedor B", fecha: "22/03/2025", total: "$320,000", estado: "Pendiente", productos: [] },
  ]);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCompra, setSelectedCompra] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompra, setNewCompra] = useState({ proveedor: "", fecha: "", productos: [] });

  const handleAnular = (index) => {
    if (window.confirm("¿Está seguro de que desea anular esta compra?")) {
      const updatedCompras = [...compras];
      updatedCompras[index].estado = "Anulada";
      setCompras(updatedCompras);
    }
  };

  const handleGenerarPDF = () => {
    alert("Función de generación de PDF en desarrollo.");
  };

  const handleShowDetails = (compra) => {
    setSelectedCompra(compra);
    setShowDetailsModal(true);
  };

  const handleEstadoChange = (index) => {
    const updatedCompras = [...compras];
    updatedCompras[index].estado = updatedCompras[index].estado === "Pendiente" ? "Completado" : "Pendiente";
    setCompras(updatedCompras);
  };

  const handleAddCompra = () => {
    setCompras([...compras, { ...newCompra, total: calcularTotal(newCompra.productos), estado: "Pendiente" }]);
    setShowAddModal(false);
    setNewCompra({ proveedor: "", fecha: "", productos: [] });
  };

  const handleAddProducto = () => {
    setNewCompra({
      ...newCompra,
      productos: [...newCompra.productos, { nombre: "", cantidad: 1, precio: 0, total: 0 }]
    });
  };

  const handleRemoveProducto = (index) => {
    const updatedProductos = newCompra.productos.filter((_, i) => i !== index);
    setNewCompra({ ...newCompra, productos: updatedProductos });
  };

  const handleChangeProducto = (index, field, value) => {
    const updatedProductos = [...newCompra.productos];
    updatedProductos[index][field] = field === "cantidad" || field === "precio" ? parseFloat(value) || 0 : value;
    updatedProductos[index].total = updatedProductos[index].cantidad * updatedProductos[index].precio;
    setNewCompra({ ...newCompra, productos: updatedProductos });
  };

  const calcularTotal = (productos) => {
    return `$${productos.reduce((acc, prod) => acc + prod.total, 0).toLocaleString()}`;
  };

  return (
    <div className="compras-container">
      <NavbarAdmin />
      <div className="compras-content">
        <h2 className="title-h2">Gestión de Compras</h2>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar compra..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="compras-buttons">
          <button className="btn success" onClick={() => setShowAddModal(true)}>
            Agregar Compra
          </button>
        </div>

        <div className="compras-table">
          <table>
            <thead>
              <tr>
                <th>Proveedor</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {compras
                .filter((compra) =>
                  compra.proveedor.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((compra, index) => (
                  <tr key={index}>
                    <td>{compra.proveedor}</td>
                    <td>{compra.fecha}</td>
                    <td>{compra.total}</td>
                    <td className={`estado ${compra.estado.toLowerCase()}`}>
                      {compra.estado === "Anulada" ? (
                        <span>Anulada</span>
                      ) : (
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={compra.estado === "Completado"}
                            onChange={() => handleEstadoChange(index)}
                          />
                          <span className="slider"></span>
                        </label>
                      )}
                    </td>
                    <td className="acciones">
                      {compra.estado !== "Anulada" && (
                        <button className="btn danger" onClick={() => handleAnular(index)}>
                          Anular
                        </button>
                      )}
                      <button className="btn info" onClick={handleGenerarPDF}>PDF</button>
                      <button className="btn info" onClick={() => handleShowDetails(compra)}>Detalles</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Agregar Compra</h2>
            <input
              type="text"
              placeholder="Proveedor"
              value={newCompra.proveedor}
              onChange={(e) => setNewCompra({ ...newCompra, proveedor: e.target.value })}
            />
            <input
              type="date"
              value={newCompra.fecha}
              onChange={(e) => setNewCompra({ ...newCompra, fecha: e.target.value })}
            />

            <h3>Productos</h3>
            {newCompra.productos.map((producto, index) => (
              <div key={index} className="producto-item">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={producto.nombre}
                  onChange={(e) => handleChangeProducto(index, "nombre", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Cantidad"
                  value={producto.cantidad}
                  onChange={(e) => handleChangeProducto(index, "cantidad", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Precio Unitario"
                  value={producto.precio}
                  onChange={(e) => handleChangeProducto(index, "precio", e.target.value)}
                />
                <span>Total: ${producto.total.toLocaleString()}</span>
                <button className="btn danger" onClick={() => handleRemoveProducto(index)}>Eliminar</button>
              </div>
            ))}
            <button className="btn success" onClick={handleAddProducto}>Agregar Producto</button>

            <h3>Total: {calcularTotal(newCompra.productos)}</h3>

            <button className="btn success" onClick={handleAddCompra}>Guardar Compra</button>
            <button className="btn close" onClick={() => setShowAddModal(false)}>Cancelar</button>
          </div>
        </div>
      )}
      
      {showDetailsModal && selectedCompra && (
        <div className="modal">
          <div className="modal-content">
            <h2>Detalles de la Compra</h2>
            <p><strong>Proveedor:</strong> {selectedCompra.proveedor}</p>
            <p><strong>Fecha:</strong> {selectedCompra.fecha}</p>
            <p><strong>Total:</strong> {selectedCompra.total}</p>
            <h3>Productos</h3>
            <ul>
              {selectedCompra.productos.length > 0 ? (selectedCompra.productos.map((producto, index) => (
                <li key={index}>
                  {producto.nombre} - {producto.cantidad} x ${producto.precio.toLocaleString()} = ${producto.total.toLocaleString()}
                  </li>
                  ))
                ) : (
                <p>No hay productos registrados.</p>
                )}
                </ul>
                <button className="btn close" onClick={() => setShowDetailsModal(false)}>Cerrar</button>
                </div>
      </div>
)}

    </div>
  );
};

export default Compras;
