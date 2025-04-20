import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/NavbarAdmin";
import "./proveedores.css";

const Proveedores = () => {
    const [proveedores, setProveedores] = useState([
        { nombre: "Proveedor A", tipoDocumento: "Natural", documento: "123456789", telefono: "3001234567", email: "proveedorA@example.com", direccion: "Calle 1 # 23-45", estado: "Activo" },
        { nombre: "Proveedor B", tipoDocumento: "Jurídico", documento: "987654321", telefono: "3109876543", email: "proveedorB@example.com", direccion: "Carrera 10 # 45-67", estado: "Inactivo" },
        { nombre: "Proveedor C", tipoDocumento: "Natural", documento: "763522321", telefono: "7835198234", email: "proveedorc@example.com", direccion: "Avenida 5 # 12-34", estado: "Inactivo" },
        { nombre: "Proveedor D", tipoDocumento: "Jurídico", documento: "877812316", telefono: "1241297032", email: "proveedord@example.com", direccion: "Diagonal 8 # 56-78", estado: "Inactivo" },
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
            proveedor: proveedor || { nombre: "", tipoDocumento: "Natural", documento: "", telefono: "", email: "", direccion: "", estado: "Activo" }
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
            <Navbar />
            <div className="proveedores-content">
                <h2 className="title-h2">Gestión de Proveedores</h2>

                <div className="top-bar">
                    <input type="text" placeholder="Buscar proveedor..." value={search} onChange={handleSearch} />
                    <button className="btnAgregarProveedor" onClick={() => openModal("agregar")}>
                        Agregar Proveedor
                    </button>
                </div>

                <div className="proveedores-table">
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
                                <tr key={proveedor.documento}>
                                    <td>{proveedor.nombre}</td>
                                    <td>{proveedor.tipoDocumento}</td>
                                    <td>{proveedor.documento}</td>
                                    <td>{proveedor.telefono}</td>
                                    <td>{proveedor.email}</td>
                                    <td>{proveedor.direccion}</td>
                                    <td>
                                        <label className="switch">
                                            <input type="checkbox" checked={proveedor.estado === "Activo"} onChange={() => toggleEstado(proveedor.documento)} />
                                            <span className="slider"></span>
                                        </label>
                                    </td>
                                    <td className="acciones">
                                        <button className="btnVer" onClick={() => openModal("ver", proveedor)}>
                                            <FontAwesomeIcon icon={faEye} />
                                        </button>
                                        <button className="btnEditar" onClick={() => openModal("editar", proveedor)}>
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button className="btn danger" onClick={() => setConfirmDelete(proveedor)}>
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
                    <div className="modal">
                        <div className="modal-content">
                            {modal.type === "ver" ? (
                                <>
                                    <h3>Detalles del Proveedor</h3>
                                    <p><strong>Nombre:</strong> {modal.proveedor.nombre}</p>
                                    <p><strong>Tipo de Documento:</strong> {modal.proveedor.tipoDocumento}</p>
                                    <p><strong>Documento:</strong> {modal.proveedor.documento}</p>
                                    <p><strong>Teléfono:</strong> {modal.proveedor.telefono}</p>
                                    <p><strong>Email:</strong> {modal.proveedor.email}</p>
                                    <p><strong>Dirección:</strong> {modal.proveedor.direccion}</p>
                                    <p><strong>Estado:</strong> {modal.proveedor.estado}</p>
                                    <button className="btn close cerrar" onClick={closeModal}>Cerrar</button>
                                </>
                            ) : (
                                <>
                                    <h3>{modal.type === "agregar" ? "Agregar Proveedor" : "Editar Proveedor"}</h3>

                                    <input
                                        type="text"
                                        value={modal.proveedor.nombre}
                                        onChange={(e) => setModal({ ...modal, proveedor: { ...modal.proveedor, nombre: e.target.value } })}
                                        placeholder="Nombre *"
                                    />

                                    <div className="documento-input-wrapper">
                                        <select
                                            value={modal.proveedor.tipoDocumento}
                                            onChange={(e) => setModal({ ...modal, proveedor: { ...modal.proveedor, tipoDocumento: e.target.value } })}
                                            className="tipo-documento-select">
                                            <option value="Natural">Natural</option>
                                            <option value="Jurídico">Jurídico</option>
                                        </select>
                                        <input
                                            type="text"
                                            value={modal.proveedor.documento}
                                            onChange={(e) => setModal({ ...modal, proveedor: { ...modal.proveedor, documento: e.target.value } })}
                                            placeholder="Número de documento *"
                                        />
                                    </div>

                                    <input
                                        type="text"
                                        value={modal.proveedor.telefono}
                                        onChange={(e) => setModal({ ...modal, proveedor: { ...modal.proveedor, telefono: e.target.value } })}
                                        placeholder="Teléfono *"
                                    />

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

<div className="btn-Editar-Proveedor">
                                        <button className="btn success" onClick={() => saveProveedor(modal.proveedor)}>Guardar</button>
                                        <button className="btn close" onClick={closeModal}>Cancelar</button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Modal de validaciones */}
                {modalMensaje && (
                    <div className="modal-overlay">
                        <div className="modal-container">
                            <p>{modalMensaje}</p>
                            <button onClick={cerrarModalMensaje}>Cerrar</button>
                        </div>
                    </div>
                )}

                {/* Modal de confirmación para eliminar */}
                {confirmDelete && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>¿Eliminar proveedor?</h3>
                            <p>¿Estás seguro de que deseas eliminar al proveedor <strong>{confirmDelete.nombre}</strong>?</p>
                            <div className="btn-container">
                                <button className="btn danger" onClick={deleteProveedor}>Eliminar</button>
                                <button className="btnCancelar" onClick={() => setConfirmDelete(null)}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Proveedores;
