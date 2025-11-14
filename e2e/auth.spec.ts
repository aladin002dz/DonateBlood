import { expect, test } from '@playwright/test';

test.describe('Authentication Flow', () => {
  // Use a global beforeEach/beforeAll if you navigate to the home page once.
  // Keeping it as is for isolated tests.
  test.beforeEach(async ({ page }) => {
    // Navigate to home page before each test with locale prefix
    await page.goto('/en');
    // Wait for the navigation bar to be visible and interactive
    await page.getByRole('navigation').waitFor({ state: 'visible' });
  });

  test('should navigate to sign-in page', async ({ page }) => {
    // Use a more specific click action and wait for the resulting URL
    await page.getByRole('link', { name: 'Sign In' }).click();

    // Explicitly wait for the navigation to the sign-in URL
    await page.waitForURL(/.*\/en\/signin/);

    // Then check the URL and the sign-in card title
    await expect(page).toHaveURL(/.*\/en\/signin/);
    // Assuming the sign-in page uses the same card title slot as registration
    await expect(page.locator('[data-slot="card-title"]')).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/en/signin');
    await page.waitForLoadState('networkidle'); // Wait for page stability

    // The validation error selectors likely need to be more reliable.
    // Assuming 'p.text-destructive' is correct, but wait for it to be attached/visible.

    const identifierInput = page.locator('input[id="identifier"]');
    const passwordInput = page.locator('input[id="password"]');

    // Type and clear to trigger react-hook-form onChange mode validation
    await identifierInput.fill('test');
    await identifierInput.clear();
    await identifierInput.blur();

    await passwordInput.fill('test');
    await passwordInput.clear();
    await passwordInput.blur();

    // Wait for validation errors to appear (increased timeout for form submission/validation)
    // Checking for the specific text is more reliable than just the first element
    await expect(page.locator('text=/Email or phone number is required/i')).toBeVisible({ timeout: 10000 });
    // Also check the first generic error locator to ensure the class is present
    await expect(page.locator('p.text-destructive').first()).toBeVisible();
  });

  test('should show error for invalid email format', async ({ page }) => {
    await page.goto('/en/signin');
    await page.waitForLoadState('networkidle');

    const identifierInput = page.locator('input[id="identifier"]');
    const passwordInput = page.locator('input[id="password"]');

    await identifierInput.fill('invalid-email');
    await passwordInput.fill('password123');

    // Trigger validation by blurring the identifier field
    await identifierInput.blur();

    // Wait for the specific validation error text to appear
    await expect(page.locator('text=/Please enter a valid email address or phone number/i')).toBeVisible({ timeout: 10000 });
    // Check for the presence of the destructive class element
    await expect(page.locator('p.text-destructive')).toBeVisible();
  });

  test('should navigate to registration page', async ({ page }) => {
    // Navigate from the home page (as per beforeEach)
    await page.getByRole('link', { name: 'Register' }).click();
    // Explicitly wait for the navigation
    await page.waitForURL(/.*\/en\/register/);
    await expect(page).toHaveURL(/.*\/en\/register/);
  });

  test('should navigate to forgot password page', async ({ page }) => {
    // The beforeEach only goes to '/en', so this goto is necessary to get the link
    await page.goto('/en/signin');
    await page.waitForLoadState('networkidle');

    await page.getByRole('link', { name: /forgot/i }).click();
    // Explicitly wait for the navigation
    await page.waitForURL(/.*\/en\/forgot-password/);
    await expect(page).toHaveURL(/.*\/en\/forgot-password/);
  });
});

test.describe('Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Separate beforeEach to ensure the registration page is loaded
    await page.goto('/en/register');
    await page.waitForLoadState('networkidle');
  });

  test('should show registration form', async ({ page }) => {
    // Asserting visibility of all key fields
    await expect(page.locator('input[id="fullName"]')).toBeVisible();
    await expect(page.locator('input[id="email"]')).toBeVisible();
    await expect(page.locator('input[id="password"]')).toBeVisible();
    await expect(page.locator('input[id="phone"]')).toBeVisible();
  });

  test('should show validation errors for incomplete registration', async ({ page }) => {
    // Page loaded in beforeEach

    const fullNameInput = page.locator('input[id="fullName"]');
    const emailInput = page.locator('input[id="email"]');

    // Type something then clear to trigger validation
    await fullNameInput.fill('test');
    await fullNameInput.clear();
    await fullNameInput.blur(); // Ensure field is blurred to trigger validation

    await emailInput.fill('test');
    await emailInput.clear();
    await emailInput.blur(); // Ensure field is blurred to trigger validation

    // Wait for validation errors to appear (increased timeout)
    // The registration form component uses: <p className="text-sm text-red-500">{errors.fullName.message}</p>
    // Let's use the explicit color/size class for better targeting
    const errorLocator = page.locator('p.text-sm.text-red-500').first();
    await expect(errorLocator).toBeVisible({ timeout: 10000 });

    // Check for validation messages (could be "required" or "must be at least")
    // NOTE: This relies on the translation being loaded, which might be a source of flakiness.
    // If you control the translation keys, you could check for `text=/minName2/i` etc.
    const errorText = await errorLocator.textContent();
    // The regex is fine if the translations map to these terms.
    expect(errorText).toMatch(/required|must be at least/i);
  });
});