// frontend/src/shared/components/common/Tooltip.jsx
import React, { useState, useRef, useEffect } from "react";
import "./Tooltip.css";

const Tooltip = ({ children, content, position = "top" }) => {
  const [visible, setVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState({});
  const wrapperRef = useRef(null);
  const tooltipRef = useRef(null);

  const showTooltip = () => {
    setVisible(true);
    // Calcular posición después de que el tooltip sea visible
    setTimeout(() => {
      if (wrapperRef.current && tooltipRef.current) {
        const wrapperRect = wrapperRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();

        // Siempre posicionar arriba del icono, centrado horizontalmente
        let top = wrapperRect.top - tooltipRect.height - 6;
        let left = wrapperRect.left + wrapperRect.width / 2 - tooltipRect.width / 2;

        // Ajustar para que no se salga de la pantalla
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const margin = 8;

        // Ajuste horizontal - mantener centrado pero dentro de la pantalla
        if (left < margin) {
          left = margin;
        } else if (left + tooltipRect.width > viewportWidth - margin) {
          left = viewportWidth - tooltipRect.width - margin;
        }

        // Ajuste vertical - si no cabe arriba, mostrar abajo
        if (top < margin) {
          top = wrapperRect.bottom + 6;
        }

        setTooltipStyle({
          position: "fixed",
          top: `${top}px`,
          left: `${left}px`,
          zIndex: 999999,
        });
      }
    }, 0);
  };

  const hideTooltip = () => {
    setVisible(false);
    setTooltipStyle({});
  };

  return (
    <div
      ref={wrapperRef}
      className="tooltip-wrapper"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      tabIndex={0}
    >
      {children}
      {visible && (
        <div
          ref={tooltipRef}
          className="tooltip-content"
          style={tooltipStyle}
          role="tooltip"
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
