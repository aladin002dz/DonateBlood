import { expect, test } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page before each test with locale prefix
    await page.goto('/en');
  });

  test('should navigate to sign-in page', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/.*\/en\/signin/);
    await expect(page.locator('[data-slot="card-title"]').getByText('Sign In')).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/en/signin');

    // Trigger validation by typing and clearing fields (onChange mode requires actual changes)
    const identifierInput = page.locator('input[id="identifier"]');
    const passwordInput = page.locator('input[id="password"]');

    // Type something then clear to trigger validation
    await identifierInput.fill('test');
    await identifierInput.clear();
    await identifierInput.blur(); // Ensure field is blurred to trigger validation

    await passwordInput.fill('test');
    await passwordInput.clear();
    await passwordInput.blur(); // Ensure field is blurred to trigger validation

    // Wait for validation errors to appear
    // The form uses react-hook-form with onChange mode, so errors appear on change
    await expect(page.locator('p.text-destructive').first()).toBeVisible();
    await expect(page.locator('text=/Email or phone number is required/i')).toBeVisible();
  });

  test('should show error for invalid email format', async ({ page }) => {
    await page.goto('/en/signin');

    const identifierInput = page.locator('input[id="identifier"]');
    const passwordInput = page.locator('input[id="password"]');

    await identifierInput.fill('invalid-email');
    await passwordInput.fill('password123');

    // Trigger validation by blurring the identifier field (onChange mode should show error)
    await identifierInput.blur();

    // Wait for validation error to appear
    await expect(page.locator('p.text-destructive')).toBeVisible();
    await expect(page.locator('text=/Please enter a valid email address or phone number/i')).toBeVisible();
  });

  test('should navigate to registration page', async ({ page }) => {
    await page.getByRole('link', { name: 'Register' }).click();
    await expect(page).toHaveURL(/.*\/en\/register/);
  });

  test('should navigate to forgot password page', async ({ page }) => {
    await page.goto('/en/signin');
    await page.getByRole('link', { name: /forgot/i }).click();
    await expect(page).toHaveURL(/.*\/en\/forgot-password/);
  });
});

test.describe('Registration Flow', () => {
  test('should show registration form', async ({ page }) => {
    await page.goto('/en/register');

    await expect(page.locator('input[id="fullName"]')).toBeVisible();
    await expect(page.locator('input[id="email"]')).toBeVisible();
    await expect(page.locator('input[id="password"]')).toBeVisible();
    await expect(page.locator('input[id="phone"]')).toBeVisible();
  });

  test('should show validation errors for incomplete registration', async ({ page }) => {
    await page.goto('/en/register');

    // Trigger validation by typing and clearing fields (onChange mode requires actual changes)
    const fullNameInput = page.locator('input[id="fullName"]');
    const emailInput = page.locator('input[id="email"]');

    // Type something then clear to trigger validation
    await fullNameInput.fill('test');
    await fullNameInput.clear();
    await fullNameInput.blur(); // Ensure field is blurred to trigger validation

    await emailInput.fill('test');
    await emailInput.clear();
    await emailInput.blur(); // Ensure field is blurred to trigger validation

    // Wait for validation errors to appear
    // The form uses react-hook-form with onChange mode, so errors appear on change
    await expect(page.locator('p.text-destructive').first()).toBeVisible();
    // Check for validation messages (could be "required" or "must be at least")
    const errorText = await page.locator('p.text-destructive').first().textContent();
    expect(errorText).toMatch(/required|must be at least/i);
  });
});

