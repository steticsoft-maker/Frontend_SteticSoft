// src/features/auth/utils/debugToken.js
import { jwtDecode } from "jwt-decode";

/**
 * Función de debug para inspeccionar tokens JWT
 * Solo para desarrollo
 */
export const debugToken = (token) => {
  console.log("=== TOKEN DEBUG ===");
  console.log("Raw token:", token);

  if (!token) {
    console.log("No token provided");
    return;
  }

  try {
    const decoded = jwtDecode(token);
    console.log("Decoded token:", decoded);
    console.log("Token structure:");
    console.log("- Header:", decoded.header || "No header");
    console.log("- Payload:", decoded.payload || "No payload");
    console.log(
      "- Expiration:",
      decoded.exp ? new Date(decoded.exp * 1000) : "No expiration"
    );
    console.log(
      "- Issued at:",
      decoded.iat ? new Date(decoded.iat * 1000) : "No issued at"
    );
    console.log("- Subject:", decoded.sub || "No subject");
    console.log(
      "- User ID:",
      decoded.idUsuario || decoded.user_id || decoded.id || "No user ID"
    );
    console.log("- Email:", decoded.correo || decoded.email || "No email");
    console.log(
      "- Role:",
      decoded.rolNombre || decoded.rol || decoded.role || "No role"
    );
    console.log(
      "- Permissions:",
      decoded.permissions || decoded.permisos || "No permissions"
    );

    // Verificar expiración
    if (decoded.exp) {
      const currentTime = Date.now() / 1000;
      const isExpired = decoded.exp < currentTime;
      console.log("- Is expired:", isExpired);
      if (isExpired) {
        console.log("- Expired at:", new Date(decoded.exp * 1000));
        console.log("- Current time:", new Date(currentTime * 1000));
      }
    }
  } catch (error) {
    console.error("Error decoding token:", error);
  }

  console.log("=== END TOKEN DEBUG ===");
};

export default debugToken;
