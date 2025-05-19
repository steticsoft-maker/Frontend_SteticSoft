import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import NavbarAdmin from "../../components/NavbarAdmin/NavbarAdmin";
import "./AgregarCompra.css";

// Datos de productos organizados por categoria
const productosPorCategoria = [
    {
        categoria: "Cabello",
        productos: [
            { nombre: "Shampoo", precio: 5000 },
            { nombre: "Acondicionador", precio: 6000 },
            { nombre: "Tinte", precio: 12000 },
            { nombre: "Cera para cabello", precio: 8000 },
            { nombre: "Gel fijador", precio: 7000 },
        ]
    },
    {
        categoria: "Maquillaje",
        productos: [
            { nombre: "Labial", precio: 15000 },
            { nombre: "Base de Maquillaje", precio: 30000 },
            { nombre: "Mascara de Pestanas", precio: 18000 },
        ]
    },
    {
        categoria: "Unas",
        productos: [
            { nombre: "Esmalte Tradicional", precio: 8000 },
            { nombre: "Esmalte Semipermanente", precio: 25000 },
            { nombre: "Quitaesmalte", precio: 5000 },
        ]
    }
];

// Lista de proveedores falsos para la busqueda (se mantiene)
const proveedoresFalsos = [
    "Proveedor Cosmeticos ABC",
    "Distribuidora Belleza Total",
    "Suministros Estetica Pro",
    "Insumos Peluqueria Fantasia",
    "Cosmetica Avanzada SAS",
    "Belleza Profesional Ltda."
];

const metodosPago = ["Efectivo", "Transferencia Bancaria", "Tarjeta de Credito", "Nequi/Daviplata"];

const Modal = ({ mensaje, onClose }) => (
  <div className="modal-overlay-AgregarCompra">
    <div className="modal-container-AgregarCompra">
      <p>{mensaje}</p>
      <button className="BotonCerrarModalValidaciones" onClick={onClose}>Cerrar</button>
    </div>
  </div>
);

