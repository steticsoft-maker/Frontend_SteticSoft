import { useState } from "react";
import Navbar from "../../components/NavbarAdmin";
import "./proveedores.css";

const Proveedores = () => {
    const [proveedores, setProveedores] = useState([
        { nombre: "Proveedor A", nit: "123456789", telefono: "3001234567", correo: "proveedorA@example.com", estado: "Activo" },
        { nombre: "Proveedor B", nit: "987654321", telefono: "3109876543", correo: "proveedorB@example.com", estado: "Inactivo" },
        { nombre: "Proveedor C", nit: "763522321", telefono: "7835198234", correo: "proveedorc@example.com", estado: "Inactivo" },
        { nombre: "Proveedor D", nit: "877812316", telefono: "1241297032", correo: "proveedord@example.com", estado: "Inactivo" },
    ]);

    const [search, setSearch] = useState("");
    const [modal, setModal] = useState({ open: false, type: "", proveedor: null });
    const [confirmDelete, setConfirmDelete] = useState(null);

    const handleSearch = (e) => setSearch(e.target.value);

    const filteredProveedores = proveedores.filter(p =>
        p.nombre.toLowerCase().includes(search.toLowerCase()) ||
        p.nit.includes(search)
    );

    const openModal = (type, proveedor = null) => {
        setModal({ open: true, type, proveedor: proveedor || { nombre: "", nit: "", telefono: "", correo: "", estado: "Activo" } });
    };

    const closeModal = () => {
        setModal({ open: false, type: "", proveedor: null });
    };

    const saveProveedor = (nuevoProveedor) => {
        if (modal.type === "agregar") {
            setProveedores([...proveedores, nuevoProveedor]);
        } else {
            setProveedores(proveedores.map(p => (p.nit === nuevoProveedor.nit ? nuevoProveedor : p)));
        }
        closeModal();
    };

    const confirmDeleteProveedor = (nit) => setConfirmDelete(nit);

    const deleteProveedor = () => {
        setProveedores(proveedores.filter(p => p.nit !== confirmDelete));
        setConfirmDelete(null);
    };

    const toggleEstado = (nit) => {
        setProveedores(proveedores.map(p =>
            p.nit === nit ? { ...p, estado: p.estado === "Activo" ? "Inactivo" : "Activo" } : p
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

                <button className="btn success" onClick={() => openModal("agregar")}>Agregar Proveedor</button>

                <div className="proveedores-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>NIT</th>
                                <th>Teléfono</th>
                                <th>Correo</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProveedores.map(proveedor => (
                                <tr key={proveedor.nit}>
                                    <td>{proveedor.nombre}</td>
                                    <td>{proveedor.nit}</td>
                                    <td>{proveedor.telefono}</td>
                                    <td>{proveedor.correo}</td>
                                    <td>
                                        <label className="switch">
                                            <input type="checkbox" checked={proveedor.estado === "Activo"} onChange={() => toggleEstado(proveedor.nit)} />
                                            <span className="slider"></span>
                                        </label>
                                    </td>
                                    <td className="acciones">
                                        <button className="btn info" onClick={() => openModal("ver", proveedor)}>Ver</button>
                                        <button className="btn info" onClick={() => openModal("editar", proveedor)}>Editar</button>
                                        <button className="btn danger" onClick={() => confirmDeleteProveedor(proveedor.nit)}>Eliminar</button>
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
                                    <p><strong>NIT:</strong> {modal.proveedor.nit}</p>
                                    <p><strong>Teléfono:</strong> {modal.proveedor.telefono}</p>
                                    <p><strong>Correo:</strong> {modal.proveedor.correo}</p>
                                    <p><strong>Estado:</strong> {modal.proveedor.estado}</p>
                                    <button className="btn close" onClick={closeModal}>Cerrar</button>
                                </>
                            ) : (
                                <>
                                    <h3>{modal.type === "agregar" ? "Agregar Proveedor" : "Editar Proveedor"}</h3>
                                    <label>Nombre</label>
                                    <input
                                        type="text"
                                        placeholder="Nombre"
                                        value={modal.proveedor.nombre}
                                        onChange={(e) => setModal({ ...modal, proveedor: { ...modal.proveedor, nombre: e.target.value } })}
                                    />
                                    <label>NIT</label>
                                    <input
                                        type="text"
                                        placeholder="NIT"
                                        value={modal.proveedor.nit}
                                        disabled={modal.type !== "agregar"}
                                        onChange={(e) => setModal({ ...modal, proveedor: { ...modal.proveedor, nit: e.target.value } })}
                                    />
                                    <label>Teléfono</label>
                                    <input
                                        type="text"
                                        placeholder="Teléfono"
                                        value={modal.proveedor.telefono}
                                        onChange={(e) => setModal({ ...modal, proveedor: { ...modal.proveedor, telefono: e.target.value } })}
                                    />
                                    <label>Correo</label>
                                    <input
                                        type="email"
                                        placeholder="Correo"
                                        value={modal.proveedor.correo}
                                        onChange={(e) => setModal({ ...modal, proveedor: { ...modal.proveedor, correo: e.target.value } })}
                                    />
                                    <button className="btn success" onClick={() => saveProveedor(modal.proveedor)}>Guardar</button>
                                    <button className="btn close" onClick={closeModal}>Cancelar</button>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Confirmación de eliminación */}
                {confirmDelete && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>¿Eliminar Proveedor?</h3>
                            <p>Esta acción no se puede deshacer.</p>
                            <button className="btn danger" onClick={deleteProveedor}>Eliminar</button>
                            <button className="btn close" onClick={() => setConfirmDelete(null)}>Cancelar</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Proveedores;
