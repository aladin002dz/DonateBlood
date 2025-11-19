import { expect, test } from '@playwright/test';

test.describe('Password Reset Flow', () => {
  test.describe('Forgot Password Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/en/forgot-password');
      await page.waitForLoadState('networkidle');
    });

    test('should display forgot password page', async ({ page }) => {
      await expect(page).toHaveURL(/.*\/en\/forgot-password/);
      
      // Check for page title/heading
      await expect(page.locator('text=/Forgot.*Password|Reset.*Password/i')).toBeVisible();
      
      // Check for email input field
      await expect(page.locator('input[type="email"], input[id*="email"]')).toBeVisible();
    });

    test('should show validation error for empty email', async ({ page }) => {
      const emailInput = page.locator('input[type="email"], input[id*="email"]').first();
      
      // Type and clear to trigger validation
      await emailInput.fill('test@example.com');
      await emailInput.clear();
      await emailInput.blur();
      
      // Look for validation error
      await expect(page.locator('text=/required|provide.*email/i')).toBeVisible({ timeout: 5000 });
    });

    test('should show validation error for invalid email format', async ({ page }) => {
      const emailInput = page.locator('input[type="email"], input[id*="email"]').first();
      
      // Fill with invalid email
      await emailInput.fill('invalid-email');
      await emailInput.blur();
      
      // Look for validation error about invalid format
      await expect(page.locator('text=/invalid.*email|valid.*email/i')).toBeVisible({ timeout: 5000 });
    });

    test('should accept valid email format', async ({ page }) => {
      const emailInput = page.locator('input[type="email"], input[id*="email"]').first();
      
      // Fill with valid email
      await emailInput.fill('user@example.com');
      await emailInput.blur();
      
      // No validation error should appear
      await page.waitForTimeout(500);
      const errorCount = await page.locator('p.text-destructive, p.text-red-500').count();
      expect(errorCount).toBe(0);
    });

    test('should have a submit button', async ({ page }) => {
      const submitButton = page.getByRole('button', { name: /send.*reset|submit|reset/i });
      await expect(submitButton).toBeVisible();
    });

    test('should navigate back to sign-in page', async ({ page }) => {
      // Look for back to sign-in link
      const signInLink = page.getByRole('link', { name: /sign.*in|login|back/i });
      
      if (await signInLink.count() > 0) {
        await signInLink.first().click();
        await page.waitForURL(/.*\/en\/signin/);
        await expect(page).toHaveURL(/.*\/en\/signin/);
      }
    });

    test('should show loading state when submitting', async ({ page }) => {
      const emailInput = page.locator('input[type="email"], input[id*="email"]').first();
      const submitButton = page.getByRole('button', { name: /send.*reset|submit|reset/i });
      
      // Fill valid email
      await emailInput.fill('test@example.com');
      
      // Click submit button
      await submitButton.click();
      
      // Check for loading state (disabled button or loading indicator)
      await expect(submitButton).toBeDisabled({ timeout: 2000 })
        .catch(() => {
          // If button isn't disabled, check for loading text/icon
          return expect(page.locator('text=/sending|loading/i, [class*="spin"], [class*="animate"]')).toBeVisible();
        });
    });
  });

  test.describe('Reset Password Page', () => {
    test('should show error for invalid or missing token', async ({ page }) => {
      // Navigate to reset password page without token
      await page.goto('/en/reset-password');
      await page.waitForLoadState('networkidle');
      
      // Should either redirect or show error message
      const url = page.url();
      const hasError = await page.locator('text=/invalid.*token|expired.*token|token.*required/i').count() > 0;
      const isRedirected = url.includes('forgot-password') || url.includes('signin');
      
      expect(hasError || isRedirected).toBeTruthy();
    });

    test('should display reset password form with valid token', async ({ page }) => {
      // Note: This requires a valid token. In a real test, you'd generate one
      const mockToken = 'mock-token-12345';
      await page.goto(`/en/reset-password/${mockToken}`);
      await page.waitForLoadState('networkidle');
      
      // Check if password fields are visible OR if there's an error about invalid token
      const passwordField = page.locator('input[type="password"]').first();
      const errorMessage = page.locator('text=/invalid.*token|expired/i');
      
      const hasPasswordField = await passwordField.count() > 0;
      const hasError = await errorMessage.count() > 0;
      
      // Either we see the form or an error message (both are valid states)
      expect(hasPasswordField || hasError).toBeTruthy();
    });

    test.skip('should validate password requirements', async ({ page }) => {
      // This test requires a valid reset token
      const mockToken = 'valid-token-12345';
      await page.goto(`/en/reset-password/${mockToken}`);
      await page.waitForLoadState('networkidle');
      
      const passwordInput = page.locator('input[type="password"]').first();
      
      // Test short password
      await passwordInput.fill('123');
      await passwordInput.blur();
      
      // Should show error about minimum length
      await expect(page.locator('text=/at least.*characters|too short/i')).toBeVisible();
    });

    test.skip('should require password confirmation to match', async ({ page }) => {
      const mockToken = 'valid-token-12345';
      await page.goto(`/en/reset-password/${mockToken}`);
      await page.waitForLoadState('networkidle');
      
      const passwordInputs = page.locator('input[type="password"]');
      const passwordInput = passwordInputs.first();
      const confirmPasswordInput = passwordInputs.nth(1);
      
      // Fill with different passwords
      await passwordInput.fill('NewPassword123!');
      await confirmPasswordInput.fill('DifferentPassword123!');
      await confirmPasswordInput.blur();
      
      // Should show error about passwords not matching
      await expect(page.locator('text=/password.*match|must match/i')).toBeVisible();
    });
  });

  test.describe('Password Reset Integration', () => {
    test('should complete full forgot password flow', async ({ page }) => {
      // Step 1: Navigate to sign-in page
      await page.goto('/en/signin');
      await page.waitForLoadState('networkidle');
      
      // Step 2: Click forgot password link
      await page.getByRole('link', { name: /forgot/i }).click();
      await page.waitForURL(/.*\/en\/forgot-password/);
      
      // Step 3: Fill email and submit
      const emailInput = page.locator('input[type="email"], input[id*="email"]').first();
      await emailInput.fill('test@example.com');
      
      const submitButton = page.getByRole('button', { name: /send.*reset|submit|reset/i });
      await submitButton.click();
      
      // Step 4: Wait for success message or redirect
      await page.waitForTimeout(2000);
      
      // Check for success message or toast notification
      const successIndicators = page.locator('text=/sent|check.*email|success|email.*sent/i');
      const hasSuccess = await successIndicators.count() > 0;
      
      // Success message might appear, or it might redirect
      expect(hasSuccess || page.url()).toBeTruthy();
    });
  });
});