const AgregarCompra = () => {
  const navigate = useNavigate();
  // Cambiado proveedor para ser el nombre seleccionado
  const [proveedor, setProveedor] = useState("");
  // Estado para el texto en la barra de busqueda de proveedor
  const [supplierSearchTerm, setSupplierSearchTerm] = useState("");
  // Estado para las sugerencias de proveedor filtradas
  const [suggestedSuppliers, setSuggestedSuppliers] = useState([]);

  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  // Eliminado estado de fechaEntrega
  // const [fechaEntrega, setFechaEntrega] = useState("");

  // Nuevo estado para metodo de pago
  const [metodoPago, setMetodoPago] = useState("");

  // Ahora cada producto en la lista incluye la categoria seleccionada para esa fila
  const [productos, setProductos] = useState([]);

  const [subtotal, setSubtotal] = useState(0);
  const [iva, setIva] = useState(0);
  const [total, setTotal] = useState(0);
  const [modalMensaje, setModalMensaje] = useState("");

  // Hook para actualizar totales cuando los productos cambian
    useEffect(() => {
        actualizarTotales(productos);
    }, [productos]);


  const handleAgregarProducto = () => {
    // Inicializar nuevo producto con campo de categoria vacio
    setProductos([...productos, { categoria: "", nombre: "", cantidad: 1, precio: 0, total: 0 }]);
  };

  const handleEliminarProducto = (index) => {
    const nuevosProductos = productos.filter((_, i) => i !== index);
    setProductos(nuevosProductos);
      // La actualizacion de totales se maneja ahora en el useEffect
  };

  const handleCambioProducto = (index, campo, valor) => {
    const nuevosProductos = [...productos];

    if (campo === "categoria") {
        nuevosProductos[index].categoria = valor;
        // Restablecer nombre, precio y total del producto al cambiar la categoria
        nuevosProductos[index].nombre = "";
        nuevosProductos[index].precio = 0;
        nuevosProductos[index].total = 0;
    } else if (campo === "nombre") {
        nuevosProductos[index].nombre = valor;
        // Buscar el precio correcto basado en la categoria y el nombre seleccionado
        const categoriaSeleccionada = productosPorCategoria.find(cat => cat.categoria === nuevosProductos[index].categoria);
        const productoSeleccionado = categoriaSeleccionada
            ? categoriaSeleccionada.productos.find(p => p.nombre === valor)
            : null;
        nuevosProductos[index].precio = productoSeleccionado ? productoSeleccionado.precio : 0;
          // Recalcular el total de la linea
        nuevosProductos[index].total = nuevosProductos[index].cantidad * nuevosProductos[index].precio;
    } else if (campo === "cantidad") {
        nuevosProductos[index].cantidad = Math.max(0, Number(valor));
          // Recalcular el total de la linea
        nuevosProductos[index].total = nuevosProductos[index].cantidad * nuevosProductos[index].precio;
    } else if (campo === "precio") {
        nuevosProductos[index].precio = Math.max(0, Number(valor));
          // Recalcular el total de la linea
        nuevosProductos[index].total = nuevosProductos[index].cantidad * nuevosProductos[index].precio;
    }


    setProductos(nuevosProductos);
      // La actualizacion de totales se maneja ahora en el useEffect
  };

  const actualizarTotales = (productos) => {
    const nuevoSubtotal = productos.reduce((sum, prod) => sum + prod.total, 0);
    const nuevoIva = nuevoSubtotal > 0 ? nuevoSubtotal * 0.19 : 0; // Asumiendo 19% de IVA, y 0 si subtotal es 0
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

  // Manejar cambio en la barra de busqueda de proveedor
  const handleSupplierSearchChange = (e) => {
      const term = e.target.value;
      setSupplierSearchTerm(term);
      if (term.length > 1) { // Mostrar sugerencias solo si hay al menos 2 caracteres
          const filteredSuppliers = proveedoresFalsos.filter(prov =>
              prov.toLowerCase().includes(term.toLowerCase())
          );
          setSuggestedSuppliers(filteredSuppliers);
      } else {
          setSuggestedSuppliers([]); // Limpiar sugerencias si el termino es muy corto
      }
        // Limpiar el proveedor seleccionado si el termino de busqueda cambia
        // Esto evita que un proveedor quede seleccionado si el usuario edita despues de seleccionar
      setProveedor("");
  };

  // Manejar la seleccion de un proveedor de las sugerencias
  const handleSelectSupplier = (selectedSupplier) => {
      setSupplierSearchTerm(selectedSupplier); // Poner el nombre completo en la barra de busqueda
      setProveedor(selectedSupplier); // Establecer el proveedor seleccionado
      setSuggestedSuppliers([]); // Limpiar sugerencias
  };


  const handleGuardarCompra = () => {
    if (!proveedor || !proveedoresFalsos.includes(proveedor) || supplierSearchTerm !== proveedor) {
       mostrarModal("Debe seleccionar un proveedor valido de la lista de sugerencias.");
       return;
      }

    if (!metodoPago) {
        mostrarModal("Debe seleccionar un metodo de pago.");
        return;
    }


    if (productos.length === 0) {
      mostrarModal("Debe agregar al menos un producto.");
      return;
    }

    for (let i = 0; i < productos.length; i++) {
        const productoFila = productos[i];

        if (productoFila.cantidad > 0 && (!productoFila.categoria || !productoFila.nombre)) {
            mostrarModal(`Debe seleccionar categoria y producto para la fila ${i + 1} con cantidad mayor a 0.`);
            return;
        }
        if (productoFila.nombre && productoFila.cantidad <= 0) {
             mostrarModal(`La cantidad para el producto "${productoFila.nombre}" en la fila ${i + 1} debe ser mayor a 0.`);
             return;
        }


        // Validaciones generales para cantidad y precio
        if (productoFila.cantidad < 0) {
            mostrarModal(`La cantidad no puede ser negativa en la fila ${i + 1}.`);
            return;
        }
        if (productoFila.precio < 0) {
            mostrarModal(`El precio no puede ser negativo en la fila ${i + 1}.`);
            return;
        }

          // Si hay cantidad > 0, asegurarse que el precio sea > 0 (opcional, pero buena practica)
        if (productoFila.cantidad > 0 && productoFila.precio <= 0 && productoFila.nombre) {
            mostrarModal(`El precio debe ser mayor a 0 para el producto "${productoFila.nombre}" en la fila ${i + 1}.`);
            return;
        }
    }

    const compra = {
      proveedor,
      fecha,
      productos,
      subtotal,
      iva,
      total,
      metodoPago,
    };

    // Nota: Guardar en localStorage es solo para demostracion.
    // En una aplicacion real, enviarias esto a un backend/API.
    // Es posible que quieras anadir un ID unico a cada compra antes de guardarla.
    const comprasGuardadas = JSON.parse(localStorage.getItem("compras")) || [];
    comprasGuardadas.push(compra);
    localStorage.setItem("compras", JSON.stringify(comprasGuardadas));

    mostrarModal("Compra guardada exitosamente.");
      // Pequeno retraso antes de navegar para que el usuario vea el modal de exito
    setTimeout(() => {
          cerrarModal(); // Cerrar modal antes de navegar
          navigate("/compras");
    }, 1500); // Espera 1.5 segundos

  };

  const handleCancelar = () => {
        // Puedes anadir una confirmacion antes de cancelar si lo deseas
        navigate("/compras");
  };


  return (
    <div className="container">
      <div className="agregar-compra-container">
        <NavbarAdmin />
        <div className="agregar-compra-content">
          <h2 className="agregar-compra-title">Agregar Compra</h2>

          {/* Campo de busqueda de proveedor con sugerencias */}
          <div className="form-group">
             <label htmlFor="proveedorSearch">Proveedor <span className="required-asterisk">*</span>:</label>
             <input
                 type="text"
                 id="proveedorSearch"
                 className="buscar-proveedor-input"
                 value={supplierSearchTerm}
                 onChange={handleSupplierSearchChange}
                 placeholder="Buscar o seleccionar proveedor"
                 autoComplete="off"
             />
             {/* Mostrar sugerencias solo si hay termino de busqueda, sugerencias encontradas,
                  y el termino de busqueda no es exactamente igual a un proveedor seleccionado */}
             {supplierSearchTerm && suggestedSuppliers.length > 0 && supplierSearchTerm !== proveedor && (
                 <ul className="proveedor-sugerencias-lista">
                     {suggestedSuppliers.map((prov, index) => (
                         <li key={index} onClick={() => handleSelectSupplier(prov)}>
                             {prov}
                         </li>
                     ))}
                 </ul>
             )}
              {/* Mostrar mensaje si el termino no coincide con ningun proveedor y no es un proveedor seleccionado */}
             {supplierSearchTerm && suggestedSuppliers.length === 0 && !proveedoresFalsos.includes(supplierSearchTerm) && supplierSearchTerm.length > 1 && (
                 <div className="no-sugerencias">No se encontraron proveedores que coincidan.</div>
             )}
                {/* Mostrar advertencia si hay un termino pero no se ha seleccionado un proveedor valido aun */}
             {supplierSearchTerm && !proveedor && proveedoresFalsos.some(prov => prov.toLowerCase().includes(supplierSearchTerm.toLowerCase())) && (
                  <div className="mensaje-seleccion">Seleccione un proveedor de la lista.</div>
             )}

          </div>


          <div className="form-group">
            <label htmlFor="fechaCompra">Fecha de Compra <span className="required-asterisk">*</span>:</label>
            <input
              type="date"
              id="fechaCompra"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="LaFecha"
              placeholder="Seleccione la fecha de compra"
              required // Hacer el campo requerido
            />
          </div>

           <div className="form-group">
                <label htmlFor="metodoPago">Metodo de Pago <span className="required-asterisk">*</span>:</label>
                <select
                    id="metodoPago"
                    className="seleccionar-metodo-pago"
                    value={metodoPago}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    required // Hacer el campo requerido
                >
                    <option value="">Seleccione un metodo</option>
                    {metodosPago.map((metodo, index) => (
                        <option key={index} value={metodo}>{metodo}</option>
                    ))}
                </select>
           </div>


          <button className="btn-agregar-producto-compra" onClick={handleAgregarProducto}>
            Agregar Producto
          </button>

          <div className="agregar-compra-table">
            <table>
              <thead>
                <tr>
                  <th>Categoria de Productos</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Total</th>
                  <th>Accion</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto, index) => (
                  <tr key={index}>
                    <td className="celda-categoria-producto"> {/* Nueva clase para estilo de la celda */}
                       <div className="selects-producto-group"> {/* Contenedor para los 2 selects */}
                            {/* Selector de Categoria */}
                            <select
                                 className="seleccionar-categoria" // Nueva clase
                                 value={producto.categoria}
                                 onChange={(e) => handleCambioProducto(index, "categoria", e.target.value)}
                            >
                                 <option value="">-- Categoria de Productos --</option>
                                 {productosPorCategoria.map((item, catIndex) => (
                                     <option key={catIndex} value={item.categoria}>{item.categoria}</option>
                                 ))}
                            </select>

                            {/* Selector de Producto (depende de la categoria seleccionada) */}
                            <select
                                 className="seleccionar-producto-fila" // Clase especifica para el select de producto en fila
                                 value={producto.nombre}
                                 onChange={(e) => handleCambioProducto(index, "nombre", e.target.value)}
                                 disabled={!producto.categoria} // Deshabilitado si no hay categoria
                            >
                                 <option value="">-- Producto --</option>
                                 {producto.categoria && productosPorCategoria.find(item => item.categoria === producto.categoria)?.productos.map((prod, prodIndex) => (
                                     <option key={prodIndex} value={prod.nombre}>{prod.nombre}</option>
                                 ))}
                            </select>
                        </div>
                    </td>
                    <td>
                      <input
                        className="input-cantidad-precio"
                        type="number"
                        min="0"
                        value={producto.cantidad}
                        onChange={(e) => handleCambioProducto(index, "cantidad", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        className="input-cantidad-precio"
                        type="number"
                        min="0"
                        value={producto.precio}
                          // Permitir edicion manual del precio si es necesario, o deshabilitar si el precio viene del producto seleccionado
                        onChange={(e) => handleCambioProducto(index, "precio", e.target.value)}
                      />
                    </td>
                    <td>${producto.total.toFixed(0)}</td>
                    <td>
                      <button
                        className="btn-icono-eliminar-producto-compra"
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
            <button className="btn-guardar-agregar-compra" onClick={handleGuardarCompra}>
              Guardar Compra
            </button>
            <button className="btnCancelarAgregarCompra" onClick={handleCancelar}>
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