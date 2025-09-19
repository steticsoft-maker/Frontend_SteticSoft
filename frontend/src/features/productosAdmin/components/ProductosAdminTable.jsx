// src/features/productosAdmin/components/ProductosAdminTable.jsx
import React, { useState } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa"; // Asegúrate que FontAwesome esté instalado y configurado
import "../../../shared/styles/table-common.css";

const API_URL = import.meta.env.VITE_API_URL;

const ProductosAdminTable = ({
  productos,
  onView,
  onEdit,
  onDeleteConfirm,
  onToggleEstado,
}) => {
  const [imageErrors, setImageErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  // 🔑 Función para construir URL de imagen
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // Si ya es una URL completa (http o https)
    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    // Para rutas relativas, concatenar con API_URL
    return `${API_URL}${imagePath}`;
  };

  const handleImageError = (productoId) => {
    setImageErrors((prev) => ({ ...prev, [productoId]: true }));
  };

  const handleImageClick = (imageUrl, productoNombre) => {
    setPreviewImage({ url: imageUrl, nombre: productoNombre });
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  return (
    <>
      <div className="table-container">
        <table className="table-main">
          <thead>
            <tr>
              <th>#</th>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Existencia</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto, index) => {
              const imageUrl = getImageUrl(producto.imagen);
              const hasImageError = imageErrors[producto.idProducto];

              return (
                <tr key={producto.idProducto}>
                  <td data-label="#">{index + 1}</td>
                  <td data-label="Imagen:" className="producto-imagen-cell">
                    {imageUrl && !hasImageError ? (
                      <img
                        src={imageUrl}
                        alt={producto.nombre}
                        className="producto-tabla-imagen"
                        onError={() => handleImageError(producto.idProducto)}
                        onClick={() =>
                          handleImageClick(imageUrl, producto.nombre)
                        }
                        title="Click para ver imagen completa"
                      />
                    ) : (
                      <div className="producto-sin-imagen">
                        {hasImageError ? "❌ Error" : "📷 Sin imagen"}
                      </div>
                    )}
                  </td>
                  <td data-label="Nombre:">{producto.nombre}</td>
                  <td data-label="Categoría:">
                    {producto.categoria ? producto.categoria.nombre : "N/A"}
                  </td>
                  <td data-label="Precio:">
                    $
                    {producto.precio
                      ? producto.precio.toLocaleString("es-CO", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })
                      : "0.00"}
                  </td>
                  <td data-label="Existencia:">{producto.existencia}</td>
                  <td data-label="Estado:">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={producto.estado}
                        onChange={() => onToggleEstado(producto)}
                      />
                      <span className="slider"></span>
                    </label>
                  </td>
                  <td data-label="Acciones:">
                    <div className="table-iconos">
                      <button
                        className="table-button"
                        onClick={() => onView(producto)}
                        title="Ver Detalles"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="table-button"
                        onClick={() => onEdit(producto)}
                        title="Editar Producto"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="table-button"
                        onClick={() => onDeleteConfirm(producto)}
                        title="Eliminar Producto"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal de preview de imagen */}
      {previewImage && (
        <div className="image-preview-modal" onClick={closePreview}>
          <div
            className="image-preview-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="image-preview-close" onClick={closePreview}>
              ×
            </button>
            <h3>{previewImage.nombre}</h3>
            <img
              src={previewImage.url}
              alt={previewImage.nombre}
              className="image-preview-img"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductosAdminTable;
