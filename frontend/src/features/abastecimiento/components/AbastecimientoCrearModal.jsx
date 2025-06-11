// src/features/abastecimiento/components/AbastecimientoCrearModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import AbastecimientoForm from './AbastecimientoForm';
import ItemSelectionModal from '../../../shared/components/common/ItemSelectionModal';
import { abastecimientoService } from '../services/abastecimientoService';

const AbastecimientoCrearModal = ({ isOpen, onClose, onSubmit }) => {
  const getInitialFormState = () => ({
    categoriaId: null,
    productoId: null,
    productoNombre: '',
    empleadoId: null,
    empleadoNombre: '',
    cantidad: '',
  });

  const [formData, setFormData] = useState(getInitialFormState());
  const [formErrors, setFormErrors] = useState({});
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  // Listas de datos
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [empleados, setEmpleados] = useState([]);

  // Modales de selección
  const [showProductSelectModal, setShowProductSelectModal] = useState(false);
  const [showEmployeeSelectModal, setShowEmployeeSelectModal] = useState(false);

  // Cargar datos iniciales (categorías y empleados)
  useEffect(() => {
    if (isOpen) {
      setIsLoadingData(true);
      Promise.all([
        abastecimientoService.getCategoriasUsoInterno(),
        abastecimientoService.getEmpleadosActivos()
      ]).then(([cats, emps]) => {
        setCategorias(cats);
        setEmpleados(emps);
      }).catch(err => {
        setFormErrors({ _general: "No se pudieron cargar los datos para el formulario." });
      }).finally(() => {
        setIsLoadingData(false);
      });
      setFormData(getInitialFormState());
      setProductos([]);
      setFormErrors({});
    }
  }, [isOpen]);
  
  // Cargar productos cuando cambia la categoría
  const handleCategoryChange = useCallback(async (e) => {
    const newCategoriaId = e.target.value;
    setFormData(prev => ({ 
        ...prev, 
        categoriaId: newCategoriaId,
        productoId: null, // Resetea el producto al cambiar de categoría
        productoNombre: ''
    }));
    
    if (newCategoriaId) {
        setIsLoadingData(true);
        try {
            const fetchedProductos = await abastecimientoService.getProductosPorCategoria(newCategoriaId);
            setProductos(fetchedProductos);
        } catch (error) {
            setFormErrors(prev => ({ ...prev, _general: "Error al cargar productos." }));
        } finally {
            setIsLoadingData(false);
        }
    } else {
        setProductos([]);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // ... (validación y lógica de submit sin cambios)
    const { productoNombre, empleadoNombre, ...dataToSubmit } = formData;
    onSubmit(dataToSubmit);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-abastecimiento-overlay">
        <div className="modal-abastecimiento-content formulario-modal">
          <h2 className="abastecimiento-modal-title">Registrar Salida de Producto</h2>
          {isLoadingData && <p>Cargando datos...</p>}
          <form className="abastecimiento-form-grid" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <AbastecimientoForm
              formData={formData}
              onInputChange={handleInputChange}
              onSelectProduct={() => setShowProductSelectModal(true)}
              onSelectEmployee={() => setShowEmployeeSelectModal(true)}
              isEditing={false}
              formErrors={formErrors}
              categorias={categorias}
              onCategoryChange={handleCategoryChange}
            />
            <div className="form-actions-abastecimiento">
                <button type="submit" className="form-button-guardar-abastecimiento">Guardar Registro</button>
                <button type="button" className="form-button-cancelar-abastecimiento" onClick={onClose}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>

      <ItemSelectionModal
        isOpen={showProductSelectModal}
        onClose={() => setShowProductSelectModal(false)}
        title="Seleccionar Producto"
        items={productos.map(p => ({ label: p.nombre, value: p.idProducto }))}
        onSelectItem={(id) => {
            const prod = productos.find(p => p.idProducto === id);
            setFormData(prev => ({ ...prev, productoId: id, productoNombre: prod.nombre }));
            setShowProductSelectModal(false);
        }}
        searchPlaceholder="Buscar producto..."
      />
      
      {/* El modal de empleados no cambia */}
      <ItemSelectionModal
        isOpen={showEmployeeSelectModal}
        onClose={() => setShowEmployeeSelectModal(false)}
        title="Seleccionar Empleado"
        items={empleados.map(emp => ({ label: emp.empleadoInfo.nombre, value: emp.empleadoInfo.idEmpleado }))}
        onSelectItem={(id) => {
            const emp = empleados.find(e => e.empleadoInfo.idEmpleado === id);
            setFormData(prev => ({ ...prev, empleadoId: id, empleadoNombre: emp.empleadoInfo.nombre }));
            setShowEmployeeSelectModal(false);
        }}
        searchPlaceholder="Buscar empleado..."
      />
    </>
  );
};

export default AbastecimientoCrearModal;