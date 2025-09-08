// frontend/src/shared/layouts/EmpleadoLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import EmpleadoNavbar from '../../features/empleado/components/EmpleadoNavbar';

const EmpleadoLayout = () => {
  return (
    <div>
      <EmpleadoNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default EmpleadoLayout;
