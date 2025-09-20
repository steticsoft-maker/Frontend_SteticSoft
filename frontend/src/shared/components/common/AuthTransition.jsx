import React, { useState, useEffect } from "react";

const AuthTransition = ({ children, isVisible }) => {
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    }
  }, [isVisible]);

  const handleTransitionEnd = () => {
    if (!isVisible) {
      setShouldRender(false);
    }
  };

  return shouldRender ? (
    <div
      className={`auth-transition ${
        isVisible ? "auth-transition-enter" : "auth-transition-exit"
      }`}
      onTransitionEnd={handleTransitionEnd}
    >
      {children}
    </div>
  ) : null;
};

export default AuthTransition;
