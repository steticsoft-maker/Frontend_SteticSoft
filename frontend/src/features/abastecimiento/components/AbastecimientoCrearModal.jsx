
import React, { useState, useEffect, useCallback } from 'react';
import AbastecimientoForm from './AbastecimientoForm';
// Asumimos que existen estos componentes y hooks
// import { fetchProductos } from '../../productos/hooks/useProductos'; 
import { fetchEmpleados, createAbastecimiento } from '../hooks/useAbastecimiento';
import ItemSelectionModal from '../../../shared/components/common/ItemSelectionModal';
import '../css/Abastecimiento.css';

const AbastecimientoCrearModal = ({ isOpen, onClose, onSaveSuccess }) => {
    
    const getInitialFormState = () => ({
        empleado: null,
        productos: [], // Array de objetos { ...producto, cantidad: 1 }
    });

    const [formData, setFormData] = useState(getInitialFormState());
    const [formErrors, setFormErrors] = useState({});
    const [generalError, setGeneralError] = useState('');

    const [isEmpleadoModalOpen, setIsEmpleadoModalOpen] = useState(false);
    const [isProductoModalOpen, setIsProductoModalOpen] = useState(false);
    
    const [empleados, setEmpleados] = useState([]);
    const [productosDisponibles, setProductosDisponibles] = useState([]);

    // Cargar datos necesarios (empleados y productos) al abrir el modal
    const loadRequiredData = useCallback(async () => {
        try {
            // Cargar empleados
            const empleadosData = await fetchEmpleados();
            setEmpleados(empleadosData || []);

            // Cargar productos (aquí necesitarías tu propia función fetchProductos)
            // const productosData = await fetchProductos({ tipoUso: 'interno', estado: true });
            // setProductosDisponibles(productosData.data || []);

            // **Temporalmente, usaremos datos de ejemplo para productos**
            setProductosDisponibles([
                { idProducto: 1, nombre: 'Limpia Vidrios (Interno)', existencia: 50 },
                { idProducto: 2, nombre: 'Desinfectante (Interno)', existencia: 30 },
                { idProducto: 3, nombre: 'Jabón de Manos (Interno)', existencia: 100 },
            ]);

        } catch (error) {
            setGeneralError('No se pudieron cargar los datos necesarios.');
            console.error("Error cargando datos para abastecimiento:", error);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            loadRequiredData();
            // Resetear estado al abrir
            setFormData(getInitialFormState());
            setFormErrors({});
            setGeneralError('');
        }
    }, [isOpen, loadRequiredData]);


    const handleEmpleadoSelect = (empleado) => {
        setFormData(prev => ({ ...prev, empleado }));
        setIsEmpleadoModalOpen(false);
        if (formErrors.empleado) setFormErrors(prev => ({ ...prev, empleado: '' }));
    };

    const handleProductoSelect = (producto) => {
        setFormData(prev => {
            const yaExiste = prev.productos.some(p => p.idProducto === producto.idProducto);
            if (yaExiste) return prev; // No añadir duplicados
            return {
                ...prev,
                productos: [...prev.productos, { ...producto, cantidad: 1 }]
            };
        });
        setIsProductoModalOpen(false);
        if (formErrors.productos) setFormErrors(prev => ({ ...prev, productos: '' }));
    };

    const handleRemoveProducto = (idProducto) => {
        setFormData(prev => ({
            ...prev,
            productos: prev.productos.filter(p => p.idProducto !== idProducto)
        }));
    };

    const handleCantidadChange = (idProducto, cantidad) => {
        const cant = Math.max(1, Number(cantidad)); // Asegurar que la cantidad sea al menos 1
        setFormData(prev => ({
            ...prev,
            productos: prev.productos.map(p => 
                p.idProducto === idProducto ? { ...p, cantidad: cant } : p
            )
        }));
    };
    
    const validateForm = () => {
        const errors = {};
        if (!formData.empleado) {
            errors.empleado = 'Debe seleccionar un empleado.';
        }
        if (formData.productos.length === 0) {
            errors.productos = 'Debe seleccionar al menos un producto.';
        } else {
            // Validar que cada producto tenga una cantidad válida y no exceda la existencia
            formData.productos.forEach(p => {
                if (!p.cantidad || p.cantidad <= 0) {
                    errors.productos = `El producto "${p.nombre}" debe tener una cantidad válida.`;
                }
                if (p.cantidad > p.existencia) {
                    errors.productos = `Stock insuficiente para "${p.nombre}". Solicitado: ${p.cantidad}, Disponible: ${p.existencia}.`;
                }
            });
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            setGeneralError("Por favor, corrija los errores en el formulario.");
            return;
        }

        try {
            setGeneralError('');
            // Se crea una promesa por cada producto a registrar
            const promesasCreacion = formData.productos.map(producto => {
                const dataParaAPI = {
                    idUsuario: formData.empleado.id_usuario,
                    idProducto: producto.idProducto,
                    cantidad: producto.cantidad,
                };
                return createAbastecimiento(dataParaAPI);
            });

            // Esperar a que todas las promesas se resuelvan
            await Promise.all(promesasCreacion);
            
            onSaveSuccess(); // Notificar al padre que todo fue exitoso
            onClose(); // Cerrar el modal

        } catch (error) {
            console.error("Error al crear abastecimiento(s):", error);
            setGeneralError(error.response?.data?.message || 'Ocurrió un error al guardar.');
        }
    };


    if (!isOpen) return null;

    return (
        <>
            <div className="modal-abastecimiento-overlay">
                <div className="modal-abastecimiento-content formulario-modal">
                    <button type="button" className="modal-close-button-x" onClick={onClose}>&times;</button>
                    <h2 className="abastecimiento-modal-title">Registrar Nuevo Abastecimiento</h2>
                    <AbastecimientoForm
                        formData={formData}
                        formErrors={formErrors}
                        onEmpleadoSelect={() => setIsEmpleadoModalOpen(true)}
                        onProductoSelect={() => setIsProductoModalOpen(true)}
                        onRemoveProducto={handleRemoveProducto}
                        onCantidadChange={handleCantidadChange}
                    />
                    {generalError && <p className="error-abastecimiento" style={{ textAlign: 'center', marginTop: '15px' }}>{generalError}</p>}
                    <div className="form-actions-abastecimiento">
                        <button type="button" className="form-button-cancelar-abastecimiento" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="button" className="form-button-guardar-abastecimiento" onClick={handleSubmit}>
                            Guardar Abastecimiento
                        </button>
                    </div>
                </div>
            </div>

            {/* Modales de selección */}
            {isEmpleadoModalOpen && (
                <ItemSelectionModal
                    isOpen={isEmpleadoModalOpen}
                    onClose={() => setIsEmpleadoModalOpen(false)}
                    onSelectItem={handleEmpleadoSelect}
                    items={empleados}
                    title="Seleccionar Empleado"
                    searchPlaceholder="Buscar empleado por nombre..."
                    itemKey="id_usuario"
                    itemName="nombre"
                />
            )}
            {isProductoModalOpen && (
                <ItemSelectionModal
                    isOpen={isProductoModalOpen}
                    onClose={() => setIsProductoModalOpen(false)}
                    onSelectItem={handleProductoSelect}
                    items={productosDisponibles}
                    title="Seleccionar Producto"
                    searchPlaceholder="Buscar producto por nombre..."
                    itemKey="idProducto"
                    itemName="nombre"
                />
            )}
        </>
    );
};

export default AbastecimientoCrearModal;