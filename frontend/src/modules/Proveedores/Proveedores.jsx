import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import NavbarAdmin from "../../components/NavbarAdmin/NavbarAdmin";
import "./proveedores.css";

const Proveedores = () => {
    const [proveedores, setProveedores] = useState([
        {
            nombre: "Proveedor Ejemplo Ana", tipoDocumento: "Natural", tipoDocumentoNatural: "CC", numeroDocumento: "123456789", telefono: "3001234567", email: "ana@example.com", direccion: "Calle Falsa 123", estado: "Activo",
            personaEncargadaNombre: "Laura Paz", personaEncargadaTelefono: "3001112233", personaEncargadaEmail: "laura.paz@example.com"
        },
        {
            nombre: "Constructora XYZ S.A.S", tipoDocumento: "Jurídico", nombreEmpresa: "Constructora XYZ S.A.S", nit: "900123456-7", telefono: "3109876543", email: "contacto@constructoraxyz.com", direccion: "Carrera Inventada # 45-67", estado: "Inactivo",
            personaEncargadaNombre: "Carlos Gerente", personaEncargadaTelefono: "3101112233", personaEncargadaEmail: "carlos.gerente@constructoraxyz.com"
        },
        // ... más proveedores de ejemplo
    ]);

    const [search, setSearch] = useState("");
    const [modal, setModal] = useState({ open: false, type: "", proveedor: null });
    const [modalMensaje, setModalMensaje] = useState("");
    const [confirmDelete, setConfirmDelete] = useState(null);

    const handleSearch = (e) => setSearch(e.target.value);

    const filteredProveedores = proveedores.filter(p => {
        const displayName = p.tipoDocumento === "Natural" ? p.nombre : p.nombreEmpresa;
        const documentId = p.tipoDocumento === "Natural" ? p.numeroDocumento : p.nit;

        return (displayName && displayName.toLowerCase().includes(search.toLowerCase())) ||
               (documentId && documentId.toLowerCase().includes(search.toLowerCase()));
    });

    const openModal = (type, proveedor = null) => {
        setModal({
            open: true,
            type,
            proveedor: proveedor || {
                nombre: "",
                tipoDocumento: "Natural",
                tipoDocumentoNatural: "CC",
                numeroDocumento: "",
                telefono: "",
                email: "",
                direccion: "",
                estado: "Activo", // Estado por defecto para nuevos, no editable en el form
                nombreEmpresa: "",
                nit: "",
                personaEncargadaNombre: "",
                personaEncargadaTelefono: "",
                personaEncargadaEmail: ""
            }
        });
    };

    const closeModal = () => {
        setModal({ open: false, type: "", proveedor: null });
        setModalMensaje("");
    };

    const mostrarModal = (mensaje) => {
        setModalMensaje(mensaje);
    };

    const cerrarModalMensaje = () => {
        setModalMensaje("");
    };

    const saveProveedor = (proveedorActual) => {
        // Validaciones
        if (proveedorActual.tipoDocumento === "Natural") {
            if (!proveedorActual.nombre) { mostrarModal("El nombre (Natural) es obligatorio."); return; }
            if (!proveedorActual.tipoDocumentoNatural) { mostrarModal("El tipo de documento (Natural) es obligatorio."); return; }
            if (!proveedorActual.numeroDocumento) { mostrarModal("El número de documento (Natural) es obligatorio."); return; }
        } else if (proveedorActual.tipoDocumento === "Jurídico") {
            if (!proveedorActual.nombreEmpresa) { mostrarModal("El nombre de la empresa es obligatorio."); return; }
            if (!proveedorActual.nit) { mostrarModal("El NIT es obligatorio."); return; }
        }
        if (!proveedorActual.telefono) { mostrarModal("El teléfono principal es obligatorio."); return; }
        if (!proveedorActual.email || !/\S+@\S+\.\S+/.test(proveedorActual.email)) { mostrarModal("El email principal es inválido o vacío."); return; }
        if (!proveedorActual.direccion) { mostrarModal("La dirección es obligatoria."); return; }

        // *** INICIO: Validaciones para Persona Encargada (Nombre y Teléfono Obligatorios) ***

        if (!proveedorActual.personaEncargadaNombre) {
            mostrarModal("El nombre de la persona encargada es obligatorio.");
            return; // Detiene el proceso si falla
        }

        if (!proveedorActual.personaEncargadaTelefono) {
            mostrarModal("El teléfono de la persona encargada es obligatorio.");
            return; // Detiene el proceso si falla
        }

        // Validar email persona encargada SOLO si se ingresó un valor (sigue siendo opcional el email)
        if (proveedorActual.personaEncargadaEmail && !/\S+@\S+\.\S+/.test(proveedorActual.personaEncargadaEmail)) {
            mostrarModal("El email de la persona encargada es inválido.");
            return; // Detiene el proceso si falla
        }

        // Puedes añadir validaciones básicas para formato de teléfono si es necesario.


        // *** FIN: Validaciones para Persona Encargada ***


        if (modal.type === "agregar") {
            const existe = proveedores.some(p =>
                (p.tipoDocumento === "Natural" && proveedorActual.tipoDocumento === "Natural" && p.numeroDocumento === proveedorActual.numeroDocumento && p.tipoDocumentoNatural === proveedorActual.tipoDocumentoNatural) ||
                (p.tipoDocumento === "Jurídico" && proveedorActual.tipoDocumento === "Jurídico" && p.nit === proveedorActual.nit)
            );
            if (existe) {
                mostrarModal("Ya existe un proveedor con ese tipo y número de documento/NIT.");
                return;
            }
            setProveedores([...proveedores, proveedorActual]);
        } else { // Editar
            const originalProvider = modal.proveedor;
             // Lógica para evitar duplicados al editar si se cambian los identificadores principales
            const otrosProveedores = proveedores.filter(p => {
                if (originalProvider.tipoDocumento === "Natural" && p.tipoDocumento === "Natural") {
                    return !(p.numeroDocumento === originalProvider.numeroDocumento && p.tipoDocumentoNatural === originalProvider.tipoDocumentoNatural);
                } else if (originalProvider.tipoDocumento === "Jurídico" && p.tipoDocumento === "Jurídico") {
                    return p.nit !== originalProvider.nit;
                }
                return true;
            });

            const existeEnOtros = otrosProveedores.some(p =>
                (p.tipoDocumento === "Natural" && proveedorActual.tipoDocumento === "Natural" && p.numeroDocumento === proveedorActual.numeroDocumento && proveedorActual.tipoDocumentoNatural && p.tipoDocumentoNatural === proveedorActual.tipoDocumentoNatural) ||
                (p.tipoDocumento === "Jurídico" && proveedorActual.tipoDocumento === "Jurídico" && p.nit === proveedorActual.nit)
            );


            if (existeEnOtros) {
                mostrarModal("Los cambios generarían un proveedor duplicado con otro existente (mismo tipo y número de documento/NIT).");
                return;
            }

            setProveedores(proveedores.map(p => {
                // Ajuste en la lógica de identificación para edición para manejar ambos tipos correctamente
                let isMatch = false;
                if (originalProvider.tipoDocumento === "Natural" && p.tipoDocumento === "Natural") {
                    isMatch = (p.numeroDocumento === originalProvider.numeroDocumento && p.tipoDocumentoNatural === originalProvider.tipoDocumentoNatural);
                } else if (originalProvider.tipoDocumento === "Jurídico" && p.tipoDocumento === "Jurídico") {
                    isMatch = (p.nit === originalProvider.nit);
                }

                if (isMatch) {
                     // Antes de retornar proveedorActual, aseguramos que las propiedades del proveedor original que no están en el form (como estado) se mantengan
                     return { ...proveedorActual, estado: p.estado };
                }
                return p;
            }));
        }
        closeModal();
    };

    const deleteProveedor = () => {
        if (!confirmDelete) return;
        setProveedores(proveedores.filter(p => {
            if (confirmDelete.tipoDocumento === "Natural" && p.tipoDocumento === "Natural") {
                return !(p.numeroDocumento === confirmDelete.numeroDocumento && p.tipoDocumentoNatural === confirmDelete.tipoDocumentoNatural);
            } else if (confirmDelete.tipoDocumento === "Jurídico" && p.tipoDocumento === "Jurídico") {
                return p.nit !== confirmDelete.nit;
            }
            return true;
        }));
        setConfirmDelete(null);
    };

    const toggleEstado = (proveedorAActualizar) => {
        setProveedores(proveedores.map(p => {
            let match = false;
            if (proveedorAActualizar.tipoDocumento === "Natural" && p.tipoDocumento === "Natural" && p.numeroDocumento === proveedorAActualizar.numeroDocumento && p.tipoDocumentoNatural === proveedorAActualizar.tipoDocumentoNatural) {
                match = true;
            } else if (proveedorAActualizar.tipoDocumento === "Jurídico" && p.tipoDocumento === "Jurídico" && p.nit === proveedorAActualizar.nit) {
                match = true;
            }
            if (match) {
                return { ...p, estado: p.estado === "Activo" ? "Inactivo" : "Activo" };
            }
            return p;
        }));
    };

    return (
        <div className="proveedores-container">
            <NavbarAdmin />
            <div className="proveedoresContent">
                <h2 className="title-h2-Proveedores">Gestión de Proveedores</h2>

                <div className="barraBusquedaBotonAgregarProveedor">
                    <input type="text" placeholder="Buscar por nombre o documento..." value={search} onChange={handleSearch} />
                    <button className="botonSuperiorAgregarProveedor" onClick={() => openModal("agregar")}>
                        Agregar Proveedor
                    </button>
                </div>

                <div className="tablaProveedores">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre empresa</th>
                                <th>Tipo Doc.</th>
                                {/* Eliminada la columna "Documento / NIT" */}
                                <th>Teléfono</th>
                                <th>Email</th>
                                <th>Dirección</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProveedores.map(proveedor => {
                                const idKey = proveedor.tipoDocumento === "Natural" ? `${proveedor.tipoDocumentoNatural}-${proveedor.numeroDocumento}` : proveedor.nit;
                                return (
                                    <tr key={idKey}>
                                        <td>{proveedor.tipoDocumento === "Natural" ? proveedor.nombre : proveedor.nombreEmpresa}</td>
                                        <td>{proveedor.tipoDocumento === "Natural" ? proveedor.tipoDocumentoNatural : "NIT"}</td>
                                        {/* Eliminada la celda de datos "Documento / NIT" */}
                                        <td>{proveedor.telefono}</td>
                                        <td>{proveedor.email}</td>
                                        <td>{proveedor.direccion}</td>
                                        <td>
                                            <label className="switch">
                                                <input type="checkbox" checked={proveedor.estado === "Activo"} onChange={() => toggleEstado(proveedor)} />
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
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {modal.open && (
                    <div className="modal-Proveedores">
                        <div className="modal-content-Proveedores">
                            {modal.type === "ver" ? (
                                <>
                                    <h3>Detalles del Proveedor</h3>
                                    {modal.proveedor.tipoDocumento === "Natural" ? (
                                        <>
                                            <p><strong>Nombre:</strong> {modal.proveedor.nombre}</p>
                                            <p><strong>Tipo de Documento:</strong> {modal.proveedor.tipoDocumentoNatural}</p>
                                            <p><strong>Número de Documento:</strong> {modal.proveedor.numeroDocumento}</p>
                                        </>
                                    ) : (
                                        <>
                                            {/* Aquí se sigue mostrando "Razón Social" para la vista de detalles si es necesario,
                                                o podrías cambiarlo también a "Nombre de la Empresa" si lo prefieres */}
                                            <p><strong>Razón Social:</strong> {modal.proveedor.nombreEmpresa}</p>
                                            <p><strong>NIT:</strong> {modal.proveedor.nit}</p>
                                        </>
                                    )}
                                    <p><strong>Teléfono Principal:</strong> {modal.proveedor.telefono}</p>
                                    <p><strong>Email Principal:</strong> {modal.proveedor.email}</p>
                                    <p><strong>Dirección:</strong> {modal.proveedor.direccion}</p>
                                    <p><strong>Estado:</strong> {modal.proveedor.estado}</p>

                                    {(modal.proveedor.personaEncargadaNombre || modal.proveedor.personaEncargadaTelefono || modal.proveedor.personaEncargadaEmail) && (
                                        <>
                                            <h4 className="modal-subtitle-proveedores">Datos de la Persona Encargada</h4>
                                            {modal.proveedor.personaEncargadaNombre && <p><strong>Nombre:</strong> {modal.proveedor.personaEncargadaNombre}</p>}
                                            {modal.proveedor.personaEncargadaTelefono && <p><strong>Teléfono:</strong> {modal.proveedor.personaEncargadaTelefono}</p>}
                                            {modal.proveedor.personaEncargadaEmail && <p><strong>Email:</strong> {modal.proveedor.personaEncargadaEmail}</p>}
                                        </>
                                    )}
                                    <button className="botonCerrarModalVerDetallesProveedores" onClick={closeModal}>Cerrar</button>
                                </>
                            ) : ( // Formulario para Agregar o Editar
                                <>
                                    <h3>{modal.type === "agregar" ? "Agregar Proveedor" : "Editar Proveedor"}</h3>
                                    <label>Tipo de Proveedor:</label>
                                    <select
                                        value={modal.proveedor.tipoDocumento}
                                        onChange={(e) => {
                                            const newType = e.target.value;
                                            setModal({
                                                ...modal,
                                                proveedor: {
                                                    ...modal.proveedor,
                                                    tipoDocumento: newType,
                                                    // Reiniciar campos específicos del tipo anterior al cambiar
                                                    tipoDocumentoNatural: newType === "Natural" ? (modal.proveedor.tipoDocumentoNatural || "CC") : "",
                                                    nombre: newType === "Jurídico" ? "" : modal.proveedor.nombre,
                                                    nombreEmpresa: newType === "Natural" ? "" : modal.proveedor.nombreEmpresa,
                                                    numeroDocumento: newType === "Jurídico" ? "" : modal.proveedor.numeroDocumento,
                                                    nit: newType === "Natural" ? "" : modal.proveedor.nit,
                                                    // También podrías querer limpiar los campos de persona encargada al cambiar de tipo si son muy dependientes.
                                                    // personaEncargadaNombre: "",
                                                    // personaEncargadaTelefono: "",
                                                    // personaEncargadaEmail: ""
                                                }
                                            });
                                        }}
                                        className="tipo-documento-proveedor-select">
                                        <option value="Natural">Natural</option>
                                        <option value="Jurídico">Jurídico</option>
                                    </select>

                                    {modal.proveedor.tipoDocumento === "Natural" && (
                                        <>
                                            <label>Documento de Identidad:</label>
                                            {/* Contenedor para agrupar visualmente select e input */}
                                            <div className="documento-container">
                                                <select
                                                    value={modal.proveedor.tipoDocumentoNatural || ""}
                                                    onChange={(e) => setModal({ ...modal, proveedor: { ...modal.proveedor, tipoDocumentoNatural: e.target.value } })}
                                                    className="select-tipo-documento"
                                                >
                                                    <option value="" disabled>Tipo*</option>
                                                    <option value="CC">CC</option>
                                                    <option value="CE">CE</option>
                                                </select>
                                                <input
                                                    type="text"
                                                    value={modal.proveedor.numeroDocumento || ""}
                                                    onChange={(e) => setModal({ ...modal, proveedor: { ...modal.proveedor, numeroDocumento: e.target.value } })}
                                                    placeholder="Número de documento *"
                                                    className="input-documento"
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                value={modal.proveedor.nombre || ""}
                                                onChange={(e) => setModal({ ...modal, proveedor: { ...modal.proveedor, nombre: e.target.value } })}
                                                placeholder="Nombre Completo *"
                                            />
                                        </>
                                    )}
                                    {modal.proveedor.tipoDocumento === "Jurídico" && (
                                        <>
                                            <input
                                                type="text"
                                                value={modal.proveedor.nombreEmpresa || ""}
                                                onChange={(e) => setModal({ ...modal, proveedor: { ...modal.proveedor, nombreEmpresa: e.target.value } })}
                                                placeholder="Nombre de la Empresa *" // <-- Modificado aquí
                                            />
                                            <input
                                                type="text"
                                                value={modal.proveedor.nit || ""}
                                                onChange={(e) => setModal({ ...modal, proveedor: { ...modal.proveedor, nit: e.target.value } })}
                                                placeholder="NIT (Ej: 900123456-7) *"
                                            />
                                        </>
                                    )}

                                    <input
                                        type="tel"
                                        value={modal.proveedor.telefono || ""}
                                        onChange={(e) => setModal({ ...modal, proveedor: { ...modal.proveedor, telefono: e.target.value } })}
                                        placeholder="Teléfono Principal *"
                                    />
                                    <input
                                        type="email"
                                        value={modal.proveedor.email || ""}
                                        onChange={(e) => setModal({ ...modal, proveedor: { ...modal.proveedor, email: e.target.value } })}
                                        placeholder="Email Principal *"
                                    />
                                    <input
                                        type="text"
                                        value={modal.proveedor.direccion || ""}
                                        onChange={(e) => setModal({ ...modal, proveedor: { ...modal.proveedor, direccion: e.target.value } })}
                                        placeholder="Dirección *"
                                    />

                                    <h4 className="modal-subtitle-proveedores">Datos de la Persona Encargada</h4>
                                    <input
                                        type="text"
                                        value={modal.proveedor.personaEncargadaNombre || ""}
                                        onChange={(e) => setModal({ ...modal, proveedor: { ...modal.proveedor, personaEncargadaNombre: e.target.value } })}
                                        placeholder="Nombre persona encargada *" // Añadido asterisco visual
                                    />
                                    <input
                                        type="tel"
                                        value={modal.proveedor.personaEncargadaTelefono || ""}
                                        onChange={(e) => setModal({ ...modal, proveedor: { ...modal.proveedor, personaEncargadaTelefono: e.target.value } })}
                                        placeholder="Teléfono persona encargada *" // Añadido asterisco visual
                                    />
                                    <input
                                        type="email"
                                        value={modal.proveedor.personaEncargadaEmail || ""}
                                        onChange={(e) => setModal({ ...modal, proveedor: { ...modal.proveedor, personaEncargadaEmail: e.target.value } })}
                                        placeholder="Email persona encargada"
                                    />

                                    {/* El campo Estado ha sido eliminado del formulario */}

                                    <div className="botonesGuardarCancelarAgregarEditarProveedor">
                                        <button className="botonGuardarEditarProveedor" onClick={() => saveProveedor(modal.proveedor)}>Guardar</button>
                                        <button className="botonCancelarEditarProveedor" onClick={closeModal}>Cancelar</button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {modalMensaje && (
                    <div className="modal-Proveedores-overlay-message">
                        <div className="modal-Proveedores-container-message">
                            <p>{modalMensaje}</p>
                            <button onClick={cerrarModalMensaje}>Entendido</button>
                        </div>
                    </div>
                )}

                {confirmDelete && (
                    <div className="modal-Proveedores">
                        <div className="modal-content-Proveedores">
                            <h3>¿Eliminar proveedor?</h3>
                            <p>¿Estás seguro de que deseas eliminar al proveedor <strong>{confirmDelete.tipoDocumento === 'Natural' ? confirmDelete.nombre : confirmDelete.nombreEmpresa}</strong>?</p>
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