import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import NavbarAdmin from "../../components/NavbarAdmin/NavbarAdmin";
import "./proveedores.css";

const Proveedores = () => {
    const [proveedores, setProveedores] = useState([
        { nombre: "Proveedor A", tipoDocumento: "Natural", tipoDocumentoNatural: "CC", numeroDocumento: "123456789", telefono: "3001234567", email: "proveedorA@example.com", direccion: "Calle 1 # 23-45", estado: "Activo" },
        { nombre: "Proveedor B", tipoDocumento: "Jurídico", nombreEmpresa: "Empresa B", nit: "987654321", telefono: "3109876543", email: "proveedorB@example.com", direccion: "Carrera 10 # 45-67", estado: "Inactivo" },
        { nombre: "Proveedor C", tipoDocumento: "Natural", tipoDocumentoNatural: "CE", numeroDocumento: "763522321", telefono: "7835198234", email: "proveedorc@example.com", direccion: "Avenida 5 # 12-34", estado: "Inactivo" },
        { nombre: "Proveedor D", tipoDocumento: "Jurídico", nombreEmpresa: "Empresa D", nit: "877812316", telefono: "1241297032", email: "proveedord@example.com", direccion: "Diagonal 8 # 56-78", estado: "Inactivo" },
    ]);
    

    const [search, setSearch] = useState("");
    const [modal, setModal] = useState({ open: false, type: "", proveedor: null });
    const [modalMensaje, setModalMensaje] = useState(""); // Estado para mensajes de validación
    const [confirmDelete, setConfirmDelete] = useState(null);

    const handleSearch = (e) => setSearch(e.target.value);

    const filteredProveedores = proveedores.filter(p =>
        p.nombre.toLowerCase().includes(search.toLowerCase()) ||
        p.documento.includes(search)
    );

    const openModal = (type, proveedor = null) => {
    setModal({
        open: true,
        type,
        proveedor: proveedor || {
            nombre: "",
            tipoDocumento: "Natural",
            tipoDocumentoNatural: "",
            numeroDocumento: "",
            telefono: "",
            email: "",
            direccion: "",
            estado: "Activo",
            nombreEmpresa: "",
            nit: ""
        }
    });
};


    const closeModal = () => {
        setModal({ open: false, type: "", proveedor: null });
    };

    const mostrarModal = (mensaje) => {
        setModalMensaje(mensaje);
    };

    const cerrarModalMensaje = () => {
        setModalMensaje("");
    };

    const saveProveedor = (nuevoProveedor) => {
        // Validaciones del proveedor
        if (!nuevoProveedor.nombre) {
            mostrarModal("El nombre del proveedor es obligatorio.");
            return;
        }
        if (!nuevoProveedor.documento) {
            mostrarModal("El número de documento es obligatorio.");
            return;
        }
        if (!nuevoProveedor.telefono) {
            mostrarModal("El teléfono del proveedor es obligatorio.");
            return;
        }
        if (!nuevoProveedor.email || !/\S+@\S+\.\S+/.test(nuevoProveedor.email)) {
            mostrarModal("El email del proveedor es inválido o está vacío.");
            return;
        }
        if (!nuevoProveedor.direccion) {
            mostrarModal("La dirección del proveedor es obligatoria.");
            return;
        }

        if (modal.type === "agregar") {
            setProveedores([...proveedores, nuevoProveedor]);
        } else {
            setProveedores(proveedores.map(p => (p.documento === nuevoProveedor.documento ? nuevoProveedor : p)));
        }
        closeModal();
    };

    const deleteProveedor = () => {
        setProveedores(proveedores.filter(p => p.documento !== confirmDelete.documento));
        setConfirmDelete(null);
    };

    const toggleEstado = (documento) => {
        setProveedores(proveedores.map(p =>
            p.documento === documento ? { ...p, estado: p.estado === "Activo" ? "Inactivo" : "Activo" } : p
        ));
    };

    return (
        <div className="proveedores-container">
            <NavbarAdmin />
            <div className="proveedoresContent">
                <h2 className="title-h2-Proveedores">Gestión de Proveedores</h2>

                <div className="barraBusquedaBotonAgregarProveedor">
                    <input type="text" placeholder="Buscar proveedor..." value={search} onChange={handleSearch} />
                    <button className="botonSuperiorAgregarProveedor" onClick={() => openModal("agregar")}>
                        Agregar Proveedor
                    </button>
                </div>

                <div className="tablaProveedores">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Tipo de Documento</th>
                                <th>Documento</th>
                                <th>Teléfono</th>
                                <th>Email</th>
                                <th>Dirección</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProveedores.map(proveedor => (
                                <tr key={proveedor.numeroDocumento || proveedor.nit}>
                                    <td>{proveedor.nombre || proveedor.nombreEmpresa}</td>
                                    <td>{proveedor.tipoDocumento}</td>
                                    <td>{proveedor.tipoDocumento === "Natural" ? proveedor.numeroDocumento : proveedor.nit}</td>
                                    <td>{proveedor.telefono}</td>
                                    <td>{proveedor.email}</td>
                                    <td>{proveedor.direccion}</td>
                                    <td>
                                        <label className="switch">
                                            <input type="checkbox" checked={proveedor.estado === "Activo"} onChange={() => toggleEstado(proveedor.numeroDocumento || proveedor.nit)} />
                                            <span className="slider"></span>
                                        </label>
                                    </td>
                                    <td className="iconosTablaProveedores">
                                        <button className="botonVerDetallesProveedor" onClick={() => openModal("ver", proveedor)}>
                                            <FontAwesomeIcon icon={faEye} />
                                        </button>
                                        <button className="botonEditarProveedor" onClick={() => openModal("editar", proveedor)}>
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button className="botonEliminarProveedor" onClick={() => setConfirmDelete(proveedor)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>

{/* Modal principal */}
{modal.open && (
    <div className="modal-Proveedores">
        <div className="modal-content-Proveedores">
            {modal.type === "ver" ? (
                <>
                    <h3>Detalles del Proveedor</h3>
                    <p><strong>Nombre:</strong> {modal.proveedor.nombre}</p>
                    <p><strong>Tipo de Documento:</strong> {modal.proveedor.tipoDocumento}</p>

                    {modal.proveedor.tipoDocumento === "Natural" && (
                        <>
                            <p><strong>Tipo de Documento:</strong> {modal.proveedor.tipoDocumentoNatural}</p>
                            <p><strong>Número de Documento:</strong> {modal.proveedor.numeroDocumento}</p>
                            <p><strong>Teléfono:</strong> {modal.proveedor.telefono}</p>
                        </>
                    )}

                    {modal.proveedor.tipoDocumento === "Jurídico" && (
                        <>
                            <p><strong>Nombre de la Empresa:</strong> {modal.proveedor.nombreEmpresa}</p>
                            <p><strong>NIT:</strong> {modal.proveedor.nit}</p>
                        </>
                    )}

                    <p><strong>Email:</strong> {modal.proveedor.email}</p>
                    <p><strong>Dirección:</strong> {modal.proveedor.direccion}</p>
                    <p><strong>Estado:</strong> {modal.proveedor.estado}</p>
                    <button className="botonCerrarModalVerDetallesProveedores" onClick={closeModal}>Cerrar</button>
                </>
            ) : (
                <>
                    <h3>{modal.type === "agregar" ? "Agregar Proveedor" : "Editar Proveedor"}</h3>
                    <select
                        value={modal.proveedor.tipoDocumento}
                        onChange={(e) => setModal({ ...modal, proveedor: { ...modal.proveedor, tipoDocumento: e.target.value } })}
                        className="tipo-documento-proveedor-select">
                        <option value="Natural">Natural</option>
                        <option value="Jurídico">Jurídico</option>
                    </select>

                    {/* Campos específicos según el tipo de proveedor */}
                    {modal.proveedor.tipoDocumento === "Natural" && (
                        <>
                            <div className="documento-container">
                                <input
                                    type="text"
                                    value={modal.proveedor.numeroDocumento}
                                    onChange={(e) => setModal({ ...modal, proveedor: { ...modal.proveedor, numeroDocumento: e.target.value } })}
                                    placeholder="Número de documento *"
                                    className="input-documento"
                                />
                                <select
                                    value={modal.proveedor.tipoDocumentoNatural || ""}
                                    onChange={(e) => setModal({ ...modal, proveedor: { ...modal.proveedor, tipoDocumentoNatural: e.target.value } })}
                                    className="select-tipo-documento">
                                    <option value="" disabled selected>Selecciona el documento</option>
                                    <option value="CC">Cédula de Ciudadanía</option>
                                    <option value="CE">Cédula de Extranjería</option>
                                </select>
                            </div>
                            <input
                                type="text"
                                value={modal.proveedor.nombre}
                                onChange={(e) => setModal({ ...modal, proveedor: { ...modal.proveedor, nombre: e.target.value } })}
                                placeholder="Nombre *"
                            />
                            <input
                                type="text"
                                value={modal.proveedor.telefono}
                                onChange={(e) => setModal({ ...modal, proveedor: { ...modal.proveedor, telefono: e.target.value } })}
                                placeholder="Teléfono *"
                            />
                        </>
                    )}
                        {modal.proveedor.tipoDocumento === "Jurídico" && (
                            <>
                                <input
                                    type="text"
                                    value={modal.proveedor.nombreEmpresa}
                                    onChange={(e) => setModal({ ...modal, proveedor: { ...modal.proveedor, nombreEmpresa: e.target.value } })}
                                    placeholder="Nombre de la Empresa *"
                                />
                                <input
                                    type="text"
                                    value={modal.proveedor.nit}
                                    onChange={(e) => setModal({ ...modal, proveedor: { ...modal.proveedor, nit: e.target.value } })}
                                    placeholder="NIT *"
                                />
                                <input
                                    type="text"
                                    value={modal.proveedor.telefono}
                                    onChange={(e) => setModal({ ...modal, proveedor: { ...modal.proveedor, telefono: e.target.value } })}
                                    placeholder="Teléfono *"
                                />
                            </>
                        )}
                    <input
                        type="email"
                        value={modal.proveedor.email}
                        onChange={(e) => setModal({ ...modal, proveedor: { ...modal.proveedor, email: e.target.value } })}
                        placeholder="Email *"
                    />
                    <input
                        type="text"
                        value={modal.proveedor.direccion}
                        onChange={(e) => setModal({ ...modal, proveedor: { ...modal.proveedor, direccion: e.target.value } })}
                        placeholder="Dirección *"
                    />
                    <div className="botonesGuardarCancelarAgregarEditarProveedor">
                        <button className="botonGuardarEditarProveedor" onClick={() => saveProveedor(modal.proveedor)}>Guardar</button>
                        <button className="botonCancelarEditarProveedor" onClick={closeModal}>Cancelar</button>
                    </div>
                </>
            )}
        </div>
    </div>
)}

                {/* Modal de validaciones */}
                {modalMensaje && (
                    <div className="modal-Proveedores-overlay">
                        <div className="modal-Proveedores-container">
                            <p>{modalMensaje}</p>
                            <button onClick={cerrarModalMensaje}>Cerrar</button>
                        </div>
                    </div>
                )}

                {/* Modal de confirmación para eliminar */}
                {confirmDelete && (
                    <div className="modal-Proveedores">
                        <div className="modal-content-Proveedores">
                            <h3>¿Eliminar proveedor?</h3>
                            <p>¿Estás seguro de que deseas eliminar al proveedor <strong>{confirmDelete.nombre}</strong>?</p>
                            <div className="botonesEliminarProveedor">
                                <button className="botonModalEliminarProveedor" onClick={deleteProveedor}>Eliminar</button>
                                <button className="botonModalCancelarEliminarProveedor" onClick={() => setConfirmDelete(null)}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Proveedores;
