import React, { useState, useEffect } from 'react';
import AbastecimientoForm from './AbastecimientoForm';
import { fetchEmpleados, updateAbastecimiento } from '../hooks/useAbastecimiento';
import ItemSelectionModal from '../../../shared/components/common/ItemSelectionModal';
import '../css/Abastecimiento.css';

const AbastecimientoEditarModal = ({ isOpen, onClose, onSaveSuccess, initialData }) => {
    
    const [formData, setFormData] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [generalError, setGeneralError] = useState('');
    const [isEmpleadoModalOpen, setIsEmpleadoModalOpen] = useState(false);
    const [empleados, setEmpleados] = useState([]);

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData({
                idAbastecimiento: initialData.idAbastecimiento,
                fechaIngreso: initialData.fechaIngreso,
                empleado: initialData.usuario,
                producto: initialData.producto,
                cantidad: initialData.cantidad,
                estado: initialData.estado,
            });
            const loadEmpleados = async () => {
                try {
                    const empleadosData = await fetchEmpleados();
                    setEmpleados(empleadosData || []);
                // eslint-disable-next-line no-unused-vars
                } catch (error) {
                    setGeneralError("No se pudo cargar la lista de empleados.");
                }
            };
            loadEmpleados();
            setFormErrors({});
            setGeneralError('');
        }
    }, [isOpen, initialData]);

    const empleadosParaSeleccion = empleados.map(emp => ({
        ...emp,
        displayName: `Empleado (${emp.correo})`
    }));

    const handleEmpleadoSelect = (empleado) => {
        const empleadoConRol = { ...empleado, rol: { nombre: 'Empleado' } };
        setFormData(prev => ({ ...prev, empleado: empleadoConRol }));
        setIsEmpleadoModalOpen(false);
    };

    const handleCantidadChange = (_, cantidad) => {
        setFormData(prev => ({ ...prev, cantidad: Math.max(1, Number(cantidad) || 1) }));
    };

    const handleEstadoChange = (e) => {
        setFormData(prev => ({ ...prev, estado: e.target.checked }));
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.empleado) errors.empleado = 'Debe seleccionar un empleado.';
        if (!formData.cantidad || formData.cantidad <= 0) errors.cantidad = 'La cantidad debe ser mayor a 0.';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralError("");
        if (!validateForm()) {
            setGeneralError("Por favor, corrija los errores.");
            return;
        }

        try {
            const dataToUpdate = {
                idUsuario: formData.empleado.id_usuario,
                cantidad: formData.cantidad,
                estado: formData.estado,
            };
            await updateAbastecimiento(formData.idAbastecimiento, dataToUpdate);
            onSaveSuccess();
            onClose();
        } catch (error) {
            console.error("Error al actualizar abastecimiento:", error);
            setGeneralError(error.response?.data?.message || 'Ocurrió un error al guardar los cambios.');
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="modal-abastecimiento-overlay">
                <div className="modal-abastecimiento-content formulario-modal">
                    <button type="button" className="modal-close-button-x" onClick={onClose}>&times;</button>
                    <h2 className="abastecimiento-modal-title">Editar Registro de Abastecimiento</h2>
                    <AbastecimientoForm
                        formData={formData}
                        formErrors={formErrors}
                        onEmpleadoSelect={() => setIsEmpleadoModalOpen(true)}
                        onCantidadChange={handleCantidadChange}
                        onEstadoChange={handleEstadoChange}
                        isEditing={true}
                    />
                    {generalError && <p className="error-abastecimiento" style={{ textAlign: 'center', marginTop: '15px' }}>{generalError}</p>}
                    <div className="form-actions-abastecimiento">
                        <button type="button" className="form-button-cancelar-abastecimiento" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="button" className="form-button-guardar-abastecimiento" onClick={handleSubmit}>
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </div>

            {isEmpleadoModalOpen && (
                <ItemSelectionModal
                    isOpen={isEmpleadoModalOpen}
                    onClose={() => setIsEmpleadoModalOpen(false)}
                    onSelectItem={handleEmpleadoSelect}
                    items={empleadosParaSeleccion}
                    title="Seleccionar Empleado"
                    searchPlaceholder="Buscar empleado por correo..."
                    itemKey="id_usuario"
                    itemName="displayName"
                />
            )}
        </>
    );
};

export default AbastecimientoEditarModal;