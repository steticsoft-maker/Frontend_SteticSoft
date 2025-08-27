from playwright.sync_api import sync_playwright, Page, expect

def run_verification(page: Page):
    """
    This script verifies that the registration form correctly displays
    validation errors received from the backend.
    """
    # 1. Arrange: Go to the registration page.
    page.goto("http://localhost:5173/register")

    # 2. Act: Fill in some fields with invalid data.
    # MODIFICADO: Usar el texto exacto del label, incluyendo el asterisco.
    page.get_by_label("Nombre completo *").fill("Invalid Name 123")
    page.get_by_label("Contraseña *").fill("weak")

    # Fill in other required fields with valid data.
    page.get_by_label("Apellidos *").fill("Test")
    page.get_by_label("Correo electrónico *").fill("test@example.com")
    page.get_by_label("Confirmar Contraseña *").fill("weak")
    page.get_by_label("Teléfono *").fill("1234567890")
    page.get_by_label("Número de Documento *").fill("123456789")
    page.get_by_label("Fecha de Nacimiento *").fill("2000-01-01")
    page.get_by_label("Acepto los términos y condiciones").check()

    # Click the submit button.
    page.get_by_role("button", name="Registrarse").click()

    # 3. Assert: Wait for the error messages to be visible.
    expect(page.get_by_text("El nombre solo puede contener letras y espacios.")).to_be_visible()
    expect(page.get_by_text("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.")).to_be_visible()

    # 4. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/registration_errors.png")

# Boilerplate to run the verification
if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        run_verification(page)
        browser.close()
