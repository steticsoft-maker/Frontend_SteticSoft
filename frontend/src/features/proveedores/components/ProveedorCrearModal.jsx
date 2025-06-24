import React, { useState, useEffect } from 'react';
import ProveedorForm from './ProveedorForm';
import { proveedoresService } from '../services/proveedoresService';

const ProveedorCrearModal = ({ isOpen, onClose, onSubmit }) => {
  const getInitialFormState = () => ({
    tipo: "Natural",
    nombre: "",
    tipoDocumento: "CC",
    numeroDocumento: "",
    nitEmpresa: "",
    telefono: "",
    correo: "",
    direccion: "",
    nombrePersonaEncargada: "",
    telefonoPersonaEncargada: "",
    emailPersonaEncargada: "",
    estado: true,
  });

  const [formData, setFormData] = useState(getInitialFormState());
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormState());
      setErrors({});
    }
  }, [isOpen]);

  const handleFormChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateField = async (name, value) => {
    let formatError = null;
    switch (name) {
      case 'nombre':
        formatError = !value.trim() ? "Este campo es obligatorio." : null;
        break;
      case 'numeroDocumento':
        formatError = !/^\d{7,10}$/.test(value) ? "Debe tener entre 7 y 10 dígitos." : null;
        break;
      case 'nitEmpresa':
        formatError = !/^\d{9}-\d$/.test(value) ? "Formato: 123456789-0." : null;
        break;
      case 'telefono':
      case 'telefonoPersonaEncargada':
        formatError = !/^\d{10}$/.test(value) ? "Debe tener 10 dígitos." : null;
        break;
      case 'correo':
        formatError = !/\S+@\S+\.\S+/.test(value) ? "El formato del email no es válido." : null;
        break;
      case 'direccion':
      case 'nombrePersonaEncargada':
        formatError = !value.trim() ? "Este campo es obligatorio." : null;
        break;
      case 'emailPersonaEncargada':
        formatError = value && !/\S+@\S+\.\S+/.test(value) ? "El email del encargado no es válido." : null;
        break;
      default:
        break;
    }
    
    if (formatError) {
      return formatError;
    }

    const uniqueFields = ['correo', 'numeroDocumento', 'nitEmpresa'];
    if (uniqueFields.includes(name)) {
      try {
        const uniquenessErrors = await proveedoresService.verificarDatosUnicos({ [name]: value });
        if (uniquenessErrors[name]) {
          return uniquenessErrors[name];
        }
      } catch (error) {
        console.error(`API error during ${name} validation:`, error);
        return "No se pudo conectar con el servidor para validar.";
      }
    }
    return null;
  };
  
  const handleBlur = async (e) => {
    const { name, value } = e.target;
    if (!value.trim()) return; 
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

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const isValid = await validateFormOnSubmit();
    if (isValid) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-Proveedores">
      <div className="modal-content-Proveedores formulario-modal">
        <h2 className="proveedores-modal-title">Agregar Proveedor</h2>
        {/*
          CORRECCIÓN FINAL:
          Usamos la clase 'proveedores-form-grid' que tienes en tu CSS,
          la cual aplica 'display: grid' y crea las dos columnas.
        */}
        <form className="proveedores-form-grid" onSubmit={handleSubmitForm} noValidate>
            <ProveedorForm
              formData={formData}
              onFormChange={handleFormChange}
              onBlur={handleBlur}
              isEditing={false}
              errors={errors}
            />
            <div className="proveedores-form-actions">
                {errors.api && <p className="error-proveedores" style={{width: '100%', textAlign: 'center'}}>{errors.api}</p>}
                <button type="submit" className="proveedores-form-button-guardar">
                    Guardar Proveedor
                </button>
                <button type="button" className="proveedores-form-button-cancelar" onClick={onClose}>
                    Cancelar
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default ProveedorCrearModal;