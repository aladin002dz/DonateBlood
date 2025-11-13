import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page before each test
    await page.goto('/');
  });

  test('should navigate to sign-in page', async ({ page }) => {
    await page.click('text=Sign In');
    await expect(page).toHaveURL(/.*signin/);
    await expect(page.locator('text=Sign In')).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/signin');
    await page.click('button[type="submit"]');
    
    // Wait for validation errors
    await expect(page.locator('text=/required/i').first()).toBeVisible();
  });

  test('should show error for invalid email format', async ({ page }) => {
    await page.goto('/signin');
    
    const identifierInput = page.locator('input[id="identifier"]');
    const passwordInput = page.locator('input[id="password"]');
    
    await identifierInput.fill('invalid-email');
    await passwordInput.fill('password123');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=/invalid/i')).toBeVisible();
  });

  test('should navigate to registration page', async ({ page }) => {
    await page.click('text=Sign Up');
    await expect(page).toHaveURL(/.*register/);
  });

  test('should navigate to forgot password page', async ({ page }) => {
    await page.goto('/signin');
    await page.click('text=/forgot/i');
    await expect(page).toHaveURL(/.*forgot-password/);
  });
});

test.describe('Registration Flow', () => {
  test('should show registration form', async ({ page }) => {
    await page.goto('/register');
    
    await expect(page.locator('input[name="fullName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
  });

  test('should show validation errors for incomplete registration', async ({ page }) => {
    await page.goto('/register');
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await expect(page.locator('text=/required/i').first()).toBeVisible();
  });
});

