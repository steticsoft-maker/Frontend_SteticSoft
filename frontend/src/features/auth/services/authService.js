// src/features/auth/services/authService.js

// Simulación de llamada a API - Esto se reemplazará con Axios más adelante
export const loginUser = async (credentials) => {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  const adminCredentials = {
    email: "admin@gmail.com",
    password: "admin123",
  };

  if (
    credentials.email === adminCredentials.email &&
    credentials.password === adminCredentials.password
  ) {
    return {
      success: true,
      token: "admin-token", // Token simulado
      role: "admin",
      // name: "Administrador" // Podrías añadir el nombre
    };
  } else {
    // Para cualquier otro usuario, simulamos un login de cliente
    // En una aplicación real, esto vendría de una base de datos/API
    if (credentials.email && credentials.password) {
      // Asumimos cualquier otra credencial es cliente
      return {
        success: true,
        token: "user-token", // Token simulado de cliente
        role: "client",
        // name: "Cliente Ejemplo" // Nombre simulado
      };
    }
    return {
      success: false,
      message: "Credenciales incorrectas.", // Mensaje de error
    };
  }
};

export const registerUser = async (userData) => {
  // userData: { name, email, password }
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Simulación de registro
  // En una app real: verificar si el email ya existe, guardar en DB, etc.
  if (userData.email === "test@test.com") {
    // Simular que este email ya existe
    return {
      success: false,
      message: "El correo electrónico ya está registrado.",
    };
  }

  // Simular guardado en localStorage como en tu código original
  // OJO: Esto es solo para mantener la lógica actual, idealmente el backend maneja el registro.
  // El frontend no debería guardar 'registeredUser' así. El backend confirmaría el registro.
  localStorage.setItem(
    "registeredUser",
    JSON.stringify({ name: userData.name, email: userData.email })
  );

  return {
    success: true,
    message: "Registro exitoso. Ahora puedes iniciar sesión.",
  };
};
