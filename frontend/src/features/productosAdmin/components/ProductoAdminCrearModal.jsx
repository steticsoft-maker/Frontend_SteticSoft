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
      // CAMBIO: 'categoria' ahora almacenará el idCategoriaProducto
      idCategoriaProducto: "", 
      precio: "",
      // CAMBIO: Renombrado de 'stock' a 'existencia'
      existencia: "", 
      descripcion: "",
      // CAMBIO: Renombrado de 'foto' a 'imagen'
      imagen: null, 
      // CAMBIO: Renombrado de 'fotoPreview' a 'imagenPreview'
      imagenPreview: null, 
      estado: true,
    });
  
    const [formData, setFormData] = useState(getInitialFormState());
    // CAMBIO: categoriasDisponibles ahora guardará objetos { idCategoriaProducto, nombre }
    const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
    const [formErrors, setFormErrors] = useState({});
  
    // CAMBIO: Ahora la carga de categorías es asíncrona
    useEffect(() => {
      if (isOpen) {
        setFormData(getInitialFormState());
        setFormErrors({});
  
        const fetchCategorias = async () => {
          try {
            // Usamos la nueva función del servicio que debería devolver {id, nombre}
            const categorias = await productosAdminService.getActiveCategorias();
            // Aseguramos que la estructura sea {idCategoriaProducto, nombre}
            setCategoriasDisponibles(categorias.map(cat => ({
              idCategoriaProducto: cat.idCategoriaProducto, // Asegúrate de que tu servicio de categorías devuelva esto
              nombre: cat.nombre
            })));
          } catch (error) {
            console.error("Error al cargar categorías en el modal:", error);
            setCategoriasDisponibles([]);
          }
        };
  
        fetchCategorias();
      }
    }, [isOpen]);
  
    const handleFormChange = (name, value) => {
      // CAMBIO: Para la categoría, el value que viene del select será el idCategoriaProducto
      // Si el nombre es 'idCategoriaProducto', se almacena directamente el valor.
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (formErrors[name]) {
        setFormErrors((prev) => ({ ...prev, [name]: "" }));
      }
    };
  
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      // CAMBIO: Error para 'imagen'
      setFormErrors((prev) => ({ ...prev, imagen: "" }));
  
      if (file) {
        if (file.size > MAX_FILE_SIZE_BYTES) {
          setFormErrors((prev) => ({
            ...prev,
            // CAMBIO: Mensaje de error para 'imagen'
            imagen: `La imagen debe ser menor a ${MAX_FILE_SIZE_MB}MB.`,
          }));
          // CAMBIO: Nombres de campo 'imagen' y 'imagenPreview'
          setFormData((prev) => ({ ...prev, imagen: null, imagenPreview: null }));
          e.target.value = null;
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({
            ...prev,
            // CAMBIO: Nombres de campo 'imagen' y 'imagenPreview'
            imagen: file,
            imagenPreview: reader.result,
          }));
        };
        reader.readAsDataURL(file);
      } else {
        // CAMBIO: Nombres de campo 'imagen' y 'imagenPreview'
        setFormData((prev) => ({ ...prev, imagen: null, imagenPreview: null }));
      }
    };
  
    const validateForm = () => {
      const errors = {};
      if (!formData.nombre.trim()) errors.nombre = "El nombre es obligatorio.";
      // CAMBIO: Validar 'idCategoriaProducto' en lugar de 'categoria'
      if (!formData.idCategoriaProducto)
        errors.idCategoriaProducto = "Debe seleccionar una categoría.";
      if (
        !formData.precio ||
        isNaN(parseFloat(formData.precio)) ||
        parseFloat(formData.precio) <= 0
      ) {
        errors.precio = "El precio debe ser un número positivo.";
      }
      // CAMBIO: Validar 'existencia' en lugar de 'stock'
      if (
        formData.existencia === "" ||
        isNaN(parseInt(formData.existencia)) ||
        parseInt(formData.existencia) < 0
      ) {
        errors.existencia = "La existencia debe ser un número igual o mayor a cero.";
      }
      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    };
  
    const handleSubmitForm = (e) => {
      e.preventDefault();
      if (!validateForm()) return;
  
      // CAMBIO: Preparar los datos para la API con los nombres correctos
      const dataToSubmit = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        existencia: parseInt(formData.existencia), // Asegurarse de que sea número
        precio: parseFloat(formData.precio),       // Asegurarse de que sea número
        stockMinimo: parseInt(formData.stockMinimo) || 0, // Asume que ProductoAdminForm también tendrá estos campos
        stockMaximo: parseInt(formData.stockMaximo) || 0, // Asume que ProductoAdminForm también tendrá estos campos
        // CAMBIO: Enviar idCategoriaProducto al backend
        categoriaProductoId: formData.idCategoriaProducto, 
        // CAMBIO: Enviar imagenPreview (base64) como 'imagen'
        imagen: formData.imagenPreview, 
        estado: formData.estado,
      };
  
      // La función onSubmit en la página principal (ProductosAdminPage)
      // se encargará de llamar a productosAdminService.createProducto con estos datos.
      onSubmit(dataToSubmit);
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
              // CAMBIO: pasar la estructura de categorías correcta
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