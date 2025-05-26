import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavbarAdmin from '../../components/NavbarAdmin/NavbarAdmin';
import './CategoriaProducto.css';

const EditarCategoria = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categoria, setCategoria] = useState(null);
  const [nombreCategoria, setNombreCategoria] = useState("");
  const [descripcionCategoria, setDescripcionCategoria] = useState("");
  const [tipoUsoCategoria, setTipoUsoCategoria] = useState("");
  const [vidaUtilCategoria, setVidaUtilCategoria] = useState("");
  const [estadoCategoria, setEstadoCategoria] = useState(true);

  
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const storedCategorias = localStorage.getItem("categorias");
    if (storedCategorias && id) {
      const categoriasArray = JSON.parse(storedCategorias);
      const foundCategoria = categoriasArray.find((cat) => cat.id === parseInt(id));
      if (foundCategoria) {
        setCategoria(foundCategoria);
        setNombreCategoria(foundCategoria.nombre);
        setDescripcionCategoria(foundCategoria.descripcion);
        setTipoUsoCategoria(foundCategoria.tipoUso || "");
        setVidaUtilCategoria(foundCategoria.vidaUtil || "");
        setEstadoCategoria(foundCategoria.estado !== undefined ? foundCategoria.estado : true);
      } else {
        alert("Categoría no encontrada.");
        navigate('/categorias');
      }
    } else if (!id) {
      navigate('/categorias');
    }
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const vidaUtil = parseInt(vidaUtilCategoria, 10);

    
    if (
      !nombreCategoria ||
      !descripcionCategoria ||
      !tipoUsoCategoria ||
      isNaN(vidaUtil) ||
      vidaUtil <= 0
    ) {
      alert(
        "Por favor, completa todos los campos obligatorios (Nombre, Descripción, Tipo de Uso, Vida Útil válida)."
      );
      return;
    }

    
    setShowConfirmModal(true);
  };

  const confirmEditCategoria = () => {
    const vidaUtil = parseInt(vidaUtilCategoria, 10);

    const storedCategorias = localStorage.getItem("categorias");
    let categorias = storedCategorias ? JSON.parse(storedCategorias) : [];

    const updatedCategoria = {
      ...categoria,
      nombre: nombreCategoria,
      descripcion: descripcionCategoria,
      tipoUso: tipoUsoCategoria,
      vidaUtil: vidaUtil,
      estado: estadoCategoria,
    };

    categorias = categorias.map(cat =>
      cat.id === updatedCategoria.id ? updatedCategoria : cat
    );

    localStorage.setItem("categorias", JSON.stringify(categorias));

    setShowConfirmModal(false);
    navigate('/categorias');
  };

  const handleCancel = () => {
    navigate('/categorias');
  };

  if (!categoria && id) {
    return (
      <div className="categorias-container">
        <NavbarAdmin />
        <div className="CategoriaProductoContent">
          <div className="centered-content-wrapper">
            <div className="modal-content-categoria-form">
              <h2 className="modal-title">Cargando categoría...</h2>
              <p>Buscando categoría con ID: {id}</p>
              <button onClick={handleCancel} className="form-button-cancelar-categoria">Volver</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!categoria && !id) {
    return (
      <div className="categorias-container">
        <NavbarAdmin />
        <div className="CategoriaProductoContent">
          <div className="centered-content-wrapper">
            <div className="modal-content-categoria-form">
              <h2 className="modal-title">Error</h2>
              <p>No se proporcionó un ID de categoría para editar.</p>
              <button onClick={handleCancel} className="form-button-cancelar-categoria">Volver</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="categorias-container">
      <NavbarAdmin />
      <div className="CategoriaProductoContent">
        <div className="centered-content-wrapper">
          <div className="modal-content-categoria-form">
            <h2 className="modal-title">Editar Categoría</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group-categoria">
                <label htmlFor="nombre" className="form-label-categoria">
                  Nombre: <span className="required-asterisk">*</span>
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="Nombre de la categoría"
                  value={nombreCategoria}
                  onChange={(e) => setNombreCategoria(e.target.value)}
                  className="form-input-categoria"
                  required
                />
              </div>

              <div className="form-group-categoria">
                <label
                  htmlFor="descripcion"
                  className="form-label-categoria"
                >
                  Descripción: <span className="required-asterisk">*</span>
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  placeholder="Descripción de la categoría"
                  value={descripcionCategoria}
                  onChange={(e) => setDescripcionCategoria(e.target.value)}
                  className="form-textarea-categoria"
                  required
                ></textarea>
              </div>

              <div className="form-group-categoria">
                <label htmlFor="vidaUtil" className="form-label-categoria">
                  Vida Útil (días):{" "}
                  <span className="required-asterisk">*</span>
                </label>
                <input
                  type="number"
                  id="vidaUtil"
                  name="vidaUtil"
                  placeholder="Ej: 365"
                  value={vidaUtilCategoria}
                  onChange={(e) => setVidaUtilCategoria(e.target.value)}
                  className="form-input-categoria"
                  required
                  min="1"
                />
              </div>

              <div className="form-group-categoria">
                <label htmlFor="tipoUso" className="form-label-categoria">
                  Tipo de Uso: <span className="required-asterisk">*</span>
                </label>
                <select
                  id="tipoUso"
                  name="tipoUso"
                  value={tipoUsoCategoria}
                  onChange={(e) => setTipoUsoCategoria(e.target.value)}
                  className="form-select-categoria"
                  required
                >
                  <option value="">Seleccione el tipo de uso</option>
                  <option value="Interno(Uso)">Interno (Uso)</option>
                  <option value="Externo(Venta)">Externo (Venta)</option>
                </select>
              </div>

              <div className="form-group-categoria" style={{ flexDirection: 'row', alignItems: 'center' }}>
                <label htmlFor="estado" className="form-label-categoria" style={{ marginBottom: 0, marginRight: '10px' }}>Estado:</label>
                <label className="switch">
                  <input
                    type="checkbox"
                    id="estado"
                    name="estado"
                    checked={estadoCategoria}
                    onChange={(e) => setEstadoCategoria(e.target.checked)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>

              <div className="form-actions-categoria">
                <button
                  type="submit"
                  className="form-button-guardar-categoria"
                >
                  Guardar Cambios
                </button>
                <button
                  type="button"
                  className="form-button-cancelar-categoria"
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      
      {showConfirmModal && (
        <div className="modal-compras">
          <div className="modal-content-compras">
            <h2>Confirmar Edición</h2>
            <p>¿Está seguro de que desea guardar los cambios en esta categoría?</p>
            <div className="modal-compras-buttons-anular">
              <button
                className="botonConfirmarAnularCompra"
                onClick={confirmEditCategoria}
              >
                Sí, guardar
              </button>
              <button
                className="botonCerrarModalAnularCompra"
                onClick={() => setShowConfirmModal(false)}
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

export default EditarCategoria;