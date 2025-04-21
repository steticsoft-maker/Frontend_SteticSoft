import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProcesoVentas.css";

const ProcesoVentas = ({ guardarVenta }) => {
  // Clientes de ejemplo
  const clientesFalsos = [
    {
      id: 1,
      nombre: "Juan Pérez",
      documento: "123456789",
      telefono: "3001234567",
      direccion: "Calle 1",
    },
    {
      id: 2,
      nombre: "María Gómez",
      documento: "987654321",
      telefono: "3019876543",
      direccion: "Carrera 2",
    },
    {
      id: 3,
      nombre: "Luis Martínez",
      documento: "1122334455",
      telefono: "3021122334",
      direccion: "Avenida 3",
    },
  ];

  // Productos de ejemplo
  const catalogoProductos = [
    { id: 1, nombre: "Producto A", precio: 10000 },
    { id: 2, nombre: "Producto B", precio: 20000 },
    { id: 3, nombre: "Producto C", precio: 15000 },
  ];

  // Servicios de ejemplo
  const catalogoServicios = [
    { id: 1, nombre: "Servicio A", precio: 50000 },
    { id: 2, nombre: "Servicio B", precio: 75000 },
    { id: 3, nombre: "Servicio C", precio: 60000 },
  ];

  // Estados de componentes
  const [modoCita, setModoCita] = useState(""); // "directa" o "indirecta"
  const [mostrarClientes, setMostrarClientes] = useState(false);
  const [datosCliente, setDatosCliente] = useState({
    nombre: "",
    documento: "",
    telefono: "",
    direccion: "",
  });

  const navigate = useNavigate();


  const [itemsTabla, setItemsTabla] = useState([]);
  const [mostrarCatalogoProductos, setMostrarCatalogoProductos] =
    useState(false);
  const [mostrarCatalogoServicios, setMostrarCatalogoServicios] =
    useState(false);

  // Seleccionar cliente
  const seleccionarCliente = (cliente) => {
    setDatosCliente(cliente);
    setMostrarClientes(false);
  };

  // Agregar un producto o servicio a la tabla
  const agregarItemATabla = (item) => {
    const nuevoItem = { ...item, cantidad: 1 };
    setItemsTabla([...itemsTabla, nuevoItem]);
  };

  // Eliminar un producto o servicio de la tabla
  const eliminarItemDeTabla = (index) => {
    setItemsTabla(itemsTabla.filter((_, i) => i !== index));
  };

  // Actualizar la cantidad de un producto o servicio en la tabla
  const actualizarCantidad = (index, nuevaCantidad) => {
    const nuevaTabla = itemsTabla.map((item, i) =>
      i === index ? { ...item, cantidad: nuevaCantidad } : item
    );
    setItemsTabla(nuevaTabla);
  };

  // Cálculos para resumen
  const subtotal = itemsTabla.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );
  const iva = subtotal * 0.19; // IVA del 19%
  const total = subtotal + iva;

  const guardarNuevaVenta = () => {
    if (itemsTabla.length === 0) {
      alert("Debes agregar al menos un producto o servicio antes de guardar la venta.");
      return;
    }
  
    if (
      (modoCita === "directa" && datosCliente.nombre === "") ||
      (modoCita === "indirecta" &&
        (datosCliente.nombre === "" ||
          datosCliente.documento === "" ||
          datosCliente.telefono === "" ||
          datosCliente.direccion === ""))
    ) {
      alert("Por favor selecciona o completa la información del cliente.");
      return;
    }
  
    const nuevaVenta = {
      cliente: datosCliente.nombre,
      documento: datosCliente.documento,
      telefono: datosCliente.telefono,
      direccion: datosCliente.direccion,
      items: itemsTabla,
      subtotal,
      iva,
      total,
      fecha: new Date().toISOString().slice(0, 10),
    };
  
    guardarVenta(nuevaVenta);
    setDatosCliente({ nombre: "", documento: "", telefono: "", direccion: "" });
    setItemsTabla([]);
    alert("¡Venta guardada exitosamente!");
    navigate("/ventas");
  };
  

  return (
    <div className="proceso-ventas-main">
      <h1>Proceso de Agregar Venta</h1>
      <div className="acciones">
        <button
          className={`directa-button ${modoCita === "directa" ? "activo" : ""}`}
          onClick={() => {
            setModoCita("directa");
            setMostrarClientes(true);
          }}
        >
          Venta Directa
        </button>
        <button
          className={`indirecta-button ${
            modoCita === "indirecta" ? "activo" : ""
          }`}
          onClick={() => setModoCita("indirecta")}
        >
          Venta Indirecta
        </button>
      </div>

      {mostrarClientes && (
        <div className="clientes-emergente">
          <h3>Seleccionar Cliente</h3>
          <ul>
            {clientesFalsos.map((cliente) => (
              <li key={cliente.id}>
                {cliente.nombre} - {cliente.documento}
                <button onClick={() => seleccionarCliente(cliente)}>
                  Seleccionar
                </button>
              </li>
            ))}
          </ul>
          <button
            className="cerrar-button"
            onClick={() => setMostrarClientes(false)}
          >
            Cerrar
          </button>
        </div>
      )}

<div
  className={`datos-cliente ${
    modoCita === "indirecta" ? "" : "bloqueado"
  }`}
>
  <h3>Información del Cliente</h3>
  <div className="formulario-cliente">
    <div className="campo-cliente">
      <input
        id="nombre"
        type="text"
        placeholder="Nombre"
        value={datosCliente.nombre}
        onChange={(e) =>
          setDatosCliente({ ...datosCliente, nombre: e.target.value })
        }
        disabled={modoCita !== "indirecta"}
      />
    </div>
    <div className="campo-cliente">
      <input
        id="documento"
        type="text"
        placeholder="Documento"
        value={datosCliente.documento}
        onChange={(e) =>
          setDatosCliente({ ...datosCliente, documento: e.target.value })
        }
        disabled={modoCita !== "indirecta"}
      />
    </div>
    <div className="campo-cliente">
      <input
        id="telefono"
        type="text"
        placeholder="Teléfono"
        value={datosCliente.telefono}
        onChange={(e) =>
          setDatosCliente({ ...datosCliente, telefono: e.target.value })
        }
        disabled={modoCita !== "indirecta"}
      />
    </div>
    <div className="campo-cliente">
      <input
        id="direccion"
        type="text"
        placeholder="Dirección"
        value={datosCliente.direccion}
        onChange={(e) =>
          setDatosCliente({ ...datosCliente, direccion: e.target.value })
        }
        disabled={modoCita !== "indirecta"}
      />
    </div>
  </div>
</div>



      <button
        className="catalogo-button"
        onClick={() => setMostrarCatalogoProductos(true)}
      >
        Agregar Producto
      </button>
      <button
        className="catalogo-button"
        onClick={() => setMostrarCatalogoServicios(true)}
      >
        Agregar Servicio
      </button>

      {mostrarCatalogoProductos && (
        <div className="catalogo-emergente">
          <h3>Catálogo de Productos</h3>
          <ul>
            {catalogoProductos.map((producto) => (
              <li key={producto.id}>
                {producto.nombre} - ${producto.precio}
                <button
                  onClick={() =>
                    agregarItemATabla({
                      ...producto,
                      estado:
                        producto.estado !== undefined ? producto.estado : true, // Evita duplicados
                    })
                  }
                >
                  Agregar
                </button>
              </li>
            ))}
          </ul>
          <button
            className="cerrar-button"
            onClick={() => setMostrarCatalogoProductos(false)}
          >
            Cerrar
          </button>
        </div>
      )}

      {mostrarCatalogoServicios && (
        <div className="catalogo-emergente">
          <h3>Catálogo de Servicios</h3>
          <ul>
            {catalogoServicios.map((servicio) => (
              <li key={servicio.id}>
                {servicio.nombre} - ${servicio.precio}
                <button
                  onClick={() =>
                    agregarItemATabla({
                      ...servicio,
                      estado:
                        servicio.estado !== undefined ? servicio.estado : true, // Evita duplicados
                    })
                  }
                >
                  Agregar
                </button>
              </li>
            ))}
          </ul>
          <button
            className="cerrar-button"
            onClick={() => setMostrarCatalogoServicios(false)}
          >
            Cerrar
          </button>
        </div>
      )}

<table className="tabla-items">
  <thead>
    <tr>
      <th>Nombre</th>
      <th>Cantidad</th>
      <th>Precio Unitario</th>
      <th>Precio Total</th> {/* Nuevo campo */}
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
    {itemsTabla.map((item, index) => (
      <tr key={index}>
        <td>{item.nombre}</td>
        <td>
          <input
            type="number"
            min="1"
            value={item.cantidad}
            onChange={(e) =>
              actualizarCantidad(index, parseInt(e.target.value, 10))
            }
          />
        </td>
        <td>${item.precio.toFixed(2)}</td>
        <td>${(item.precio * item.cantidad).toFixed(2)}</td> {/* Cálculo dinámico */}
        <td>
          <button onClick={() => eliminarItemDeTabla(index)}>
            Eliminar
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>


      {/* Resumen de la venta */}
      <div className="resumen-venta">
        <p>
          <strong>Subtotal:</strong> ${subtotal.toFixed(2)}
        </p>
        <p>
          <strong>IVA (19%):</strong> ${iva.toFixed(2)}
        </p>
        <p>
          <strong>Total:</strong> ${total.toFixed(2)}
        </p>
      </div>

      {/* Botones de acción */}
<div className="botones-accion">
  <button className="guardar-venta-button" onClick={guardarNuevaVenta}>
    Guardar Venta
  </button>
  <button className="cancelar-venta-button" onClick={() => navigate("/ventas")}>
    Cancelar Venta
  </button>
</div>


    </div>
  );
  
};

export default ProcesoVentas;
