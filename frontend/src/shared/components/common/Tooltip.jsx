// frontend/src/shared/components/common/Tooltip.jsx
import React, { useState } from 'react';
import './Tooltip.css'; // Crearemos este archivo CSS

const Tooltip = ({ children, content, position = 'top' }) => {
  const [visible, setVisible] = useState(false);

  // Para mejorar la accesibilidad y el control,
  // es mejor manejar la visibilidad con más cuidado,
  // especialmente para interacciones táctiles o de teclado.
  // Por simplicidad, mantendremos onMouseEnter/Leave por ahora.
  const showTooltip = () => setVisible(true);
  const hideTooltip = () => setVisible(false);

  return (
    <div
      className="tooltip-wrapper"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      // tabIndex={0} // Hacerlo enfocable si el contenido hijo no lo es.
                   // Si el hijo es un botón o ícono ya enfocable, esto puede ser redundante o causar doble tabulación.
                   // Por ahora, lo comentamos. Si los íconos no son enfocables por sí mismos, se puede añadir.
    >
      {children}
      {visible && (
        <div className={`tooltip-content tooltip-${position}`} role="tooltip">
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
