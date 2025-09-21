// frontend/src/shared/components/common/Tooltip.jsx
import React, { useState } from "react";
import "./Tooltip.css";

const Tooltip = ({ children, content, position = "top" }) => {
  const [visible, setVisible] = useState(false);

  const showTooltip = () => setVisible(true);
  const hideTooltip = () => setVisible(false);

  return (
    <div
      className="tooltip-wrapper"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      tabIndex={0}
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
