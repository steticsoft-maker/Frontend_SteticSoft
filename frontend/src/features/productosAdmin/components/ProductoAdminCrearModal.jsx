import React, { useState, useEffect } from "react";
import ProductoAdminForm from "./ProductoAdminForm";
import { productosAdminService } from "../services/productosAdminService";

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
const MAX_FILE_SIZE_MB = MAX_FILE_SIZE_BYTES / (1024 * 1024);

const ProductoAdminCrearModal = ({ isOpen, onClose, onSubmit }) => {
  const getInitialFormState = () => ({
    nombre: "",
    idCategoriaProducto: "",
    precio: "",
    existencia: "",
    stockMinimo: "",
    stockMaximo: "",
    descripcion: "",
    imagen: null,           // Objeto File
    imagenPreview: null,    // Vista previa
    estado: true,
    tipoUso: "Externo",     // ✅ valor válido por defecto
    vidaUtilDias: "",
  });

  const [formData, setFormData] = useState(getInitialFormState());
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormState());
      setFormErrors({});
      const fetchCategorias = async () => {
        try {
          const categorias = await productosAdminService.getActiveCategorias();
          setCategoriasDisponibles(categorias || []);
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

  let error = '';

  switch (name) {
    case 'nombre':
      if (!value.trim()) {
        error = 'El nombre es obligatorio.';
      } else if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
        error = 'No se permiten símbolos especiales.';
      }
      break;

    case 'idCategoriaProducto':
      if (!value) {
        error = 'Debe seleccionar una categoría.';
      }
      break;

    case 'precio':
      if (!value || isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
        error = 'El precio debe ser un número positivo.';
      }
      break;

    case 'tipoUso':
      if (!value || value.trim() === '') {
        error = 'Debes seleccionar un tipo de uso para el producto.';
      }
      break;

    case 'vidaUtilDias':
      if (value === '' || isNaN(parseInt(value)) || parseInt(value) <= 0) {
        error = 'La vida útil debe ser un número mayor a cero.';
      }
      break;

    case 'existencia':
      if (value === '' || isNaN(parseInt(value)) || parseInt(value) < 0) {
        error = 'La existencia debe ser un número igual o mayor a cero.';
      }
      break;

    case 'stockMinimo':
    case 'stockMaximo':
      const min = name === 'stockMinimo' ? Number(value) : Number(formData.stockMinimo);
      const max = name === 'stockMaximo' ? Number(value) : Number(formData.stockMaximo);
      if (
        formData.stockMinimo !== '' &&
        formData.stockMaximo !== '' &&
        !isNaN(min) &&
        !isNaN(max) &&
        max < min
      ) {
        error = 'El stock máximo no puede ser menor al mínimo.';
      }
      break;

    default:
      break;
  }

  setFormErrors((prev) => ({ ...prev, [name]: error }));
};


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormErrors((prev) => ({ ...prev, imagen: "" }));

    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setFormErrors((prev) => ({
          ...prev,
          imagen: `La imagen debe ser menor a ${MAX_FILE_SIZE_MB}MB.`,
        }));
        setFormData((prev) => ({ ...prev, imagen: null, imagenPreview: null }));
        e.target.value = null;
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          imagen: file, // ✅ objeto File real
          imagenPreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, imagen: null, imagenPreview: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.nombre.trim()) errors.nombre = "El nombre es obligatorio.";
    if (!formData.idCategoriaProducto)
      errors.idCategoriaProducto = "Debe seleccionar una categoría.";
    if (
      !formData.precio ||
      isNaN(parseFloat(formData.precio)) ||
      parseFloat(formData.precio) <= 0
    ) {
      errors.precio = "El precio debe ser un número positivo.";
    }
    if (!formData.tipoUso || formData.tipoUso.trim() === "") {
      errors.tipoUso = "Debes seleccionar un tipo de uso para el producto.";
    }
    if (
      formData.vidaUtilDias === "" ||
      isNaN(parseInt(formData.vidaUtilDias)) ||
      parseInt(formData.vidaUtilDias) <= 0
    ) {
      errors.vidaUtilDias = "La vida útil debe ser un número mayor a cero.";
    }
    if (
      formData.existencia === "" ||
      isNaN(parseInt(formData.existencia)) ||
      parseInt(formData.existencia) < 0
    ) {
      errors.existencia = "La existencia debe ser un número igual o mayor a cero.";
    }
    if (
      formData.stockMaximo &&
      formData.stockMinimo &&
      Number(formData.stockMaximo) < Number(formData.stockMinimo)
    ) {
      errors.stockMaximo = "El stock máximo no puede ser menor al mínimo.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  const dataToSubmit = {
    nombre: formData.nombre,
    descripcion: formData.descripcion || null,
    existencia: Number(formData.existencia),
    precio: Number(formData.precio),
    stockMinimo: formData.stockMinimo ? Number(formData.stockMinimo) : null,
    stockMaximo: formData.stockMaximo ? Number(formData.stockMaximo) : null,
    idCategoriaProducto: formData.idCategoriaProducto,
    estado: formData.estado,
    tipoUso: formData.tipoUso,
    vidaUtilDias: formData.vidaUtilDias ? Number(formData.vidaUtilDias) : null,
    imagen: formData.imagen,
  };

  try {
    const response = await onSubmit(dataToSubmit);

    if (response?.errors) {
      // 🔍 Mostrar errores específicos en el modal
      const mensajes = Object.entries(response.errors)
        .map(([campo, msgs]) => `${campo}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`)
        .join("\n");

      setValidationMessage(mensajes);         // 👈 Mensaje para el modal
      setIsValidationModalOpen(true);         // 👈 Abre el modal
      return;
    }

    // Si todo salió bien, cerramos el modal
    closeModal();
  } catch (err) {
    // ⚠️ Error inesperado (por ejemplo, fallo de red)
    setValidationMessage(err.message || "Error al guardar el producto.");
    setIsValidationModalOpen(true);
  }
};


  if (!isOpen) return null;

  return (
    <div className="modalProductosAdministrador">
      <div className="modal-content-ProductosAdministrador">
        <h2>Agregar Producto</h2>
        <form onSubmit={handleSubmitForm} noValidate>
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
