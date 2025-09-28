import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CitaFormModal } from '../components';
import { saveCita } from '../services/citasService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../../../shared/styles/crud-common.css";
import "../../../shared/styles/admin-layout.css";
import "../css/Citas.css";

const CitaPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isModalOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // Obtener cliente preseleccionado si viene desde otra página
    const clientePreseleccionado = location.state?.clientePreseleccionado || null;

    const handleSubmitCita = async (citaData) => {
        setIsLoading(true);
        try {
            await saveCita(citaData);
            toast.success('¡Cita agendada con éxito!');
            navigate('/admin/citas');
        } catch (error) {
            console.error("Error al guardar cita:", error);
            const errorMessage = error.response?.data?.message || error.message || "No se pudo guardar la cita.";
            toast.error(errorMessage);
            throw error; // Re-lanzar el error para que el modal lo maneje
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseModal = () => {
        navigate('/admin/citas');
    };

    return (
        <div className="cita-page-container">
            <div className="cita-page-header">
                <button 
                    className="back-button"
                    onClick={() => navigate('/admin/citas')}
                    aria-label="Volver a la lista de citas"
                >
                    ← Volver a Citas
                </button>
                <h1>Agendar Nueva Cita</h1>
            </div>
            
            <div className="cita-page-content">
                <CitaFormModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmitCita}
                    clientePreseleccionado={clientePreseleccionado}
                />
                
                {isLoading && (
                    <div className="loading-overlay">
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                            <p>Guardando cita...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CitaPage;