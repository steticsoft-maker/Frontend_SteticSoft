// src/features/abastecimiento/components/AbastecimientoFormModal.jsx
import React, { useState, useEffect } from 'react';
import AbastecimientoForm from './AbastecimientoForm';
import ItemSelectionModal from './ItemSelectionModal'; // O desde shared
import { getCategorias, getProductosDisponibles, getEmpleados } from '../services/abastecimientoService';

const AbastecimientoFormModal = ({ isOpen, onClose, onSubmit, initialData, isEditing }) => {
  const [formData, setFormData] = useState({ nombre: '', category: '', empleado: '', cantidad: '' });

  const [showCategorySelectModal, setShowCategorySelectModal] = useState(false);
  const [showProductSelectModal, setShowProductSelectModal] = useState(false);
  const [showEmployeeSelectModal, setShowEmployeeSelectModal] = useState(false);

  const categorias = getCategorias();
  const todosProductos = getProductosDisponibles(); // Todos los productos base
  const empleados = getEmpleados();

  const [productosFiltradosPorCategoria, setProductosFiltradosPorCategoria] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id, // importante para edición
        nombre: initialData.nombre || '',
        category: initialData.category || '',
        empleado: initialData.empleado || '',
        cantidad: initialData.cantidad || '',
        fechaIngreso: initialData.fechaIngreso, // Mantener si se edita
        isDepleted: initialData.isDepleted,
        depletionReason: initialData.depletionReason
      });
    } else {
      setFormData({ nombre: '', category: '', empleado: '', cantidad: '' });
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    if (formData.category) {
      setProductosFiltradosPorCategoria(todosProductos.filter(p => p.category === formData.category));
    } else {
      setProductosFiltradosPorCategoria(todosProductos); // Mostrar todos si no hay categoría o en edición
    }
  }, [formData.category, todosProductos]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (saveAndAddAnother = false) => {
    onSubmit(formData, saveAndAddAnother);
    if (!saveAndAddAnother) {
        onClose();
    } else { // Reset form for "save and add another"
        setFormData({ nombre: '', category: formData.category, /* Mantener categoría si se desea */ empleado: '', cantidad: '' });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-abastecimiento-overlay">
        <div className="modal-abastecimiento-content">
          <h2>{isEditing ? "Editar" : "Agregar"} Producto de Abastecimiento</h2>
          <form className="formularioModalAbastecimiento" onSubmit={(e) => { e.preventDefault(); handleSave(false); }}>
            <AbastecimientoForm
              formData={formData}
              onInputChange={handleInputChange}
              onSelectCategory={() => setShowCategorySelectModal(true)}
              onSelectProduct={() => setShowProductSelectModal(true)}
              onSelectEmployee={() => setShowEmployeeSelectModal(true)}
              isEditing={isEditing}
            />
            <div className="form-actions-abastecimiento">
              {!isEditing && (
                <button type="button" className="form-button-guardar-abastecimiento" onClick={() => handleSave(true)}
                  disabled={!formData.nombre || !formData.category || !formData.empleado || !formData.cantidad || parseInt(formData.cantidad) <= 0}
                >
                  Guardar y Agregar Otro
                </button>
              )}
              <button type="submit" className="form-button-guardar-abastecimiento"
                disabled={!formData.nombre || !formData.category || !formData.empleado || !formData.cantidad || parseInt(formData.cantidad) <= 0}
              >
                {isEditing ? "Guardar Cambios" : "Guardar"}
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
        onSelectItem={(category) => {
            setFormData(prev => ({ ...prev, category, nombre: '' })); // Resetear producto al cambiar categoría
            setShowCategorySelectModal(false);
        }}
        searchPlaceholder="Buscar categoría..."
      />
      <ItemSelectionModal
        isOpen={showProductSelectModal}
        onClose={() => setShowProductSelectModal(false)}
        title={`Seleccionar Producto (Categoría: ${formData.category || 'Todas'})`}
        items={productosFiltradosPorCategoria.map(prod => ({ label: `<span class="math-inline">\{prod\.nombre\} \(</span>{prod.category})`, value: prod.nombre }))}
        onSelectItem={(productName) => {
            setFormData(prev => ({ ...prev, nombre: productName }));
            setShowProductSelectModal(false);
        }}
        searchPlaceholder="Buscar producto..."
        disabled={!formData.category && !isEditing}
      />
      <ItemSelectionModal
        isOpen={showEmployeeSelectModal}
        onClose={() => setShowEmployeeSelectModal(false)}
        title="Seleccionar Empleado"
        items={empleados.map(emp => ({ label: emp, value: emp }))}
        onSelectItem={(employeeName) => {
            setFormData(prev => ({ ...prev, empleado: employeeName }));
            setShowEmployeeSelectModal(false);
        }}
        searchPlaceholder="Buscar empleado..."
      />
    </>
  );
};

export default AbastecimientoFormModal;