import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import NavbarAdmin from "../../components/NavbarAdmin/NavbarAdmin";
import "./AgregarCompra.css";

const productosFalsos = [
  { nombre: "Shampoo", precio: 5000 },
  { nombre: "Acondicionador", precio: 6000 },
  { nombre: "Tinte", precio: 12000 },
  { nombre: "Cera para cabello", precio: 8000 },
  { nombre: "Gel fijador", precio: 7000 },
];

const Modal = ({ mensaje, onClose }) => (
  <div className="modal-overlay-AgregarCompra">
    <div className="modal-container-AgregarCompra">
      <p>{mensaje}</p>
      <button onClick={onClose}>Cerrar</button>
    </div>
  </div>
);

const AgregarCompra = () => {
  const navigate = useNavigate();
  const [proveedor, setProveedor] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [productos, setProductos] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [iva, setIva] = useState(0);
  const [total, setTotal] = useState(0);
  const [modalMensaje, setModalMensaje] = useState("");

  const handleAgregarProducto = () => {
    setProductos([...productos, { nombre: "", cantidad: 1, precio: 0, total: 0 }]);
  };

  const handleEliminarProducto = (index) => {
    const nuevosProductos = productos.filter((_, i) => i !== index);
    setProductos(nuevosProductos);
    actualizarTotales(nuevosProductos);
  };

  const handleCambioProducto = (index, campo, valor) => {
    const nuevosProductos = [...productos];

    if (campo === "nombre") {
      const productoSeleccionado = productosFalsos.find((p) => p.nombre === valor);
      nuevosProductos[index].nombre = valor;
      nuevosProductos[index].precio = productoSeleccionado ? productoSeleccionado.precio : 0;
    } else if (campo === "cantidad") {
      nuevosProductos[index].cantidad = Number(valor);
    } else if (campo === "precio") {
      nuevosProductos[index].precio = Number(valor);
    }

    nuevosProductos[index].total = nuevosProductos[index].cantidad * nuevosProductos[index].precio;
    setProductos(nuevosProductos);
    actualizarTotales(nuevosProductos);
  };

  const actualizarTotales = (productos) => {
    const nuevoSubtotal = productos.reduce((sum, prod) => sum + prod.total, 0);
    const nuevoIva = nuevoSubtotal * 0.19;
    const nuevoTotal = nuevoSubtotal + nuevoIva;

    setSubtotal(nuevoSubtotal);
    setIva(nuevoIva);
    setTotal(nuevoTotal);
  };

  const mostrarModal = (mensaje) => {
    setModalMensaje(mensaje);
  };

  const cerrarModal = () => {
    setModalMensaje("");
  };

  const handleGuardarCompra = () => {
    if (!proveedor) {
      mostrarModal("Debe seleccionar un proveedor.");
      return;
    }

    if (productos.length === 0) {
      mostrarModal("Debe agregar al menos un producto.");
      return;
    }

    for (let i = 0; i < productos.length; i++) {
      if (!productos[i].nombre) {
        mostrarModal(`Debe seleccionar un producto en la fila ${i + 1}.`);
        return;
      }
      if (productos[i].cantidad <= 0) {
        mostrarModal(`La cantidad debe ser mayor a 0 en la fila ${i + 1}.`);
        return;
      }
    }

    const compra = {
      proveedor,
      fecha,
      fechaEntrega,
      productos,
      subtotal,
      iva,
      total,
    };

    const comprasGuardadas = JSON.parse(localStorage.getItem("compras")) || [];
    comprasGuardadas.push(compra);
    localStorage.setItem("compras", JSON.stringify(comprasGuardadas));

    mostrarModal("Compra guardada exitosamente.");
    navigate("/compras");
  };

  return (
    <div className="container">
      <div className="agregar-compra-container">
        <NavbarAdmin />
        <div className="agregar-compra-content">
          <h2 className="agregar-compra-title">Agregar Compra</h2>
          <div className="form-group">
            <div className="numero-compra-cuadro">
              <span className="numero-compra">Id: 4</span>
            </div>
            <select
              id="proveedor"
              value={proveedor}
              onChange={(e) => setProveedor(e.target.value)}
              className="seleccionar-proveedor"
            >
              <option value="">Seleccione un proveedor *</option>
              <option value="Proveedor 1">Proveedor 1</option>
              <option value="Proveedor 2">Proveedor 2</option>
              <option value="Proveedor 3">Proveedor 3</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="fechaCompra">Fecha de Compra:</label>
            <input
              type="date"
              id="fechaCompra"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="LaFecha"
              placeholder="Seleccione la fecha de compra"
            />
          </div>

          <div className="form-group">
            <label htmlFor="fechaEntrega">Fecha de Entrega:</label>
            <input
              type="date"
              id="fechaEntrega"
              value={fechaEntrega}
              onChange={(e) => setFechaEntrega(e.target.value)}
              className="LaFecha"
              placeholder="Seleccione la fecha de entrega"
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

          <div className="agregar-compra-totales">
            <p>Subtotal: ${subtotal.toFixed(0)}</p>
            <p>IVA (19%): ${iva.toFixed(0)}</p>
            <p>
              <strong>Total: ${total.toFixed(0)}</strong>
            </p>
          </div>

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
      {modalMensaje && <Modal mensaje={modalMensaje} onClose={cerrarModal} />}
    </div>
  );
};

export default AgregarCompra;
