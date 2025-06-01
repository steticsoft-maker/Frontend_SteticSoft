// src/features/abastecimiento/components/AbastecimientoCrearModal.jsx
import React, { useState, useEffect } from 'react';
import AbastecimientoForm from './AbastecimientoForm';
import ItemSelectionModal from './ItemSelectionModal';
import { getCategorias, getProductosDisponibles, getEmpleados } from '../services/abastecimientoService';

const AbastecimientoCrearModal = ({ isOpen, onClose, onSubmit }) => {
  const getInitialFormState = () => ({
    nombre: '',      // Nombre del producto seleccionado
    category: '',    // Categoría seleccionada
    empleado: '',    // Empleado seleccionado
    cantidad: '',    // Cantidad ingresada
    // Los demás campos como fechaIngreso, isDepleted, etc., se manejan en el servicio o no aplican para creación directa aquí
  });

  const [formData, setFormData] = useState(getInitialFormState());
  const [formErrors, setFormErrors] = useState({});

  const [showCategorySelectModal, setShowCategorySelectModal] = useState(false);
  const [showProductSelectModal, setShowProductSelectModal] = useState(false);
  const [showEmployeeSelectModal, setShowEmployeeSelectModal] = useState(false);

  // Cargar datos para los selectores (se hace una vez o cuando cambien las dependencias)
  const [categorias, setCategorias] = useState([]);
  const [todosProductos, setTodosProductos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [productosFiltradosPorCategoria, setProductosFiltradosPorCategoria] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // Cargar datos para los modales de selección
      setCategorias(getCategorias());
      const prods = getProductosDisponibles();
      setTodosProductos(prods);
      setProductosFiltradosPorCategoria(prods); // Mostrar todos al inicio
      setEmpleados(getEmpleados());
      
      setFormData(getInitialFormState()); // Resetear formulario al abrir
      setFormErrors({});
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.category) {
      setProductosFiltradosPorCategoria(todosProductos.filter(p => p.category === formData.category));
    } else {
      // Si no hay categoría seleccionada (o se limpia), mostrar todos los productos
      setProductosFiltradosPorCategoria(todosProductos);
    }
  }, [formData.category, todosProductos]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) { // Limpiar error si el campo cambia
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    if (!formData.category) errors.category = "Debe seleccionar una categoría.";
    if (!formData.nombre) errors.nombre = "Debe seleccionar un producto.";
    if (!formData.empleado) errors.empleado = "Debe seleccionar un empleado.";
    if (!formData.cantidad || isNaN(parseInt(formData.cantidad)) || parseInt(formData.cantidad) <= 0) {
      errors.cantidad = "La cantidad debe ser un número positivo.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = (saveAndAddAnother = false) => {
    if (!validateForm()) return;
    onSubmit(formData, saveAndAddAnother); // onSubmit viene de ListaAbastecimientoPage
    
    if (saveAndAddAnother) {
      // Resetear para el siguiente, manteniendo la categoría y empleado si se desea
      setFormData(prev => ({ 
        nombre: '', 
        category: prev.category, 
        empleado: prev.empleado, 
        cantidad: '' 
      }));
      setFormErrors({});
    }
    // onClose() es llamado por ListaAbastecimientoPage si !saveAndAddAnother
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-abastecimiento-overlay">
        <div className="modal-abastecimiento-content formulario-modal">
          <h2 className="abastecimiento-modal-title">Agregar Producto de Abastecimiento</h2>
          <form className="abastecimiento-form-grid" onSubmit={(e) => { e.preventDefault(); handleSave(false); }}>
            <AbastecimientoForm
              formData={formData}
              onInputChange={handleInputChange}
              onSelectCategory={() => setShowCategorySelectModal(true)}
              onSelectProduct={() => setShowProductSelectModal(true)}
              onSelectEmployee={() => setShowEmployeeSelectModal(true)}
              isEditing={false} // Siempre false para creación
              formErrors={formErrors}
            />
            {Object.keys(formErrors).length > 0 && (
              <div className="form-errors-summary-abastecimiento" style={{color: 'red', marginTop: '10px', textAlign: 'center'}}>
                <p>Por favor corrija los errores:</p>
                {formErrors.category && <p className="error-abastecimiento">{formErrors.category}</p>}
                {formErrors.nombre && <p className="error-abastecimiento">{formErrors.nombre}</p>}
                {formErrors.empleado && <p className="error-abastecimiento">{formErrors.empleado}</p>}
                {formErrors.cantidad && <p className="error-abastecimiento">{formErrors.cantidad}</p>}
              </div>
            )}
            <div className="form-actions-abastecimiento">
              <button 
                type="button" 
                className="form-button-guardar-abastecimiento"
                onClick={() => handleSave(true)}
                disabled={!formData.nombre || !formData.category || !formData.empleado || !formData.cantidad || parseInt(formData.cantidad) <= 0}
              >
                Guardar y Agregar Otro
              </button>
              <button 
                type="submit" 
                className="form-button-guardar-abastecimiento"
                disabled={!formData.nombre || !formData.category || !formData.empleado || !formData.cantidad || parseInt(formData.cantidad) <= 0}
              >
                Guardar Producto
              </button>
              <button type="button" className="form-button-cancelar-abastecimiento" onClick={onClose}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>

      <ItemSelectionModal
        isOpen={showCategorySelectModal}
        onClose={() => setShowCategorySelectModal(false)}
        title="Seleccionar Categoría"
        items={categorias.map(cat => ({ label: cat, value: cat }))}
        onSelectItem={(selectedCategory) => { // 'value' del item es el string de categoría
            setFormData(prev => ({ ...prev, category: selectedCategory, nombre: '' })); // Resetear producto
            setShowCategorySelectModal(false);
        }}
        searchPlaceholder="Buscar categoría..."
      />
      <ItemSelectionModal
        isOpen={showProductSelectModal}
        onClose={() => setShowProductSelectModal(false)}
        title={`Seleccionar Producto (Categoría: ${formData.category || 'Todas'})`}
        items={
            productosFiltradosPorCategoria.map(prod => ({ 
                label: `${prod.nombre}${prod.category ? ` (${prod.category})` : ''}`, 
                value: prod.nombre, // El valor es el nombre del producto
                // productData: prod // Pasar el objeto producto completo si onSelectItem lo necesita
            }))
        }
        onSelectItem={(selectedProductValue) => { // Recibe el 'value' (nombre del producto)
            const selectedProdObject = todosProductos.find(p => p.nombre === selectedProductValue && p.category === formData.category);
            setFormData(prev => ({ 
              ...prev, 
              nombre: selectedProductValue,
              // Opcional: auto-seleccionar categoría si no estaba y el producto la tiene
              // category: prev.category || selectedProdObject?.category 
            }));
            setShowProductSelectModal(false);
        }}
        searchPlaceholder="Buscar producto..."
        disabled={!formData.category && todosProductos.some(p => p.category)} // Deshabilitar si hay categorías y ninguna seleccionada
      />
      <ItemSelectionModal
        isOpen={showEmployeeSelectModal}
        onClose={() => setShowEmployeeSelectModal(false)}
        title="Seleccionar Empleado"
        items={empleados.map(emp => ({ label: emp, value: emp }))}
        onSelectItem={(employeeName) => { // Recibe el 'value' (nombre del empleado)
            setFormData(prev => ({ ...prev, empleado: employeeName }));
            setShowEmployeeSelectModal(false);
        }}
        searchPlaceholder="Buscar empleado..."
      />
    </>
  );
};

export default AbastecimientoCrearModal;