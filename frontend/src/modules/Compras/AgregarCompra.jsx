import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import NavbarAdmin from "../../components/NavbarAdmin";
import "./AgregarCompra.css";

const productosFalsos = [
  { nombre: "Shampoo", precio: 5000 },
  { nombre: "Acondicionador", precio: 6000 },
  { nombre: "Tinte", precio: 12000 },
  { nombre: "Cera para cabello", precio: 8000 },
  { nombre: "Gel fijador", precio: 7000 },
];

const AgregarCompra = () => {
  const navigate = useNavigate();
  const [proveedor, setProveedor] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [productos, setProductos] = useState([]);
  const [total, setTotal] = useState(0);

  const handleAgregarProducto = () => {
    setProductos([...productos, { nombre: "", cantidad: 1, precio: 0, total: 0 }]);
  };

  const handleEliminarProducto = (index) => {
    const nuevosProductos = productos.filter((_, i) => i !== index);
    setProductos(nuevosProductos);
    actualizarTotal(nuevosProductos);
  };

  const handleCambioProducto = (index, campo, valor) => {
    const nuevosProductos = [...productos];
    if (campo === "nombre") {
      const productoSeleccionado = productosFalsos.find((p) => p.nombre === valor);
      nuevosProductos[index].precio = productoSeleccionado ? productoSeleccionado.precio : 0;
    }

    nuevosProductos[index][campo] = campo === "cantidad" || campo === "precio" ? Number(valor) : valor;
    nuevosProductos[index].total = nuevosProductos[index].cantidad * nuevosProductos[index].precio;
    setProductos(nuevosProductos);
    actualizarTotal(nuevosProductos);
  };

  const actualizarTotal = (productos) => {
    const nuevoTotal = productos.reduce((sum, prod) => sum + prod.total, 0);
    setTotal(nuevoTotal);
  };

  const handleGuardarCompra = () => {
    const compra = {
      proveedor,
      fecha,
      productos,
      total,
    };

    console.log("Compra guardada (simulada):", compra); // Simula guardado
    navigate("/compras"); // Redirige
  };

  return (
    <div className="container">
      <div className="agregar-compra-container">
        <NavbarAdmin />
        <div className="agregar-compra-content">
          <h2 className="agregar-compra-title">Agregar Compra</h2>

          <div className="form-group">
            <label htmlFor="proveedor">Proveedor:</label>
            <select
              id="proveedor"
              value={proveedor}
              onChange={(e) => setProveedor(e.target.value)}
              className="seleccionar-proveedor"
            >
              <option value="">Seleccione un proveedor</option>
              <option value="Proveedor 1">Proveedor 1</option>
              <option value="Proveedor 2">Proveedor 2</option>
              <option value="Proveedor 3">Proveedor 3</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="fecha">Fecha:</label>
            <input
              type="date"
              id="fecha"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="LaFecha"
            />
          </div>

          <button className="btn-agregar-producto" onClick={handleAgregarProducto}>
            Agregar Producto
          </button>

          <div className="agregar-compra-table">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Total</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto, index) => (
                  <tr key={index}>
                    <td>
                      <select
                        className="seleccionar-producto"
                        value={producto.nombre}
                        onChange={(e) => handleCambioProducto(index, "nombre", e.target.value)}
                      >
                        <option value="">Seleccione un producto</option>
                        {productosFalsos.map((prod) => (
                          <option key={prod.nombre} value={prod.nombre}>
                            {prod.nombre}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        className="seleccionar-producto"
                        type="number"
                        min="1"
                        value={producto.cantidad}
                        onChange={(e) => handleCambioProducto(index, "cantidad", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        className="seleccionar-producto"
                        type="number"
                        value={producto.precio}
                        onChange={(e) => handleCambioProducto(index, "precio", e.target.value)}
                      />
                    </td>
                    <td>${producto.total.toFixed(0)}</td>
                    <td>
                      <button
                        className="btn-icono-eliminar"
                        onClick={() => handleEliminarProducto(index)}
                        title="Eliminar producto"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="agregar-compra-total">Total: ${total.toFixed(0)}</div>

          <div className="agregar-compra-buttons">
            <button className="btn-guardar" onClick={handleGuardarCompra}>
              Guardar Compra
            </button>
            <button className="btn-cancelar" onClick={() => navigate("/compras")}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgregarCompra;
