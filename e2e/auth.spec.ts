import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page before each test with locale prefix
    await page.goto('/en');
  });

  test('should navigate to sign-in page', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/.*\/en\/signin/);
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/en/signin');
    
    // Trigger validation by focusing and blurring fields
    const identifierInput = page.locator('input[id="identifier"]');
    const passwordInput = page.locator('input[id="password"]');
    
    await identifierInput.focus();
    await identifierInput.blur();
    await passwordInput.focus();
    await passwordInput.blur();
    
    // Wait for validation errors to appear
    // The form uses react-hook-form with onChange mode, so errors appear on blur
    await expect(page.locator('p.text-destructive').first()).toBeVisible();
    await expect(page.locator('text=/required/i').first()).toBeVisible();
  });

  test('should show error for invalid email format', async ({ page }) => {
    await page.goto('/en/signin');
    
    const identifierInput = page.locator('input[id="identifier"]');
    const passwordInput = page.locator('input[id="password"]');
    
    await identifierInput.fill('invalid-email');
    await passwordInput.fill('password123');
    
    // Trigger validation by blurring the identifier field
    await identifierInput.blur();
    
    // Wait for validation error to appear
    await expect(page.locator('p.text-destructive')).toBeVisible();
    await expect(page.locator('text=/valid email address or phone number/i')).toBeVisible();
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
    
    // Trigger validation by focusing and blurring required fields
    const fullNameInput = page.locator('input[id="fullName"]');
    const emailInput = page.locator('input[id="email"]');
    
    await fullNameInput.focus();
    await fullNameInput.blur();
    await emailInput.focus();
    await emailInput.blur();
    
    // Wait for validation errors to appear
    await expect(page.locator('p.text-destructive').first()).toBeVisible();
    await expect(page.locator('text=/required/i').first()).toBeVisible();
  });
});

