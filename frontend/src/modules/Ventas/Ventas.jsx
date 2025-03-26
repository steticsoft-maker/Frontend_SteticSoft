import { useState } from "react";
import Navbar from "../../components/NavbarAdmin";
import "./ventas.css";

const Ventas = () => {
    const [ventas, setVentas] = useState([
        { id: 1, cliente: "Juan Pérez", total: 50000, tipo: "Directa", fecha: "2025-03-25", estado: "Activa" },
        { id: 2, cliente: "Ana Gómez", total: 75000, tipo: "Indirecta", fecha: "2025-03-24", estado: "Anulada" }
    ]);

    const [search, setSearch] = useState("");
    const [modal, setModal] = useState({ open: false, type: "", venta: null });
    const [confirmAnular, setConfirmAnular] = useState(null);

    const handleSearch = (e) => setSearch(e.target.value);

    const filteredVentas = ventas.filter(v =>
        v.cliente.toLowerCase().includes(search.toLowerCase()) ||
        v.tipo.toLowerCase().includes(search.toLowerCase())
    );

    const openModal = (type, venta = null) => {
        setModal({ 
            open: true, 
            type, 
            venta: venta || { id: Date.now(), cliente: "", total: 0, tipo: "", fecha: new Date().toISOString().split("T")[0], estado: "Activa" }
        });
    };

    const closeModal = () => setModal({ open: false, type: "", venta: null });

    const saveVenta = (nuevaVenta) => {
        if (modal.type === "agregar") {
            setVentas([...ventas, nuevaVenta]);
        } else {
            setVentas(ventas.map(v => (v.id === nuevaVenta.id ? nuevaVenta : v)));
        }
        closeModal();
    };

    const confirmAnularVenta = (id) => setConfirmAnular(id);

    const anularVenta = () => {
        setVentas(ventas.map(v => v.id === confirmAnular ? { ...v, estado: "Anulada" } : v));
        setConfirmAnular(null);
    };

    const generarPDF = (venta) => {
        alert(`Generando PDF para la venta de ${venta.cliente}...`);
    };

    return (
        <div className="ventas-container">
            <Navbar />
            <div className="ventas-content">
                <h2 className="title-h2">Gestión de Ventas</h2>

                <div className="search-bar">
                    <input type="text" placeholder="Buscar venta..." value={search} onChange={handleSearch} />
                </div>

                <button className="btn success" onClick={() => openModal("agregar")}>Agregar Venta</button>

                <div className="ventas-table">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Cliente</th>
                                <th>Total</th>
                                <th>Tipo</th>
                                <th>Fecha</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVentas.map(venta => (
                                <tr key={venta.id}>
                                    <td>{venta.id}</td>
                                    <td>{venta.cliente}</td>
                                    <td>${venta.total.toLocaleString()}</td>
                                    <td>{venta.tipo}</td>
                                    <td>{venta.fecha}</td>
                                    <td>
                                        <span className={`estado ${venta.estado.toLowerCase()}`}>
                                            {venta.estado}
                                        </span>
                                    </td>
                                    <td className="acciones">
                                        <button className="btn info" onClick={() => openModal("ver", venta)}>Ver</button>
                                        <button className="btn danger" onClick={() => confirmAnularVenta(venta.id)}>Anular</button>
                                        <button className="btn pdf" onClick={() => generarPDF(venta)}>Generar PDF</button>
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
                                    <h3>Detalles de la Venta</h3>
                                    <p><strong>ID:</strong> {modal.venta.id}</p>
                                    <p><strong>Cliente:</strong> {modal.venta.cliente}</p>
                                    <p><strong>Total:</strong> ${modal.venta.total.toLocaleString()}</p>
                                    <p><strong>Tipo:</strong> {modal.venta.tipo}</p>
                                    <p><strong>Fecha:</strong> {modal.venta.fecha}</p>
                                    <p><strong>Estado:</strong> {modal.venta.estado}</p>
                                    <button className="btn close" onClick={closeModal}>Cerrar</button>
                                </>
                            ) : (
                                <>
                                    <h3>{modal.type === "agregar" ? "Agregar Venta" : "Editar Venta"}</h3>
                                    <label>ID</label>
                                    <input type="text" value={modal.venta.id} disabled />

                                    <label>Cliente</label>
                                    <input type="text" placeholder="Cliente" value={modal.venta.cliente} 
                                        onChange={(e) => setModal({ ...modal, venta: { ...modal.venta, cliente: e.target.value } })} />

                                    <label>Total</label>
                                    <input type="number" placeholder="Total" value={modal.venta.total} 
                                        onChange={(e) => setModal({ ...modal, venta: { ...modal.venta, total: Number(e.target.value) } })} />

                                    <label>Fecha</label>
                                    <input type="date" value={modal.venta.fecha} 
                                        onChange={(e) => setModal({ ...modal, venta: { ...modal.venta, fecha: e.target.value } })} />

                                    <label>Tipo</label>
                                    <div className="tipo-venta">
                                        <button className={`btn ${modal.venta.tipo === "Directa" ? "selected" : ""}`} 
                                            onClick={() => setModal({ ...modal, venta: { ...modal.venta, tipo: "Directa" } })}>
                                            Venta Directa
                                        </button>
                                        <button className={`btn ${modal.venta.tipo === "Indirecta" ? "selected" : ""}`} 
                                            onClick={() => setModal({ ...modal, venta: { ...modal.venta, tipo: "Indirecta" } })}>
                                            Venta Indirecta
                                        </button>
                                    </div>

                                    <button className="btn success" onClick={() => saveVenta(modal.venta)}>Guardar</button>
                                    <button className="btn close" onClick={closeModal}>Cancelar</button>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Confirmación de anulación */}
                {confirmAnular && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>¿Anular Venta?</h3>
                            <p>Esta acción no se puede deshacer.</p>
                            <button className="btn danger" onClick={anularVenta}>Anular</button>
                            <button className="btn close" onClick={() => setConfirmAnular(null)}>Cancelar</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Ventas;
