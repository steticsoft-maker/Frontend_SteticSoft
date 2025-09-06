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

  const handleFormChange = async (name, value) => {
  setFormData((prev) => ({ ...prev, [name]: value }));

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
  if (!error && camposUnicos.includes(name)) {
    try {
      const payload = { [name]: value };
      const idProveedor = formData.idProveedor || null;
      const response = await proveedoresService.verificarDatosUnicos(payload, idProveedor);
      if (response[name]) {
        error = response[name];
      }
    } catch (err) {
      console.error(`Error al validar ${name}:`, err);
      error = 'No se pudo validar este campo.';
    }
  }

  setErrors((prev) => ({ ...prev, [name]: error }));
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

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const isValid = await validateForm();
    if (isValid) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-Proveedores">
      <div className="modal-content-Proveedores formulario-modal">
        <h2 className="proveedores-modal-title">Agregar Proveedor</h2>
        <form className="proveedores-form-grid" onSubmit={handleSubmitForm} noValidate>
          <ProveedorForm
            formData={formData}
            onFormChange={handleFormChange}
            isEditing={false}
            errors={errors}
          />
          <div className="proveedores-form-actions">
            {errors.api && (
              <p className="error-proveedores" style={{ width: '100%', textAlign: 'center' }}>
                {errors.api}
              </p>
            )}
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
