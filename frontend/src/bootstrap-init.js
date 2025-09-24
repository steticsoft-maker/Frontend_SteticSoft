// Bootstrap initialization to prevent controller conflicts
// This file prevents Bootstrap from auto-registering controllers that cause errors

// Disable Bootstrap's auto-initialization
if (typeof window !== "undefined") {
  // Prevent Bootstrap from auto-initializing controllers
  document.addEventListener("DOMContentLoaded", function () {
    // Remove any problematic controller registrations
    if (window.bootstrap) {
      // Override Bootstrap's controller registry
      const originalGetController =
        window.bootstrap.BaseComponent.prototype.getController;
      window.bootstrap.BaseComponent.prototype.getController = function (name) {
        // Skip problematic controller names
        if (name === "line") {
          console.warn("Skipping problematic Bootstrap controller:", name);
          return null;
        }
        return originalGetController.call(this, name);
      };
    }
  });
}
