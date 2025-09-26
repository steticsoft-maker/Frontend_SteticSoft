import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CitaFormModal } from '../components';
import { saveCita } from '../services/citasService';

const AgendarCitaPage = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(true);

    const handleSubmitCita = async (citaData) => {
        try {
            await saveCita(citaData);
            alert('¡Cita agendada con éxito!');
            navigate('/admin/citas');
        } catch (error) {
            throw error; // Re-lanzar el error para que el modal lo maneje
        }
    };

    const handleCloseModal = () => {
        navigate('/admin/citas');
    };

    return (
        <CitaFormModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSubmit={handleSubmitCita}
        />
    );
};

export default AgendarCitaPage;