// src/shared/contexts/authHooks.js
import { createContext, useContext } from 'react';

// 1. El contexto se crea y se exporta para ser usado por AuthProvider.
export const AuthContext = createContext(null);

// 2. Se crea y exporta un HOOK PERSONALIZADO para usar el contexto.
//    Esto encapsula la lógica y es la práctica recomendada.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
