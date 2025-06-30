import React, { useState, useEffect } from 'react';
import ProveedorForm from './ProveedorForm';
import { proveedoresService } from '../services/proveedoresService';

const ProveedorEditarModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  // Función segura para crear/resetear el estado del formulario
  const getInitialFormState = (proveedor) => ({
    idProveedor: proveedor?.idProveedor || null,
    nombre: proveedor?.nombre || '',
    tipo: proveedor?.tipo || 'Natural',
    telefono: proveedor?.telefono || '',
    correo: proveedor?.correo || '',
    direccion: proveedor?.direccion || '',
    tipoDocumento: proveedor?.tipoDocumento || 'CC',
    numeroDocumento: proveedor?.numeroDocumento || '',
    nitEmpresa: proveedor?.nitEmpresa || '',
    nombrePersonaEncargada: proveedor?.nombrePersonaEncargada || '',
    telefonoPersonaEncargada: proveedor?.telefonoPersonaEncargada || '',
    emailPersonaEncargada: proveedor?.emailPersonaEncargada || '',
    // Aseguramos que el estado sea siempre un booleano
    estado: typeof proveedor?.estado === 'boolean' ? proveedor.estado : true
  });

  const [formData, setFormData] = useState(getInitialFormState(initialData));
  const [errors, setErrors] = useState({});

  // Este es el único lugar donde se actualiza el formulario desde el exterior.
  // Se activa solo cuando el modal se abre con nuevos datos.
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData(getInitialFormState(initialData));
      setErrors({}); // Limpiar errores al abrir
    }
  }, [isOpen, initialData]);

  const handleFormChange = (name, value) => {
    // Actualiza el estado interno del modal de forma segura
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // --- TU LÓGICA DE VALIDACIÓN SE MANTIENE INTÁCTA ---

  const validateField = async (name, value) => {
    let formatError = null;
    // 1. Validaciones de formato (igual que en Crear)
    switch (name) {
      case 'nombre':
        formatError = !value.trim() ? "Este campo es obligatorio." : null;
        break;
      case 'numeroDocumento':
        if (formData.tipo === 'Natural') {
          formatError = !/^\d{7,10}$/.test(value) ? "Debe tener entre 7 y 10 dígitos." : null;
        }
        break;
      case 'nitEmpresa':
        if (formData.tipo === 'Juridico') {
          formatError = !/^\d{9}-\d$/.test(value) ? "Formato: 123456789-0." : null;
        }
        break;
      case 'telefono':
      case 'telefonoPersonaEncargada':
        formatError = !/^\d{10}$/.test(value) ? "Debe tener 10 dígitos." : null;
        break;
      case 'correo':
        formatError = !/\S+@\S+\.\S+/.test(value) ? "El formato del email no es válido." : null;
        break;
      default:
        break;
    }

    if (formatError) {
      return formatError;
    }

    // 2. Validación de unicidad contra la API
    const uniqueFields = ['correo', 'numeroDocumento', 'nitEmpresa'];
    if (uniqueFields.includes(name) && value !== initialData[name]) { // Solo validar si el valor cambió
      try {
        const idProveedorActual = initialData.idProveedor;
        const uniquenessErrors = await proveedoresService.verificarDatosUnicos({ [name]: value }, idProveedorActual);
        if (uniquenessErrors[name]) {
          return uniquenessErrors[name]; // "Este correo ya está registrado"
        }
      } catch (error) {
        console.error(`API error durante validación de ${name}:`, error);
        return "No se pudo conectar para validar.";
      }
    }
    return null;
  };
  
  const handleBlur = async (e) => {
    const { name, value } = e.target;
    if (!value || (initialData && value === initialData[name])) return;
    
    const errorMessage = await validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: errorMessage }));
  };

  const validateFormOnSubmit = async () => {
    const newErrors = {};
    const fieldsToValidate = [
        'nombre', 'telefono', 'correo', 'direccion', 
        'nombrePersonaEncargada', 'telefonoPersonaEncargada',
        ...(formData.tipo === 'Natural' ? ['numeroDocumento'] : ['nitEmpresa'])
    ];
    
    for (const field of fieldsToValidate) {
        const errorMessage = await validateField(field, formData[field]);
        if (errorMessage) {
            newErrors[field] = errorMessage;
        }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- CORRECCIÓN EN EL MANEJO DEL SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validateFormOnSubmit();
    if (isValid) {
      const datosSeguros = {
        ...formData,
        idProveedor: initialData.idProveedor 
      };
      onSubmit(datosSeguros);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-Proveedores">
      <div className="modal-content-Proveedores formulario-modal">
        <h2 className="proveedores-modal-title">Editar Proveedor</h2>
        <form onSubmit={handleSubmit} noValidate className="proveedores-form-grid">
          <ProveedorForm 
            formData={formData} 
            onFormChange={handleFormChange}
            onBlur={handleBlur}
            errors={errors}
            isEditing={true}
          />
          <div className="proveedores-form-actions">
            <button type="submit" className="proveedores-form-button-guardar">Guardar Cambios</button>
            <button type="button" className="proveedores-form-button-cancelar" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProveedorEditarModal;