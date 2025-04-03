import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/NavbarAdmin";
import "./proveedores.css";

const Proveedores = () => {
    const [proveedores, setProveedores] = useState([
        { nombre: "Proveedor A", documento: "123456789", telefono: "3001234567", correo: "proveedorA@example.com", direccion: "Calle 1 # 23-45", estado: "Activo" },
        { nombre: "Proveedor B", documento: "987654321", telefono: "3109876543", correo: "proveedorB@example.com", direccion: "Carrera 10 # 45-67", estado: "Inactivo" },
        { nombre: "Proveedor C", documento: "763522321", telefono: "7835198234", correo: "proveedorc@example.com", direccion: "Avenida 5 # 12-34", estado: "Inactivo" },
        { nombre: "Proveedor D", documento: "877812316", telefono: "1241297032", correo: "proveedord@example.com", direccion: "Diagonal 8 # 56-78", estado: "Inactivo" },
    ]);

    const [search, setSearch] = useState("");
    const [modal, setModal] = useState({ open: false, type: "", proveedor: null });
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
            proveedor: proveedor || { nombre: "", documento: "", telefono: "", correo: "", direccion: "", estado: "Activo" } 
        });
    };

    const closeModal = () => {
        setModal({ open: false, type: "", proveedor: null });
    };

    const saveProveedor = (nuevoProveedor) => {
        if (modal.type === "agregar") {
            setProveedores([...proveedores, nuevoProveedor]);
        } else {
            setProveedores(proveedores.map(p => (p.documento === nuevoProveedor.documento ? nuevoProveedor : p)));
        }
        closeModal();
    };

    const confirmDeleteProveedor = (documento) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este proveedor?")) {
            setProveedores(proveedores.filter(p => p.documento !== documento));
        }
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

                <div className="search-bar">
                    <input type="text" placeholder="Buscar proveedor..." value={search} onChange={handleSearch} />
                </div>

                <button className="btnAgregarProveedor" onClick={() => openModal("agregar")}>Agregar Proveedor</button>

                <div className="proveedores-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Documento</th>
                                <th>Teléfono</th>
                                <th>Correo</th>
                                <th>Dirección</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProveedores.map(proveedor => (
                                <tr key={proveedor.documento}>
                                    <td>{proveedor.nombre}</td>
                                    <td>{proveedor.documento}</td>
                                    <td>{proveedor.telefono}</td>
                                    <td>{proveedor.correo}</td>
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
                                        <button className="btn danger" onClick={() => confirmDeleteProveedor(proveedor.documento)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal */}
                {modal.open && (
                    <div className="modal">
                        <div className="modal-content">
                            {modal.type === "ver" ? (
                                <>
                                    <h3>Detalles del Proveedor</h3>
                                    <p><strong>Nombre:</strong> {modal.proveedor.nombre}</p>
                                    <p><strong>Documento:</strong> {modal.proveedor.documento}</p>
                                    <p><strong>Teléfono:</strong> {modal.proveedor.telefono}</p>
                                    <p><strong>Correo:</strong> {modal.proveedor.correo}</p>
                                    <p><strong>Dirección:</strong> {modal.proveedor.direccion}</p>
                                    <p><strong>Estado:</strong> {modal.proveedor.estado}</p>
                                    <button className="btn close" onClick={closeModal}>Cerrar</button>
                                </>
                            ) : (
                                <>
                                    <h3>{modal.type === "agregar" ? "Agregar Proveedor" : "Editar Proveedor"}</h3>
                                    <input
                                        type="text"
                                        placeholder="Nombre"
                                        value={modal.proveedor.nombre}
                                        onChange={(e) => setModal({ ...modal, proveedor: { ...modal.proveedor, nombre: e.target.value } })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Documento"
                                        value={modal.proveedor.documento}
                                        disabled={modal.type !== "agregar"}
                                        onChange={(e) => setModal({ ...modal, proveedor: { ...modal.proveedor, documento: e.target.value } })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Teléfono"
                                        value={modal.proveedor.telefono}
                                        onChange={(e) => setModal({ ...modal, proveedor: { ...modal.proveedor, telefono: e.target.value } })}
                                    />
                                    <input
                                        type="email"
                                        placeholder="Correo"
                                        value={modal.proveedor.correo}
                                        onChange={(e) => setModal({ ...modal, proveedor: { ...modal.proveedor, correo: e.target.value } })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Dirección"
                                        value={modal.proveedor.direccion}
                                        onChange={(e) => setModal({ ...modal, proveedor: { ...modal.proveedor, direccion: e.target.value } })}
                                    />
                                    <button className="btn success" onClick={() => saveProveedor(modal.proveedor)}>Guardar</button>
                                    <button className="btn close" onClick={closeModal}>Cancelar</button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Proveedores;
