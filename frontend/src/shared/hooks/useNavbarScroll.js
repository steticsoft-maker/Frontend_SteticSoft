import { useEffect, useState } from "react";

export const useNavbarScroll = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 50);
    };

    // Agregar listener de scroll
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Limpiar listener al desmontar
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return isScrolled;
};

export default useNavbarScroll;
