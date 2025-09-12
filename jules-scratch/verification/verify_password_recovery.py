from playwright.sync_api import sync_playwright, expect
import sys

def run_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Listen for console events
    page.on("console", lambda msg: print(f"CONSOLE: {msg.text}", file=sys.stderr))

    try:
        # Go to the login page
        page.goto("http://localhost:5173/login")
        page.wait_for_load_state("networkidle")

        # Click the "Forgot your password?" link
        forgot_password_link = page.get_by_role("link", name="¿Olvidaste tu contraseña?")
        forgot_password_link.click()

        # Wait for the forgot password page to load
        expect(page).to_have_url("http://localhost:5173/forgot-password")
        expect(page.get_by_role("heading", name="Recuperar Contraseña")).to_be_visible()

        # Take a screenshot of the forgot password page
        page.screenshot(path="jules-scratch/verification/forgot_password_page.png")

        # Go to the reset password page with a dummy token
        page.goto("http://localhost:5173/reset-password/dummy-token")
        page.wait_for_load_state("networkidle")


        # Wait for the reset password page to load
        expect(page).to_have_url("http://localhost:5173/reset-password/dummy-token")
        expect(page.get_by_role("heading", name="Restablecer Contraseña")).to_be_visible()

        # Take a screenshot of the reset password page
        page.screenshot(path="jules-scratch/verification/reset_password_page.png")

    except Exception as e:
        print(f"An error occurred: {e}", file=sys.stderr)
        try:
            print("Page content:", page.content(), file=sys.stderr)
        except Exception as pe:
            print(f"Could not get page content: {pe}", file=sys.stderr)
        sys.exit(1)
    finally:
        context.close()
        browser.close()


with sync_playwright() as playwright:
    run_verification(playwright)
