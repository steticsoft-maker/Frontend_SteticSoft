import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/NavbarAdmin";
import "./insumos.css";

const Insumos = () => {
    const [insumos, setInsumos] = useState([
        { nombre: "Shampoo", categoria: "Cuidado Capilar", cantidad: 20, precio: 15000, estado: "Activo" },
        { nombre: "Tinte Rojo", categoria: "Coloración", cantidad: 10, precio: 25000, estado: "Inactivo" },
        { nombre: "Labial", categoria: "Maquillaje", cantidad: 10, precio: 30000, estado: "Inactivo" },
        { nombre: "Crema de manos", categoria: "Cuidado Personal", cantidad: 30, precio: 40000, estado: "Inactivo" }
    ]);

    const categoriasDisponibles = ["Cuidado Capilar", "Coloración", "Maquillaje", "Cuidado Personal"];

    const [search, setSearch] = useState("");
    const [modal, setModal] = useState({ open: false, type: "", index: null });
    const [formData, setFormData] = useState({ nombre: "", categoria: "", cantidad: 0, precio: 0 });
    const [formErrors, setFormErrors] = useState({});
    const [confirmDelete, setConfirmDelete] = useState(null);

    const handleSearch = (e) => setSearch(e.target.value);

    const filteredInsumos = insumos.filter(i =>
        i.nombre.toLowerCase().includes(search.toLowerCase()) ||
        i.categoria.toLowerCase().includes(search.toLowerCase())
    );

    const openModal = (type, index = null) => {
        setModal({ open: true, type, index });
        setFormErrors({});
        if (type === "editar" && index !== null) {
            setFormData(insumos[index]);
        } else if (type === "agregar") {
            setFormData({ nombre: "", categoria: "", cantidad: 0, precio: 0 });
        }
    };

    const closeModal = () => {
        setModal({ open: false, type: "", index: null });
        setFormErrors({});
    };

    const saveInsumo = () => {
        const errors = {};
        if (!formData.nombre.trim()) errors.nombre = "El nombre es obligatorio";
        if (!formData.categoria) errors.categoria = "Seleccione una categoría";
        if (formData.cantidad <= 0) errors.cantidad = "La cantidad debe ser mayor que 0";
        if (formData.precio <= 0) errors.precio = "El precio debe ser mayor que 0";

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        if (modal.type === "agregar") {
            setInsumos([...insumos, { ...formData, estado: "Activo" }]);
        } else if (modal.type === "editar" && modal.index !== null) {
            setInsumos(insumos.map((i, idx) => (idx === modal.index ? formData : i)));
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

                <div className="acciones-barra">
                    <div className="search-bar">
                        <input
                        type="text"
                        placeholder="Buscar insumo..."
                        value={search}
                        onChange={handleSearch}
                        />
                        </div>
                        <button className="btn-agregar-insumo" onClick={() => openModal("agregar")}>
                            Agregar Insumo
                            </button>
                            </div>
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
                                        <button className="btn info" onClick={() => openModal("ver", index)}>
                                            <FontAwesomeIcon icon={faEye} />
                                        </button>
                                        <button className="btn info" onClick={() => openModal("editar", index)}>
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button className="btn danger" onClick={() => confirmDeleteInsumo(index)}>
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
                                    <form className="modal-form-grid">
                                        <div>
                                            <input
                                            type="text"
                                            value={formData.nombre}
                                            onChange={(e) => {
                                                setFormData({ ...formData, nombre: e.target.value });
                                                setFormErrors({ ...formErrors, nombre: "" });
                                            }}
                                            placeholder="Nombre *"/>
                                            {formErrors.nombre && <span className="error">{formErrors.nombre}</span>}
                                            </div>
                                            <div>
                                                <select
                                                value={formData.categoria}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, categoria: e.target.value });
                                                    setFormErrors({ ...formErrors, categoria: "" });}}>
                                                        <option className="SeleccionarCategoria" value="">Asignar categoría *</option>
                                                        {categoriasDisponibles.map((cat, idx) => (
                                                            <option key={idx} value={cat}>{cat}</option>
                                                            ))}
                                                            </select>
                                                            {formErrors.categoria && <span className="error">{formErrors.categoria}</span>}
                                                            </div>
                            <div>
                                <input
                                type="number"
                                value={formData.cantidad}
                                onChange={(e) => {
                setFormData({ ...formData, cantidad: Number(e.target.value) });
                setFormErrors({ ...formErrors, cantidad: "" });
            }}
            placeholder="Cantidad *"
        />
        {formErrors.cantidad && <span className="error">{formErrors.cantidad}</span>}
    </div>

    <div>
        <input
            type="number"
            value={formData.precio}
            onChange={(e) => {
                setFormData({ ...formData, precio: Number(e.target.value) });
                setFormErrors({ ...formErrors, precio: "" });
            }}
            placeholder="Precio *"
        />
        {formErrors.precio && <span className="error">{formErrors.precio}</span>}
    </div>

    <div className="full-width">
        <button className="btn success" type="button" onClick={saveInsumo}>Guardar</button>
        <button className="btn close" type="button" onClick={closeModal}>Cancelar</button>
    </div>
</form>
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
