// src/features/productosAdmin/components/ProductoAdminCrearModal.jsx
import React, { useState, useEffect } from "react";
import ProductoAdminForm from "./ProductoAdminForm";
// CAMBIO: Importamos el objeto del servicio, no la función suelta
import { productosAdminService } from "../services/productosAdminService";

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
const MAX_FILE_SIZE_MB = MAX_FILE_SIZE_BYTES / (1024 * 1024);

const ProductoAdminCrearModal = ({ isOpen, onClose, onSubmit }) => {
  const getInitialFormState = () => ({
    nombre: "",
    categoria: "",
    precio: "",
    stock: "",
    descripcion: "",
    foto: null,
    fotoPreview: null,
    estado: true,
  });

  const [formData, setFormData] = useState(getInitialFormState());
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  // CAMBIO: Ahora la carga de categorías es asíncrona
  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormState());
      setFormErrors({});
      
      const fetchCategorias = async () => {
        try {
          // Usamos la nueva función del servicio
          const categorias = await productosAdminService.getActiveCategorias();
          setCategoriasDisponibles(categorias);
        } catch (error) {
          console.error("Error al cargar categorías en el modal:", error);
          setCategoriasDisponibles([]);
        }
      };

      fetchCategorias();
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
    setFormErrors((prev) => ({ ...prev, foto: "" }));

    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setFormErrors((prev) => ({
          ...prev,
          foto: `La imagen debe ser menor a ${MAX_FILE_SIZE_MB}MB.`,
        }));
        setFormData((prev) => ({ ...prev, foto: null, fotoPreview: null }));
        e.target.value = null;
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
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    // CAMBIO: Preparar los datos para la API
    // El servicio real de la API espera los datos correctos
    const dataToSubmit = {
      ...formData,
      foto: formData.fotoPreview // La API podría esperar la imagen en base64
    };
    delete dataToSubmit.fotoPreview;

    onSubmit(dataToSubmit); // onSubmit en la página principal se encargará de llamar a productosAdminService.createProducto
  };

  if (!isOpen) return null;

  return (
    <div className="modalProductosAdministrador">
      <div className="modal-content-ProductosAdministrador">
        <h2>Agregar Producto</h2>
        <form onSubmit={handleSubmitForm}>
          <ProductoAdminForm
            formData={formData}
            onFormChange={handleFormChange}
            onFileChange={handleFileChange}
            categoriasDisponibles={categoriasDisponibles}
            isEditing={false}
            formErrors={formErrors}
          />
          <div className="botonesGuardarCancelarProductoAdministrador">
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