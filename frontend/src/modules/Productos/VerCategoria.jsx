import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavbarAdmin from '../../components/NavbarAdmin/NavbarAdmin';
import './CategoriaProducto.css';

const VerCategoria = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categoria, setCategoria] = useState(null);

  useEffect(() => {
    const storedCategorias = localStorage.getItem("categorias");
    if (storedCategorias) {
      const categoriasArray = JSON.parse(storedCategorias);
      const foundCategoria = categoriasArray.find((cat) => cat.id === parseInt(id));
      setCategoria(foundCategoria);
    }
  }, [id]);

  const handleClose = () => {
    navigate('/categorias');
  };

  if (!categoria) {
    return (
      <div className="categorias-container">
        <NavbarAdmin />
        <div className="CategoriaProductoContent">
          <div className="centered-content-wrapper">
            <div className="modal-content-categoria-detalles">
              <h2 className="modal-title">Cargando detalles de categoría...</h2>
              <p>No se encontró la categoría con ID: {id}</p>
              <button onClick={handleClose} className="close-button-categoria-detalles">Volver a Categorías</button>
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
          <div className="modal-content-categoria-detalles">
            <h2 className="modal-title">Detalles de la Categoría</h2>
            <div className="details-section">
              <p><strong>Nombre:</strong> {categoria.nombre}</p>
              <p><strong>Descripción:</strong> {categoria.descripcion}</p>
              <p><strong>Vida Útil:</strong> {categoria.vidaUtil} días</p>
              <p><strong>Tipo de Uso:</strong> {categoria.tipoUso}</p>
              <p><strong>Estado:</strong> {categoria.estado ? "Activa" : "Inactiva"}</p>
              <p><strong>Productos:</strong> {categoria.productos && categoria.productos.length > 0 ? categoria.productos.join(", ") : "N/A"}</p>
            </div>
            <button onClick={handleClose} className="close-button-categoria-detalles">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerCategoria;