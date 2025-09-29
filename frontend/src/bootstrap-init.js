// Bootstrap initialization to prevent controller conflicts
// This file prevents Bootstrap from auto-registering controllers that cause errors

// Disable Bootstrap's auto-initialization
if (typeof window !== "undefined") {
  // Prevent Bootstrap from auto-initializing controllers
  document.addEventListener("DOMContentLoaded", function () {
    try {
      // Remove any problematic controller registrations
      if (
        window.bootstrap &&
        window.bootstrap.BaseComponent &&
        window.bootstrap.BaseComponent.prototype
      ) {
        // Override Bootstrap's controller registry
        const originalGetController =
          window.bootstrap.BaseComponent.prototype.getController;

        if (typeof originalGetController === "function") {
          window.bootstrap.BaseComponent.prototype.getController = function (
            name
          ) {
            // Skip problematic controller names that can cause initialization errors
            if (name === "line" || name === "Ru" || name === "ru") {
              console.warn("Skipping problematic Bootstrap controller:", name);
              return null;
            }
            try {
              return originalGetController.call(this, name);
            } catch (error) {
              console.warn(
                "Error accessing Bootstrap controller:",
                name,
                error
              );
              return null;
            }
          };
        }
      }
    } catch (error) {
      console.warn("Bootstrap initialization error:", error);
    }
  });
}
