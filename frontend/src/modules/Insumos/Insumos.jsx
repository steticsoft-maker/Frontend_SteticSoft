import { useState } from "react";
import Navbar from "../../components/NavbarAdmin";
import "./insumos.css";

const Insumos = () => {
    const [insumos, setInsumos] = useState([
        { nombre: "Shampoo", categoria: "Cuidado Capilar", cantidad: 20, precio: 15000, estado: "Activo" },
        { nombre: "Tinte Rojo", categoria: "Coloración", cantidad: 10, precio: 25000, estado: "Inactivo" },
        { nombre: "Labial", categoria: "Maquillaje", cantidad: 10, precio: 30000, estado: "Inactivo" },
        { nombre: "Crema de manos", categoria: "Cuidado Personal", cantidad: 30, precio: 40000, estado: "Inactivo" }
    ]);

    const [search, setSearch] = useState("");
    const [modal, setModal] = useState({ open: false, type: "", index: null });
    const [confirmDelete, setConfirmDelete] = useState(null);

    const handleSearch = (e) => setSearch(e.target.value);

    const filteredInsumos = insumos.filter(i =>
        i.nombre.toLowerCase().includes(search.toLowerCase()) ||
        i.categoria.toLowerCase().includes(search.toLowerCase())
    );

    const openModal = (type, index = null) => {
        setModal({ open: true, type, index });
    };

    const closeModal = () => {
        setModal({ open: false, type: "", index: null });
    };

    const saveInsumo = (nuevoInsumo) => {
        if (modal.type === "agregar") {
            setInsumos([...insumos, nuevoInsumo]);
        } else {
            setInsumos(insumos.map((i, idx) => (idx === modal.index ? nuevoInsumo : i)));
        }
        closeModal();
    };

    const confirmDeleteInsumo = (index) => setConfirmDelete(index);

    const deleteInsumo = () => {
        setInsumos(insumos.filter((_, idx) => idx !== confirmDelete));
        setConfirmDelete(null);
    };

    const toggleEstado = (index) => {
        setInsumos(insumos.map((i, idx) =>
            idx === index ? { ...i, estado: i.estado === "Activo" ? "Inactivo" : "Activo" } : i
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
                                <th>Nombre</th>
                                <th>Categoría</th>
                                <th>Cantidad</th>
                                <th>Precio</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInsumos.map((insumo, index) => (
                                <tr key={index}>
                                    <td>{insumo.nombre}</td>
                                    <td>{insumo.categoria}</td>
                                    <td>{insumo.cantidad}</td>
                                    <td>${insumo.precio.toLocaleString()}</td>
                                    <td>
                                        <label className="switch">
                                            <input 
                                                type="checkbox" 
                                                checked={insumo.estado === "Activo"} 
                                                onChange={() => toggleEstado(index)} 
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    </td>
                                    <td className="acciones">
                                        <button className="btn info" onClick={() => openModal("ver", index)}>Ver</button>
                                        <button className="btn info" onClick={() => openModal("editar", index)}>Editar</button>
                                        <button className="btn danger" onClick={() => confirmDeleteInsumo(index)}>Eliminar</button>
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
                                    <p><strong>Nombre:</strong> {insumos[modal.index]?.nombre}</p>
                                    <p><strong>Categoría:</strong> {insumos[modal.index]?.categoria}</p>
                                    <p><strong>Cantidad:</strong> {insumos[modal.index]?.cantidad}</p>
                                    <p><strong>Precio:</strong> ${insumos[modal.index]?.precio.toLocaleString()}</p>
                                    <p><strong>Estado:</strong> {insumos[modal.index]?.estado}</p>
                                    <button className="btn close" onClick={closeModal}>Cerrar</button>
                                </>
                            ) : (
                                <>
                                    <h3>{modal.type === "agregar" ? "Agregar Insumo" : "Editar Insumo"}</h3>
                                    <label>Nombre</label>
                                    <input
                                        type="text"
                                        placeholder="Nombre"
                                        value={insumos[modal.index]?.nombre || ""}
                                        onChange={(e) => {
                                            const updated = { ...insumos[modal.index], nombre: e.target.value };
                                            setInsumos(insumos.map((i, idx) => (idx === modal.index ? updated : i)));
                                        }}
                                    />
                                    <label>Categoría</label>
                                    <input
                                        type="text"
                                        placeholder="Categoría"
                                        value={insumos[modal.index]?.categoria || ""}
                                        onChange={(e) => {
                                            const updated = { ...insumos[modal.index], categoria: e.target.value };
                                            setInsumos(insumos.map((i, idx) => (idx === modal.index ? updated : i)));
                                        }}
                                    />
                                    <label>Cantidad</label>
                                    <input
                                        type="number"
                                        placeholder="Cantidad"
                                        value={insumos[modal.index]?.cantidad || 0}
                                        onChange={(e) => {
                                            const updated = { ...insumos[modal.index], cantidad: Number(e.target.value) };
                                            setInsumos(insumos.map((i, idx) => (idx === modal.index ? updated : i)));
                                        }}
                                    />
                                    <label>Precio</label>
                                    <input
                                        type="number"
                                        placeholder="Precio"
                                        value={insumos[modal.index]?.precio || 0}
                                        onChange={(e) => {
                                            const updated = { ...insumos[modal.index], precio: Number(e.target.value) };
                                            setInsumos(insumos.map((i, idx) => (idx === modal.index ? updated : i)));
                                        }}
                                    />
                                    <button className="btn success" onClick={closeModal}>Guardar</button>
                                    <button className="btn close" onClick={closeModal}>Cancelar</button>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Confirmación de eliminación */}
                {confirmDelete !== null && (
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
