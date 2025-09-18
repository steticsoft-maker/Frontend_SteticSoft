import React, { useState, useEffect } from 'react';
import ProveedorForm from './ProveedorForm';
import { proveedoresService } from '../services/proveedoresService';
import '../../../shared/styles/admin-layout.css';

const ProveedorEditarModal = ({ isOpen, onClose, onSubmit, initialData }) => {
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
    estado: typeof proveedor?.estado === 'boolean' ? proveedor.estado : true
  });

  const [formData, setFormData] = useState(getInitialFormState(initialData));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData(getInitialFormState(initialData));
      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleFormChange = async (name, value) => {
  setFormData(prev => ({ ...prev, [name]: value }));

  let error = '';

  switch (name) {
    case 'nombre':
      if (!value.trim()) {
        error = 'El nombre es obligatorio.';
      } else if (value.length < 3) {
        error = 'Debe tener al menos 3 caracteres.';
      } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value)) {
        error = 'Solo se permiten letras y espacios.';
      }
      break;

    case 'numeroDocumento':
      if (formData.tipo === 'Natural') {
        if (!value.trim()) {
          error = 'El número de documento es obligatorio.';
        } else if (!/^\d{7,10}$/.test(value)) {
          error = 'Debe tener entre 7 y 10 dígitos.';
        }
      }
      break;

    case 'nitEmpresa':
      if (formData.tipo === 'Juridico') {
        if (!value.trim()) {
          error = 'El NIT es obligatorio.';
        } else if (!/^\d{9}-\d$/.test(value)) {
          error = 'Formato inválido. Ejemplo: 123456789-0.';
        }
      }
      break;

    case 'telefono':
    case 'telefonoPersonaEncargada':
      if (!value.trim()) {
        error = 'El teléfono es obligatorio.';
      } else if (!/^\d{10}$/.test(value)) {
        error = 'Debe tener exactamente 10 dígitos.';
      }
      break;

    case 'correo':
    case 'emailPersonaEncargada':
      if (!value.trim()) {
        error = 'El email es obligatorio.';
      } else if (/\s/.test(value)) {
        error = 'No se permiten espacios.';
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        error = 'El formato del email no es válido.';
      }
      break;

    case 'direccion':
      if (!value.trim()) {
        error = 'La dirección es obligatoria.';
      } else if (value.length < 5) {
        error = 'Debe tener al menos 5 caracteres.';
      } else if (
        !/^(Calle|Cl\.?|Carrera|Cra\.?|Avenida|Av\.?|Transversal|Tv\.?|Diagonal|Dg\.?|Circular|Cir\.?|Kilómetro|Km\.?)\s+[A-Za-z0-9]+(?:\s+#\s*[A-Za-z0-9]+(?:\s*-\s*[A-Za-z0-9]+)?)?$/i.test(value)
      ) {
        error = 'Debe iniciar con un tipo de vía válido seguido de número y numeral.';
      }
      break;

    case 'nombrePersonaEncargada':
      if (!value.trim()) {
        error = 'El nombre del encargado es obligatorio.';
      } else if (value.length < 3) {
        error = 'Debe tener al menos 3 caracteres.';
      } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value)) {
        error = 'Solo se permiten letras y espacios.';
      }
      break;

    default:
      break;
  }

  const camposUnicos = ['correo', 'numeroDocumento', 'nitEmpresa'];
  if (
    !error &&
    camposUnicos.includes(name) &&
    value !== initialData[name]
  ) {
    try {
      const response = await proveedoresService.verificarDatosUnicos(
        { [name]: value },
        initialData.idProveedor
      );
      if (response[name]) {
        error = response[name];
      }
    } catch (err) {
      console.error(`Error al validar ${name}:`, err);
      error = 'No se pudo validar este campo.';
    }
  }

  setErrors(prev => ({ ...prev, [name]: error }));
};


  const validateForm = async () => {
    const newErrors = {};
    const fieldsToValidate = [
      'nombre', 'telefono', 'correo', 'direccion',
      'nombrePersonaEncargada', 'telefonoPersonaEncargada', 'emailPersonaEncargada',
      ...(formData.tipo === 'Natural' ? ['numeroDocumento'] : ['nitEmpresa'])
    ];

    for (const field of fieldsToValidate) {
      await handleFormChange(field, formData[field]);
      if (errors[field]) {
        newErrors[field] = errors[field];
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validateForm();
    if (isValid) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-content large">
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">Editar Proveedor</h2>
          <button
            type="button"
            className="admin-modal-close"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="admin-modal-body">
          <form onSubmit={handleSubmit} noValidate>
            <ProveedorForm 
              formData={formData} 
              onFormChange={handleFormChange}
              errors={errors}
              isEditing={true}
            />
            {errors.api && (
              <p className="admin-form-error" style={{ width: '100%', textAlign: 'center' }}>
                {errors.api}
              </p>
            )}
          </form>
        </div>
        <div className="admin-modal-footer">
          <button type="submit" className="admin-form-button" form="proveedor-form">
            Guardar Cambios
          </button>
          <button
            type="button"
            className="admin-form-button secondary"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProveedorEditarModal;
