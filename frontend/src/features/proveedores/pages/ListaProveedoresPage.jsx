// src/features/proveedores/pages/ListaProveedoresPage.jsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ProveedoresTable from "../components/ProveedoresTable";
import ProveedorCrearModal from "../components/ProveedorCrearModal";
import ProveedorEditarModal from "../components/ProveedorEditarModal";
import ProveedorDetalleModal from "../components/ProveedorDetalleModal";
import { proveedoresService } from "../services/proveedoresService";
import "../css/Proveedores.css";
import "../../../shared/styles/crud-common.css";
import "../../../shared/styles/table-common.css";

const MySwal = withReactContent(Swal);

function ListaProveedoresPage() {
  const [proveedores, setProveedores] = useState([]);
  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [currentProveedor, setCurrentProveedor] = useState(null);

  const cargarProveedores = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const datosRecibidos = await proveedoresService.getProveedores();
      setProveedores(datosRecibidos || []);
    } catch (err) {
      setError(err.message || "Error al cargar los proveedores.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarProveedores();
  }, [cargarProveedores]);

  const closeModal = () => {
    setIsCrearModalOpen(false);
    setIsEditarModalOpen(false);
    setIsDetailsModalOpen(false);
    setCurrentProveedor(null);
  };

  const handleOpenModal = (type, proveedor = null) => {
    setCurrentProveedor(proveedor);
    if (type === "ver") {
      setIsDetailsModalOpen(true);
    } else if (type === "create") {
      setIsCrearModalOpen(true);
    } else if (type === "edit" && proveedor) {
      setIsEditarModalOpen(true);
    } else if (type === "delete" && proveedor) {
      MySwal.fire({
        title: "¿Estás seguro?",
        text: `Deseas eliminar al proveedor "${proveedor.nombre}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, ¡eliminar!",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          handleDelete(proveedor);
        }
      });
    } else if (type === "status" && proveedor) {
      MySwal.fire({
        title: "Confirmar cambio de estado",
        text: `¿Estás seguro de que deseas ${
          proveedor.estado ? "desactivar" : "activar"
        } al proveedor "${proveedor.nombre}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: `Sí, ¡${
          proveedor.estado ? "desactivar" : "activar"
        }!`,
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          handleToggleEstado(proveedor);
        }
      });
    }
  };

  const handleSave = async (proveedorData) => {
    const idProveedorLimpio = parseInt(proveedorData.idProveedor, 10);
    const datosLimpiosParaEnviar = {
      nombre: proveedorData.nombre,
      tipo: proveedorData.tipo,
      telefono: proveedorData.telefono,
      correo: proveedorData.correo,
      direccion: proveedorData.direccion,
      tipoDocumento: proveedorData.tipoDocumento,
      numeroDocumento: proveedorData.numeroDocumento,
      nitEmpresa: proveedorData.nitEmpresa,
      nombrePersonaEncargada: proveedorData.nombrePersonaEncargada,
      telefonoPersonaEncargada: proveedorData.telefonoPersonaEncargada,
      emailPersonaEncargada: proveedorData.emailPersonaEncargada,
      estado: proveedorData.estado,
    };

    try {
      if (idProveedorLimpio) {
        await proveedoresService.updateProveedor(
          idProveedorLimpio,
          datosLimpiosParaEnviar
        );
        MySwal.fire(
          "¡Éxito!",
          "Proveedor actualizado exitosamente.",
          "success"
        );
      } else {
        await proveedoresService.createProveedor(datosLimpiosParaEnviar);
        MySwal.fire("¡Éxito!", "Proveedor creado exitosamente.", "success");
      }
      closeModal();
      await cargarProveedores();
    } catch (err) {
      const errorData = err?.response?.data || err?.data || err || {};
      let userFriendlyMessage = "Ocurrió un error inesperado.";

      if (
        errorData.errors &&
        Array.isArray(errorData.errors) &&
        errorData.errors.length > 0
      ) {
        userFriendlyMessage = errorData.errors.map((e) => e.msg).join("\n");
      } else if (errorData.message) {
        userFriendlyMessage = errorData.message;
      }
      MySwal.fire("Error", userFriendlyMessage, "error");
    }
  };

  const handleDelete = async (proveedor) => {
    try {
      await proveedoresService.deleteProveedor(proveedor.idProveedor);
      MySwal.fire("¡Eliminado!", "El proveedor ha sido eliminado.", "success");
      await cargarProveedores();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Ocurrió un error inesperado al intentar eliminar.";
      MySwal.fire("Error", errorMessage, "error");
    }
  };

  const handleToggleEstado = async (proveedorToToggle) => {
    try {
      await proveedoresService.toggleEstado(
        proveedorToToggle.idProveedor,
        !proveedorToToggle.estado
      );
      MySwal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Estado del proveedor cambiado exitosamente.",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      await cargarProveedores();
    } catch (err) {
      MySwal.fire(
        "Error",
        err.response?.data?.message || "Error al cambiar el estado.",
        "error"
      );
    }
  };

  const filteredProveedores = useMemo(() => {
    let dataFiltrada = [...proveedores];
    if (filtroEstado !== "todos") {
      const esActivo = filtroEstado === "activos";
      dataFiltrada = dataFiltrada.filter((p) => p.estado === esActivo);
    }
    const term = search.toLowerCase();
    if (term) {
      dataFiltrada = dataFiltrada.filter((p) => {
        const nombre = p.nombre || "";
        const tipoDocumento =
          p.tipo === "Natural"
            ? `${p.tipoDocumento || ""} ${p.numeroDocumento || ""}`
            : p.nitEmpresa || "";
        const telefono = p.telefono || "";
        const correo = p.correo || "";
        const direccion = p.direccion || "";
        return (
          nombre.toLowerCase().includes(term) ||
          tipoDocumento.toLowerCase().includes(term) ||
          telefono.toLowerCase().includes(term) ||
          correo.toLowerCase().includes(term) ||
          direccion.toLowerCase().includes(term)
        );
      });
    }
    return dataFiltrada;
  }, [proveedores, search, filtroEstado]);

  // ✨ Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const proveedoresPorPagina = 10;

  const totalPaginas = Math.ceil(
    filteredProveedores.length / proveedoresPorPagina
  );

  const proveedoresPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * proveedoresPorPagina;
    return filteredProveedores.slice(inicio, inicio + proveedoresPorPagina);
  }, [paginaActual, filteredProveedores]);

  const irAPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  return (
    <div className="lista-proveedores-container">
      <div className="proveedores-content-wrapper">
        <h1>Gestión de Proveedores ({filteredProveedores.length})</h1>
        <div className="proveedores-actions-bar">
          <div className="proveedores-filters">
            <div className="proveedores-search-bar">
              <input
                type="text"
                placeholder="Busca por cualquier campo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="proveedores-filtro-estado-grupo">
              <select
                className="proveedores-filtro-input"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                disabled={isLoading}
              >
                <option value="todos">Todos los Estados</option>
                <option value="activos">Activos</option>
                <option value="inactivos">Inactivos</option>
              </select>
            </div>
          </div>
          <button
            className="proveedores-add-button"
            onClick={() => handleOpenModal("create")}
            disabled={isLoading}
          >
            Agregar Proveedor
          </button>
        </div>

        {isLoading ? (
          <p style={{ textAlign: "center", margin: "20px 0" }}>
            Cargando proveedores...
          </p>
        ) : error ? (
          <p
            className="error-message"
            style={{ textAlign: "center", marginTop: "20px" }}
          >
            {error}
          </p>
        ) : (
          <div className="table-container">
            <ProveedoresTable
              proveedores={proveedoresPaginados}
              onView={(prov) => handleOpenModal("ver", prov)}
              onEdit={(prov) => handleOpenModal("edit", prov)}
              onDeleteConfirm={(prov) => handleOpenModal("delete", prov)}
              onToggleEstado={(prov) => handleOpenModal("status", prov)}
            />
          </div>
        )}

        {/* Paginación */}
        {!isLoading && totalPaginas > 1 && (
          <div className="pagination-bar">
            <button
              onClick={() => irAPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
              className="pagination-button"
            >
              ← Anterior
            </button>
            {[...Array(totalPaginas)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => irAPagina(index + 1)}
                className={`pagination-button ${
                  paginaActual === index + 1 ? "active" : ""
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => irAPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
              className="pagination-button"
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>

      <ProveedorCrearModal
        isOpen={isCrearModalOpen}
        onClose={closeModal}
        onSubmit={handleSave}
      />
      <ProveedorEditarModal
        isOpen={isEditarModalOpen}
        onClose={closeModal}
        onSubmit={handleSave}
        initialData={currentProveedor}
      />
      <ProveedorDetalleModal
        isOpen={isDetailsModalOpen}
        onClose={closeModal}
        proveedor={currentProveedor}
      />
    </div>
  );
}

export default ListaProveedoresPage;
