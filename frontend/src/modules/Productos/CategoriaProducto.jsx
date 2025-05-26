import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import NavbarAdmin from "../../components/NavbarAdmin/NavbarAdmin";
import "./CategoriaProducto.css";
import { useNavigate } from "react-router-dom";

const CategoriaProducto = () => {
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();

  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  useEffect(() => {
    
    const storedCategorias = localStorage.getItem("categorias");
    if (storedCategorias) {
      setCategorias(JSON.parse(storedCategorias));
    }
  }, []);

  
  const handleDeleteCategoria = (id) => {
    setIdToDelete(id);
    setShowDeleteModal(true);
  };

  
  const confirmDeleteCategoria = () => {
    if (idToDelete !== null) {
      const storedCategorias = localStorage.getItem("categorias");
      let currentCategorias = storedCategorias ? JSON.parse(storedCategorias) : [];
      const updatedCategorias = currentCategorias.filter((cat) => cat.id !== idToDelete);
      localStorage.setItem("categorias", JSON.stringify(updatedCategorias));
      setCategorias(updatedCategorias); // Actualizar el estado local

      
      setShowDeleteModal(false);
      setIdToDelete(null);
      
    }
  };

  const toggleEstado = (id) => {
    const storedCategorias = localStorage.getItem("categorias");
    let currentCategorias = storedCategorias ? JSON.parse(storedCategorias) : [];

    const updatedCategorias = currentCategorias.map((cat) =>
      cat.id === id ? { ...cat, estado: !cat.estado } : cat
    );
    localStorage.setItem("categorias", JSON.stringify(updatedCategorias));
    setCategorias(updatedCategorias); // Actualizar el estado local
  };

  const filteredCategorias = categorias.filter(
    (categoria) =>
      categoria.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      categoria.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      categoria.tipoUso.toLowerCase().includes(busqueda.toLowerCase()) ||
      categoria.vidaUtil.toString().includes(busqueda.toLowerCase())
  );

  return (
    <div className="categorias-container">
      <NavbarAdmin />
      <div className="CategoriaProductoContent">
        <h1>Gestión Categorías de Productos</h1>
        <div className="BarraBusquedaBotonAgregarCategoriaProductos">
          <input
            type="text"
            placeholder="Buscar categoría (Nombre, Descripción, Tipo Uso, Vida Útil)..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="inputBarraBusquedaCategoriaProductos"
          />
          <button
            className="botonAgregarCategoriaProducto"
            onClick={() => navigate('/categorias/crear')}
          >
            Agregar Categoría
          </button>
        </div>
        <table className="tablaCategoriaProductos">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Vida Útil</th>
              <th>Tipo de Uso</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategorias.map((categoria) => (
              <tr key={categoria.id}>
                <td>{categoria.nombre}</td>
                <td>{categoria.descripcion}</td>
                <td>{categoria.vidaUtil} días</td>
                <td>{categoria.tipoUso}</td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={categoria.estado}
                      onChange={() => toggleEstado(categoria.id)}
                    />
                    <span className="slider round"></span>
                  </label>
                </td>
                <td>
                  <button
                    className="table-action-button-categoria"
                    onClick={() => navigate(`/categorias/ver/${categoria.id}`)}
                  >
                    <FaEye />
                  </button>
                  <button
                    className="table-action-button-categoria"
                    onClick={() => navigate(`/categorias/editar/${categoria.id}`)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="table-action-button-categoria"
                    onClick={() => handleDeleteCategoria(categoria.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      {showDeleteModal && (
        <div className="modal-compras">
          <div className="modal-content-compras">
            <h2>Confirmar Eliminación</h2>
            <p>¿Está seguro de que desea **eliminar permanentemente** esta categoría?</p>
            <div className="modal-compras-buttons-anular">
              <button
                className="botonConfirmarAnularCompra"
                onClick={confirmDeleteCategoria}
              >
                Sí, eliminar
              </button>
              <button
                className="botonCerrarModalAnularCompra"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriaProducto;