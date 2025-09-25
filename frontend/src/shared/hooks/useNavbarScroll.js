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

    // Detectar dirección del scroll con umbral más alto para menos cambios
    if (scrollTop > lastScrollY && scrollTop > 150) {
      // Aumentado de 100
      setScrollDirection("down");
    } else if (scrollTop < lastScrollY && scrollTop > 80) {
      // Aumentado de 50
      setScrollDirection("up");
    }

    setLastScrollY(scrollTop);

    // Activar efecto de scroll con umbral más alto
    setIsScrolled(scrollTop > 50); // Aumentado de 30
  }, [lastScrollY]);

  useEffect(() => {
    // Usar throttling más agresivo para mejor rendimiento
    let ticking = false;
    let timeoutId = null;

    const throttledHandleScroll = () => {
      if (!ticking) {
        timeoutId = setTimeout(() => {
          requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
          });
        }, 16); // ~60fps throttling
        ticking = true;
      }
    };

    // Agregar listener de scroll con throttling mejorado
    window.addEventListener("scroll", throttledHandleScroll, { passive: true });

    // Limpiar listener al desmontar
    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [handleScroll]);

  return { isScrolled, scrollDirection, isAtTop };
};

export default useNavbarScroll;
