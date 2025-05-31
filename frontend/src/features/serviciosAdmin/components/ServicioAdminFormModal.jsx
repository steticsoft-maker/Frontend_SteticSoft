// src/features/serviciosAdmin/components/ServicioAdminFormModal.jsx
import React, { useState, useEffect } from "react";
import ServicioAdminForm from "./ServicioAdminForm"; // Usaremos el nuevo ServicioAdminForm que crearemos después
import { getActiveCategoriasServicioForSelect } from "../services/serviciosAdminService"; // Para las categorías

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB (Mantenemos tu constante)
const MAX_FILE_SIZE_MB = MAX_FILE_SIZE_BYTES / (1024 * 1024);

const ServicioAdminFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  modalType,
}) => {
  // console.log('[ServicioAdminFormModal] RECONSTRUIDO - Props:', { isOpen, modalType, initialData }); // Log para nueva versión

  const isEditing = modalType === "edit";
  // console.log('[ServicioAdminFormModal] RECONSTRUIDO - isEditing:', isEditing); // Log para nueva versión

  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    categoria: "",
    descripcion: "",
    imagen: null, // Para el objeto File
    imagenURL: "", // Para la previsualización o URL existente
    estado: "Activo", // Default para creación
  });
  const [formErrors, setFormErrors] = useState({}); // Errores de validación del formulario
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);

  useEffect(() => {
    // console.log('[ServicioAdminFormModal] RECONSTRUIDO - useEffect, isOpen:', isOpen, 'isEditing:', isEditing);
    if (isOpen) {
      setCategoriasDisponibles(getActiveCategoriasServicioForSelect());
      if (isEditing && initialData) {
        // console.log('[ServicioAdminFormModal] RECONSTRUIDO - Cargando initialData para edición:', initialData);
        setFormData({
          id: initialData.id, // Mantener el ID si se está editando
          nombre: initialData.nombre || "",
          precio: initialData.precio?.toString() || "", // Precio como string para el input
          categoria: initialData.categoria || "",
          descripcion: initialData.descripcion || "",
          imagen: null, // El input de archivo no se puede pre-llenar directamente con un objeto File
          imagenURL: initialData.imagenURL || "", // Usar la URL existente para previsualización
          estado: initialData.estado || "Activo", // Asegurar que el estado se cargue
        });
      } else {
        // console.log('[ServicioAdminFormModal] RECONSTRUIDO - Reseteando para creación');
        setFormData({
          nombre: "",
          precio: "",
          categoria: "",
          descripcion: "",
          imagen: null,
          imagenURL: "",
          estado: "Activo",
        });
      }
      setFormErrors({}); // Limpiar errores cada vez que el modal se abre/refresca
    }
  }, [isOpen, initialData, isEditing, modalType]); // Dependencias clave

  const handleFormChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prevErr) => ({ ...prevErr, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormErrors((prevErr) => ({ ...prevErr, imagen: "" })); // Limpiar error de imagen previo

    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setFormErrors((prevErr) => ({
          ...prevErr,
          imagen: `La imagen debe ser menor a ${MAX_FILE_SIZE_MB}MB.`,
        }));
        // Revertir a la imagenURL anterior si existe (en edición), o a nada.
        setFormData((prev) => ({
          ...prev,
          imagen: null,
          imagenURL: (isEditing && initialData?.imagenURL) || "",
        }));
        e.target.value = null; // Limpiar el input file
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          imagen: file,
          imagenURL: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      // Si se deselecciona el archivo
      setFormData((prev) => ({
        ...prev,
        imagen: null,
        imagenURL: (isEditing && initialData?.imagenURL) || "", // Revertir a la imagenURL anterior si existe (en edición)
      }));
    }
  };

  const validateForm = () => {
    // Función de validación simple
    const errors = {};
    if (!formData.nombre.trim()) errors.nombre = "El nombre es obligatorio.";
    if (
      !formData.precio ||
      isNaN(parseFloat(formData.precio)) ||
      parseFloat(formData.precio) <= 0
    ) {
      errors.precio = "El precio debe ser un número positivo.";
    }
    // La validación de la categoría podría ser: if (!formData.categoria) errors.categoria = "Debe seleccionar una categoría.";
    // La validación de imagen (tamaño) ya se maneja en handleFileChange.
    // Puedes añadir más validaciones aquí si es necesario.
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    // El servicio `saveServicioAdmin` ahora espera `formData` y `currentServicio` (que contiene el ID si es edición)
    // No necesitamos pasar `allServicios` como en Usuarios.
    // La imagen se manejará: `imagenURL` se pasa para la data, `imagen` (File) podría usarse para subida real.
    // Para localStorage, `imagenURL` (base64) es lo que se guarda.
    onSubmit(formData); // La página contenedora (ListaServiciosAdminPage) se encarga de llamar a saveServicioAdmin
  };

  if (!isOpen) return null;

  return (
    <div className="modalServicio">
      {" "}
      {/* Clases de ServiciosAdmin.css */}
      <div className="modal-content-Servicio formulario">
        <h3>{isEditing ? "Editar Servicio" : "Agregar Servicio"}</h3>
        <form className="modal-Servicio-form-grid" onSubmit={handleSubmitForm}>
          <ServicioAdminForm
            formData={formData}
            onFormChange={handleFormChange}
            onFileChange={handleFileChange} // Para el input de imagen
            categoriasDisponibles={categoriasDisponibles}
            isEditing={isEditing}
            formErrors={formErrors} // Pasar errores al formulario hijo
          />
          <div className="servicios-admin-form-actions">
            {" "}
            {/* Clases de botones consistentes */}
            <button className="servicios-admin-button-guardar" type="submit">
              {isEditing ? "Actualizar Servicio" : "Crear Servicio"}
            </button>
            <button
              className="servicios-admin-button-cancelar"
              type="button"
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

export default ServicioAdminFormModal;
