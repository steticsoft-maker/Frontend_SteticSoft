import React from "react";
import AppRoutes from "./routes";
import { AuthProvider, ThemeProvider } from "./shared/contexts";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
