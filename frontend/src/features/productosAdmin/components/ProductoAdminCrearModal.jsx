import React, { useState, useEffect } from "react";
import ProductoAdminForm from "./ProductoAdminForm";
import { productosAdminService } from "../services/productosAdminService";

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
const MAX_FILE_SIZE_MB = MAX_FILE_SIZE_BYTES / (1024 * 1024);

const ProductoAdminCrearModal = ({ isOpen, onClose, onSubmit }) => {
  const getInitialFormState = () => ({
    nombre: "",
    idCategoriaProducto: "", // Correcto
    precio: "",
    existencia: "",
    stockMinimo: "",
    stockMaximo: "",
    descripcion: "",
    imagen: null, // Contendrá el objeto File
    imagenPreview: null, // Contendrá la URL para la vista previa
    estado: true,
    tipoUso: "Venta", // Ajustado a 'Venta' para coincidir con el validador
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
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
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
          imagen: file, // Guardamos el objeto File
          imagenPreview: reader.result, // Guardamos la URL para la vista previa
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
    if (
      formData.existencia === "" ||
      isNaN(parseInt(formData.existencia)) ||
      parseInt(formData.existencia) < 0
    ) {
      errors.existencia =
        "La existencia debe ser un número igual o mayor a cero.";
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

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // --- INICIO DE LA CORRECCIÓN FINAL ---
    const dataToSubmit = {
      nombre: formData.nombre,
      descripcion: formData.descripcion || null,
      existencia: Number(formData.existencia),
      precio: Number(formData.precio),
      stockMinimo: formData.stockMinimo ? Number(formData.stockMinimo) : null,
      stockMaximo: formData.stockMaximo ? Number(formData.stockMaximo) : null,
      // 1. El backend espera 'idCategoriaProducto', no 'categoriaProductoId'
      idCategoriaProducto: formData.idCategoriaProducto,
      // 2. El backend espera el archivo real ('imagen'), no la vista previa ('imagenPreview')
      imagen: formData.imagen,
      estado: formData.estado,
      tipoUso: formData.tipoUso,
      vidaUtilDias: formData.vidaUtilDias
        ? Number(formData.vidaUtilDias)
        : null,
    };
    // --- FIN DE LA CORRECCIÓN FINAL ---

    onSubmit(dataToSubmit);
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
