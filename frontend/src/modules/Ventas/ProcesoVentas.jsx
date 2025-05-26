import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from "../../components/NavbarAdmin/NavbarAdmin";
import "./ProcesoVentas.css"; 

const ProcesoVentas = () => {
  const clientesFalsos = [
    { id: 1, nombre: "Juan Pérez", documento: "123456789", telefono: "3001234567", direccion: "Calle 1" },
    { id: 2, nombre: "María Gómez", documento: "987654321", telefono: "3019876543", direccion: "Carrera 2" },
    { id: 3, nombre: "Luis Martínez", documento: "1122334455", telefono: "3021122334", direccion: "Avenida 3" },
    { id: 4, nombre: "Ana López", documento: "4455667788", telefono: "3034455667", direccion: "Calle 10" },
    { id: 5, nombre: "Carlos Ruiz", documento: "9988776655", telefono: "3049988776", direccion: "Carrera 20" },
  ];

  const catalogoProductos = [
    { id: 1, nombre: "Producto A", precio: 10000 },
    { id: 2, nombre: "Producto B", precio: 20000 },
    { id: 3, nombre: "Producto C", precio: 15000 },
    { id: 4, nombre: "Teclado Mecánico", precio: 75000 },
    { id: 5, nombre: "Mouse Gamer", precio: 30000 },
    { id: 6, nombre: "Monitor Curvo 27", precio: 250000 },
    { id: 7, nombre: "Webcam HD", precio: 50000 },
    { id: 8, nombre: "Disco Duro SSD 1TB", precio: 180000 },
  ];

  const catalogoServicios = [
    { id: 1, nombre: "Servicio A", precio: 50000 },
    { id: 2, nombre: "Servicio B", precio: 75000 },
    { id: 3, nombre: "Servicio C", precio: 60000 },
    { id: 4, nombre: "Mantenimiento Preventivo", precio: 80000 },
    { id: 5, nombre: "Instalación de Software", precio: 40000 },
    { id: 6, nombre: "Reparación de Hardware", precio: 120000 },
  ];

  const [modoCita, setModoCita] = useState("");
  const [mostrarClientes, setMostrarClientes] = useState(false);
  const [datosCliente, setDatosCliente] = useState({ nombre: "", documento: "", telefono: "", direccion: "" });
  const navigate = useNavigate();
  const [itemsTabla, setItemsTabla] = useState([]);
  const [mostrarCatalogoProductos, setMostrarCatalogoProductos] = useState(false);
  const [mostrarCatalogoServicios, setMostrarCatalogoServicios] = useState(false);
  const [filtroProducto, setFiltroProducto] = useState("");
  const [filtroServicio, setFiltroServicio] = useState("");
  const [filtroCliente, setFiltroCliente] = useState("");

  
  const [errorItemsTabla, setErrorItemsTabla] = useState("");
  const [errorDatosCliente, setErrorDatosCliente] = useState("");

  
  const [showConfirmSaveModal, setShowConfirmSaveModal] = useState(false);

  const seleccionarCliente = (cliente) => {
    setDatosCliente(cliente);
    setMostrarClientes(false);
    setErrorDatosCliente(""); 
  };

  const agregarItemATabla = (item) => {
    const nuevoItem = { ...item, cantidad: 1 };
    setItemsTabla([...itemsTabla, nuevoItem]);
    setErrorItemsTabla(""); 
  };

  const eliminarItemDeTabla = (index) => {
    setItemsTabla(itemsTabla.filter((_, i) => i !== index));
  };

  const actualizarCantidad = (index, nuevaCantidad) => {
    const nuevaTabla = itemsTabla.map((item, i) =>
      i === index ? { ...item, cantidad: nuevaCantidad } : item
    );
    setItemsTabla(nuevaTabla);
  };

  const subtotal = itemsTabla.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  
  const guardarNuevaVenta = () => {
    // Limpiar errores previos
    setErrorItemsTabla("");
    setErrorDatosCliente("");

    let isValid = true;

    if (itemsTabla.length === 0) {
      setErrorItemsTabla("Debes agregar al menos un producto o servicio.");
      isValid = false;
    }

    if (modoCita === "directa" && datosCliente.nombre === "") {
        setErrorDatosCliente("Por favor selecciona un cliente existente.");
        isValid = false;
    } else if (
      modoCita === "indirecta" &&
      (datosCliente.nombre.trim() === "" ||
        datosCliente.documento.trim() === "" ||
        datosCliente.telefono.trim() === "" ||
        datosCliente.direccion.trim() === "")
    ) {
      setErrorDatosCliente("Por favor completa todos los campos del cliente nuevo.");
      isValid = false;
    } else if (modoCita === "") { 
        setErrorDatosCliente("Por favor selecciona si el cliente es existente o nuevo.");
        isValid = false;
    }


    if (!isValid) {
      return; 
    }

    
    setShowConfirmSaveModal(true);
  };

  
  const confirmGuardarVenta = () => {
    const itemsParaVenta = itemsTabla.map(item => ({
      nombre: item.nombre,
      cantidad: item.cantidad,
      precio: item.precio,
      total: item.precio * item.cantidad
    }));

    const nuevaVenta = {
      cliente: datosCliente.nombre,
      documento: datosCliente.documento,
      telefono: datosCliente.telefono,
      direccion: datosCliente.direccion,
      items: itemsParaVenta,
      subtotal,
      iva,
      total,
      fecha: new Date().toISOString().slice(0, 10),
    };

    
    navigate("/ventas", { state: { nuevaVenta: nuevaVenta } });

    
    setShowConfirmSaveModal(false);
    setDatosCliente({ nombre: "", documento: "", telefono: "", direccion: "" });
    setItemsTabla([]);
    setModoCita("");
    setErrorItemsTabla(""); 
    setErrorDatosCliente(""); 
  };

  const productosFiltrados = catalogoProductos.filter(producto =>
    producto.nombre.toLowerCase().includes(filtroProducto.toLowerCase())
  );
  const serviciosFiltrados = catalogoServicios.filter(servicio =>
    servicio.nombre.toLowerCase().includes(filtroServicio.toLowerCase())
  );
  const clientesFiltrados = clientesFalsos.filter(cliente =>
    cliente.nombre.toLowerCase().includes(filtroCliente.toLowerCase()) ||
    cliente.documento.toLowerCase().includes(filtroCliente.toLowerCase())
  );

  return (
    <div className="proceso-ventas-page">
      <NavbarAdmin />
      <div className="proceso-ventas-main-content">
        <h1>Proceso de Agregar Venta</h1>
        <div className="acciones">
          <button
            className={`directa-button ${modoCita === "directa" ? "activo" : ""}`}
            onClick={() => {
              setModoCita("directa");
              setMostrarClientes(true);
              setFiltroCliente("");
              setErrorDatosCliente("");
            }}
          >
            Cliente existente
          </button>
          <button
            className={`indirecta-button ${modoCita === "indirecta" ? "activo" : ""}`}
            onClick={() => {
                setModoCita("indirecta");
                setDatosCliente({ nombre: "", documento: "", telefono: "", direccion: "" }); 
                setMostrarClientes(false);
                setErrorDatosCliente("");
            }}
          >
            Cliente nuevo
          </button>
        </div>
        {errorDatosCliente && <p className="error-message">{errorDatosCliente}</p>}


        {mostrarClientes && (
          <div className="clientes-emergente">
            <h3>Seleccionar Cliente</h3>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Buscar cliente por nombre o documento..."
                value={filtroCliente}
                onChange={(e) => setFiltroCliente(e.target.value)}
              />
            </div>
            <ul>
              {clientesFiltrados.map((cliente) => (
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
          className={`datos-cliente ${modoCita === "indirecta" ? "" : "bloqueado"}`}
        >
          <h3>Información del Cliente</h3>
          <div className="formulario-cliente">
            <div className="campo-cliente">
              <input
                id="nombre"
                type="text"
                placeholder="Nombre *"
                value={datosCliente.nombre}
                onChange={(e) => {
                    setDatosCliente({ ...datosCliente, nombre: e.target.value });
                    setErrorDatosCliente("");
                }}
                disabled={modoCita !== "indirecta"}
              />
            </div>
            <div className="campo-cliente">
              <input
                id="documento"
                type="text"
                placeholder="Documento *"
                value={datosCliente.documento}
                onChange={(e) => {
                    setDatosCliente({ ...datosCliente, documento: e.target.value });
                    setErrorDatosCliente("");
                }}
                disabled={modoCita !== "indirecta"}
              />
            </div>
            <div className="campo-cliente">
              <input
                id="telefono"
                type="text"
                placeholder="Teléfono *"
                value={datosCliente.telefono}
                onChange={(e) => {
                    setDatosCliente({ ...datosCliente, telefono: e.target.value });
                    setErrorDatosCliente(""); 
                }}
                disabled={modoCita !== "indirecta"}
              />
            </div>
            <div className="campo-cliente">
              <input
                id="direccion"
                type="text"
                placeholder="Dirección *"
                value={datosCliente.direccion}
                onChange={(e) => {
                    setDatosCliente({ ...datosCliente, direccion: e.target.value });
                    setErrorDatosCliente(""); 
                }}
                disabled={modoCita !== "indirecta"}
              />
            </div>
          </div>
        </div>

        <button
          className="catalogo-button"
          onClick={() => {
            setMostrarCatalogoProductos(true);
            setFiltroProducto("");
          }}
        >
          Agregar Producto
        </button>
        <button
          className="catalogo-button"
          onClick={() => {
            setMostrarCatalogoServicios(true);
            setFiltroServicio("");
          }}
        >
          Agregar Servicio
        </button>

        {mostrarCatalogoProductos && (
          <div className="catalogo-emergente">
            <h3>Catálogo de Productos</h3>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Buscar producto..."
                value={filtroProducto}
                onChange={(e) => setFiltroProducto(e.target.value)}
              />
            </div>
            <ul>
              {productosFiltrados.map((producto) => (
                <li key={producto.id}>
                  {producto.nombre} - ${producto.precio}
                  <button
                    onClick={() =>
                      agregarItemATabla({
                        ...producto,
                        estado: producto.estado !== undefined ? producto.estado : true,
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
            <div className="search-bar">
              <input
                type="text"
                placeholder="Buscar servicio..."
                value={filtroServicio}
                onChange={(e) => setFiltroServicio(e.target.value)}
              />
            </div>
            <ul>
              {serviciosFiltrados.map((servicio) => (
                <li key={servicio.id}>
                  {servicio.nombre} - ${servicio.precio}
                  <button
                    onClick={() =>
                      agregarItemATabla({
                        ...servicio,
                        estado: servicio.estado !== undefined ? servicio.estado : true,
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
              <th>Precio Total</th>
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
                    onChange={(e) => actualizarCantidad(index, parseInt(e.target.value, 10))}
                  />
                </td>
                <td>${item.precio.toFixed(2)}</td>
                <td>${(item.precio * item.cantidad).toFixed(2)}</td>
                <td>
                  <button onClick={() => eliminarItemDeTabla(index)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {errorItemsTabla && <p className="error-message">{errorItemsTabla}</p>} {/* Mensaje de error para ítems */}


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

        <div className="botones-accion">
          <button className="guardar-venta-button" onClick={guardarNuevaVenta}>
            Guardar Venta
          </button>
          <button className="cancelar-venta-button" onClick={() => navigate("/ventas")}>
            Cancelar Venta
          </button>
        </div>
      </div>

      
      {showConfirmSaveModal && (
        <div className="modal-compras">
          <div className="modal-content-compras">
            <h2>Confirmar Guardar Venta</h2>
            <p>¿Está seguro de que desea guardar esta venta?</p>
            <div className="modal-compras-buttons-anular">
              <button
                className="botonConfirmarAnularCompra"
                onClick={confirmGuardarVenta}
              >
                Sí, guardar
              </button>
              <button
                className="botonCerrarModalAnularCompra"
                onClick={() => setShowConfirmSaveModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcesoVentas;