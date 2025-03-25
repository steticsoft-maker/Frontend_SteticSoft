import { useState } from "react";
import Navbar from "../../components/NavbarAdmin";
import "./insumos.css";

const Insumos = () => {
    const [insumos, setInsumos] = useState([
        { id: 1, nombre: "Shampoo", categoria: "Cuidado Capilar", cantidad: 20, precio: 15000, estado: "Activo" },
        { id: 2, nombre: "Tinte Rojo", categoria: "Coloración", cantidad: 10, precio: 25000, estado: "Inactivo" },
        { id: 3, nombre: "labial", categoria: "maquillaje", cantidad: 10, precio: 30000, estado: "Inactivo" },
        { id: 4, nombre: "crema de manos", categoria: "cuidado personal", cantidad: 30, precio: 40000, estado: "Inactivo" }
    ]);

    const [search, setSearch] = useState("");
    const [modal, setModal] = useState({ open: false, type: "", insumo: null });
    const [confirmDelete, setConfirmDelete] = useState(null);

    const handleSearch = (e) => setSearch(e.target.value);

    const filteredInsumos = insumos.filter(i =>
        i.nombre.toLowerCase().includes(search.toLowerCase()) ||
        i.categoria.toLowerCase().includes(search.toLowerCase())
    );

    const openModal = (type, insumo = null) => {
        setModal({ open: true, type, insumo: insumo || { id: Date.now(), nombre: "", categoria: "", cantidad: 0, precio: 0 } });
    };

    const closeModal = () => {
        setModal({ open: false, type: "", insumo: null });
    };

    const saveInsumo = (nuevoInsumo) => {
        if (modal.type === "agregar") {
            setInsumos([...insumos, nuevoInsumo]);
        } else {
            setInsumos(insumos.map(i => (i.id === nuevoInsumo.id ? nuevoInsumo : i)));
        }
        closeModal();
    };

    const confirmDeleteInsumo = (id) => setConfirmDelete(id);

    const deleteInsumo = () => {
        setInsumos(insumos.filter(i => i.id !== confirmDelete));
        setConfirmDelete(null);
    };

    const toggleEstado = (id) => {
        setInsumos(insumos.map(i =>
            i.id === id ? { ...i, estado: i.estado === "Activo" ? "Inactivo" : "Activo" } : i
        ));
    };

    return (
        <div className="insumos-container">
            <Navbar />
            <div className="insumos-content">
                <h2 className="title-h2">Gestión de Insumos</h2>

                <div className="search-bar">
                    <input type="text" placeholder="Buscar insumo..." value={search} onChange={handleSearch} />
                </div>

                <button className="btn success" onClick={() => openModal("agregar")}>Agregar Insumo</button>

                <div className="insumos-table">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Categoría</th>
                                <th>Cantidad</th>
                                <th>Precio</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInsumos.map(insumo => (
                                <tr key={insumo.id}>
                                    <td>{insumo.id}</td>
                                    <td>{insumo.nombre}</td>
                                    <td>{insumo.categoria}</td>
                                    <td>{insumo.cantidad}</td>
                                    <td>${insumo.precio.toLocaleString()}</td>
                                    <td>
                                        <span className={`estado ${insumo.estado.toLowerCase()}`}>
                                            {insumo.estado}
                                        </span>
                                    </td>
                                    <td className="acciones">
                                        <button className="btn info" onClick={() => openModal("ver", insumo)}>Ver</button>
                                        <button className="btn warning" onClick={() => openModal("editar", insumo)}>Editar</button>
                                        <button className="btn danger" onClick={() => confirmDeleteInsumo(insumo.id)}>Eliminar</button>
                                        <button className="btn" onClick={() => toggleEstado(insumo.id)}>
                                            {insumo.estado === "Activo" ? "Desactivar" : "Activar"}
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
                                    <h3>Detalles del Insumo</h3>
                                    <p><strong>ID:</strong> {modal.insumo.id}</p>
                                    <p><strong>Nombre:</strong> {modal.insumo.nombre}</p>
                                    <p><strong>Categoría:</strong> {modal.insumo.categoria}</p>
                                    <p><strong>Cantidad:</strong> {modal.insumo.cantidad}</p>
                                    <p><strong>Precio:</strong> ${modal.insumo.precio.toLocaleString()}</p>
                                    <p><strong>Estado:</strong> {modal.insumo.estado}</p>
                                    <button className="btn close" onClick={closeModal}>Cerrar</button>
                                </>
                            ) : (
                                <>
                                    <h3>{modal.type === "agregar" ? "Agregar Insumo" : "Editar Insumo"}</h3>
                                    <label>ID</label>
                                    <input
                                        type="text"
                                        value={modal.insumo.id}
                                        disabled
                                    />
                                    <label>Nombre</label>
                                    <input
                                        type="text"
                                        placeholder="Nombre"
                                        value={modal.insumo.nombre}
                                        onChange={(e) => setModal({ ...modal, insumo: { ...modal.insumo, nombre: e.target.value } })}
                                    />
                                    <label>Categoría</label>
                                    <input
                                        type="text"
                                        placeholder="Categoría"
                                        value={modal.insumo.categoria}
                                        onChange={(e) => setModal({ ...modal, insumo: { ...modal.insumo, categoria: e.target.value } })}
                                    />
                                    <label>Cantidad</label>
                                    <input
                                        type="number"
                                        placeholder="Cantidad"
                                        value={modal.insumo.cantidad}
                                        onChange={(e) => setModal({ ...modal, insumo: { ...modal.insumo, cantidad: Number(e.target.value) } })}
                                    />
                                    <label>Precio</label>
                                    <input
                                        type="number"
                                        placeholder="Precio"
                                        value={modal.insumo.precio}
                                        onChange={(e) => setModal({ ...modal, insumo: { ...modal.insumo, precio: Number(e.target.value) } })}
                                    />
                                    <button className="btn success" onClick={closeModal}>Guardar</button>
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
                            <h3>¿Eliminar Insumo?</h3>
                            <p>Esta acción no se puede deshacer.</p>
                            <button className="btn danger" onClick={deleteInsumo}>Eliminar</button>
                            <button className="btn close" onClick={() => setConfirmDelete(null)}>Cancelar</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Insumos;
