import { useEffect, useState, useCallback } from "react";

export const useNavbarScroll = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("down");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);

  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Detectar si está en la parte superior
    setIsAtTop(scrollTop < 50);

    // Detectar dirección del scroll con umbral para evitar cambios muy frecuentes
    if (scrollTop > lastScrollY && scrollTop > 100) {
      setScrollDirection("down");
    } else if (scrollTop < lastScrollY && scrollTop > 50) {
      setScrollDirection("up");
    }

    setLastScrollY(scrollTop);

    // Activar efecto de scroll con umbral más bajo para mejor seguimiento
    setIsScrolled(scrollTop > 30);
  }, [lastScrollY]);

  useEffect(() => {
    // Usar throttling para mejor rendimiento
    let ticking = false;

    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Agregar listener de scroll con throttling
    window.addEventListener("scroll", throttledHandleScroll, { passive: true });

    // Limpiar listener al desmontar
    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
    };
  }, [handleScroll]);

  return { isScrolled, scrollDirection, isAtTop };
};

export default useNavbarScroll;
