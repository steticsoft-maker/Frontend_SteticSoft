// src/features/productosAdmin/components/ProductoAdminCrearModal.jsx
import React, { useState, useEffect } from "react";
import ProductoAdminForm from "./ProductoAdminForm";
import { getActiveCategoriasForSelect } from "../services/productosAdminService"; // Para las categorías

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB (Si es una constante global, impórtala)
const MAX_FILE_SIZE_MB = MAX_FILE_SIZE_BYTES / (1024 * 1024);

const ProductoAdminCrearModal = ({ isOpen, onClose, onSubmit }) => {
  const getInitialFormState = () => ({
    nombre: "",
    categoria: "", // La primera categoría disponible podría ser un mejor default si se desea
    precio: "",
    stock: "",
    descripcion: "",
    foto: null, // Para el objeto File
    fotoPreview: null, // Para la URL de previsualización (base64 o existente)
    estado: true, // Nuevos productos activos por defecto
  });

  const [formData, setFormData] = useState(getInitialFormState());
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormState()); // Resetear formulario al abrir
      setCategoriasDisponibles(getActiveCategoriasForSelect());
      setFormErrors({});
    }
  }, [isOpen]);

  const handleFormChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormErrors((prev) => ({ ...prev, foto: "" })); // Limpiar error de foto previo

    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setFormErrors((prev) => ({
          ...prev,
          foto: `La imagen debe ser menor a ${MAX_FILE_SIZE_MB}MB.`,
        }));
        setFormData((prev) => ({ ...prev, foto: null, fotoPreview: null }));
        e.target.value = null; // Limpiar el input file
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          foto: file,
          fotoPreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, foto: null, fotoPreview: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.nombre.trim()) errors.nombre = "El nombre es obligatorio.";
    if (!formData.categoria)
      errors.categoria = "Debe seleccionar una categoría.";
    if (
      !formData.precio ||
      isNaN(parseFloat(formData.precio)) ||
      parseFloat(formData.precio) <= 0
    ) {
      errors.precio = "El precio debe ser un número positivo.";
    }
    if (
      formData.stock === "" ||
      isNaN(parseInt(formData.stock)) ||
      parseInt(formData.stock) < 0
    ) {
      errors.stock = "El stock debe ser un número igual o mayor a cero.";
    }
    // La validación de foto (tamaño) ya se maneja en handleFileChange
    // No es obligatorio subir foto al crear, según el form original
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Para localStorage, guardamos la foto como base64 (fotoPreview).
    // El servicio debe saber cómo manejar esto o si espera un objeto File.
    const dataToSubmit = { ...formData, foto: formData.fotoPreview };
    delete dataToSubmit.fotoPreview; // No necesitamos el preview como tal en los datos guardados
    // ni el objeto 'File' si guardamos base64

    onSubmit(dataToSubmit);
  };

  if (!isOpen) return null;

  return (
    <div className="modalProductosAdministrador">
      {" "}
      {/* Clase de ProductosAdmin.css */}
      <div className="modal-content-ProductosAdministrador">
        {" "}
        {/* Clase de ProductosAdmin.css */}
        <h2>Agregar Producto</h2>
        <form onSubmit={handleSubmitForm}>
          {" "}
          {/* El CSS aplicará estilos si es necesario */}
          <ProductoAdminForm
            formData={formData}
            onFormChange={handleFormChange}
            onFileChange={handleFileChange}
            categoriasDisponibles={categoriasDisponibles}
            isEditing={false} // Siempre false para creación
            formErrors={formErrors}
          />
          <div className="botonesGuardarCancelarProductoAdministrador">
            {" "}
            {/* Clase de ProductosAdmin.css */}
            <button type="submit" className="botonGuardarProducto">
              Crear Producto
            </button>
            <button
              type="button"
              className="botonCancelarAgregarProducto"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductoAdminCrearModal;
