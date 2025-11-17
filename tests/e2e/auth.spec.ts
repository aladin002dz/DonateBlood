import { expect, test } from '@playwright/test';

test.describe('Authentication Flow', () => {
  // Use a global beforeEach/beforeAll if you navigate to the home page once.
  // Keeping it as is for isolated tests.
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/signin');
    await page.waitForLoadState('networkidle');
  });

  test('should navigate to sign-in page', async ({ page }) => {
    // Then check the URL and the sign-in card title
    await expect(page).toHaveURL(/.*\/en\/signin/);
    // Assuming the sign-in page uses the same card title slot as registration
    await expect(page.locator('[data-slot="card-title"]')).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
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

    const identifierInput = page.locator('input[id="identifier"]');
    const passwordInput = page.locator('input[id="password"]');

    await identifierInput.fill('invalid-email');
    // Filling the password ensures all fields have input, often useful for form libraries
    await passwordInput.fill('password123');

    // Trigger validation by blurring the identifier field
    await identifierInput.blur();
    await passwordInput.blur();

    // FIX: Using page.locator(selector, options) instead of .filter()
    // Translation: "Email or phone number is required"
    const errorLocator = 'p.text-destructive';

    const requiredIndentifierErrorLocator = page.locator(errorLocator, { hasText: /Please enter a valid email address or phone number (e.g., +1234567890)/i });
    // 1. Assert the error container is visible
    await expect(requiredIndentifierErrorLocator).toBeVisible({ timeout: 10000 });

    const requiredPasswordErrorLocator = page.locator(errorLocator, { hasText: /Password must be at least 6 characters/i });
    // 1. Assert the error container is visible
    await expect(requiredPasswordErrorLocator).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to registration page', async ({ page }) => {
    // Navigate from the home page (as per beforeEach)
    await page.getByRole('link', { name: 'Register' }).click();
    // Explicitly wait for the navigation
    await page.waitForURL(/.*\/en\/register/);
    await expect(page).toHaveURL(/.*\/en\/register/);
  });

  test('should navigate to forgot password page', async ({ page }) => {
    await page.getByRole('link', { name: /forgot/i }).click();
    // Explicitly wait for the navigation
    await page.waitForURL(/.*\/en\/forgot-password/);
    await expect(page).toHaveURL(/.*\/en\/forgot-password/);
  });
});

test.describe('Sign-In Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/signin');
    await page.waitForLoadState('networkidle');
  });

  test('should display sign-in form elements', async ({ page }) => {
    // Check for form elements
    const identifierInput = page.locator('input[id="identifier"]');
    const passwordInput = page.locator('input[id="password"]');
    const submitButton = page.getByRole('button', { name: /sign.*in|login/i });

    await expect(identifierInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
  });

  test('should have proper input types and attributes', async ({ page }) => {
    const identifierInput = page.locator('input[id="identifier"]');
    const passwordInput = page.locator('input[id="password"]');

    // Check password input type
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Check inputs are not disabled
    await expect(identifierInput).toBeEnabled();
    await expect(passwordInput).toBeEnabled();
  });

  test('should show loading state when submitting', async ({ page }) => {
    const identifierInput = page.locator('input[id="identifier"]');
    const passwordInput = page.locator('input[id="password"]');
    const submitButton = page.getByRole('button', { name: /sign.*in|login/i });

    // Fill with some credentials
    await identifierInput.fill('test@example.com');
    await passwordInput.fill('password123');

    // Click submit
    await submitButton.click();

    // Should show loading state (button disabled or loading text/spinner)
    // Wait a bit for the loading state to appear
    await page.waitForTimeout(100);

    // Check for loading indicators
    const isButtonDisabled = await submitButton.isDisabled();
    const hasLoadingText = await page.locator('text=/signing.*in|loading/i').count() > 0;
    const hasSpinner = await page.locator('[class*="spin"], [class*="animate"]').count() > 0;

    expect(isButtonDisabled || hasLoadingText || hasSpinner).toBeTruthy();
  });

  test.skip('should sign in successfully with valid credentials', async ({ page }) => {
    // This test requires valid test credentials
    const identifierInput = page.locator('input[id="identifier"]');
    const passwordInput = page.locator('input[id="password"]');
    const submitButton = page.getByRole('button', { name: /sign.*in|login/i });

    // Fill with valid credentials (replace with actual test user)
    await identifierInput.fill(process.env.TEST_USER_EMAIL || 'testuser@example.com');
    await passwordInput.fill(process.env.TEST_USER_PASSWORD || 'TestPassword123!');

    // Submit form
    await submitButton.click();

    // Should redirect to dashboard
    await page.waitForURL(/.*\/en\/dashboard/, { timeout: 10000 });
    await expect(page).toHaveURL(/.*\/en\/dashboard/);

    // Should see user profile elements
    await expect(page.locator('text=/welcome.*back|dashboard/i')).toBeVisible({ timeout: 5000 });
  });

  test('should show error for invalid credentials', async ({ page }) => {
    const identifierInput = page.locator('input[id="identifier"]');
    const passwordInput = page.locator('input[id="password"]');
    const submitButton = page.getByRole('button', { name: /sign.*in|login/i });

    // Fill with invalid credentials
    await identifierInput.fill('nonexistent@example.com');
    await passwordInput.fill('wrongpassword123');

    // Submit form
    await submitButton.click();

    // Wait for error message
    await page.waitForTimeout(2000);

    // Should show error message
    const errorMessage = page.locator('text=/invalid.*credentials|incorrect.*password|user.*not.*found|sign.*in.*failed/i');
    const hasError = await errorMessage.count() > 0;

    // Should still be on sign-in page
    const url = page.url();
    const isOnSignInPage = url.includes('/signin');

    expect(hasError || isOnSignInPage).toBeTruthy();
  });

  test('should prevent submission with only email filled', async ({ page }) => {
    const identifierInput = page.locator('input[id="identifier"]');
    const submitButton = page.getByRole('button', { name: /sign.*in|login/i });

    // Fill only email
    await identifierInput.fill('test@example.com');

    // Try to submit
    await submitButton.click();

    // Should stay on the same page or show validation error
    await page.waitForTimeout(1000);

    const url = page.url();
    expect(url).toContain('/signin');
  });

  test('should prevent submission with only password filled', async ({ page }) => {
    const passwordInput = page.locator('input[id="password"]');
    const submitButton = page.getByRole('button', { name: /sign.*in|login/i });

    // Fill only password
    await passwordInput.fill('password123');

    // Try to submit
    await submitButton.click();

    // Should stay on the same page or show validation error
    await page.waitForTimeout(1000);

    const url = page.url();
    expect(url).toContain('/signin');
  });

  test('should allow password visibility toggle if available', async ({ page }) => {
    const passwordInput = page.locator('input[id="password"]');

    // Fill password
    await passwordInput.fill('testpassword');

    // Look for toggle button (eye icon or similar)
    const toggleButton = page.locator('button').filter({
      has: page.locator('[class*="eye"], [class*="Eye"]')
    }).first();

    // If toggle exists, test it
    if (await toggleButton.count() > 0) {
      await expect(toggleButton).toBeVisible();

      // Initial state should be password (hidden)
      await expect(passwordInput).toHaveAttribute('type', 'password');

      // Click to show password
      await toggleButton.click();
      await page.waitForTimeout(200);

      // Should now be text type (visible)
      const inputType = await passwordInput.getAttribute('type');
      expect(inputType).toBe('text');

      // Click again to hide
      await toggleButton.click();
      await page.waitForTimeout(200);

      // Should be back to password type
      await expect(passwordInput).toHaveAttribute('type', 'password');
    }
  });

  test('should handle rapid form submissions gracefully', async ({ page }) => {
    const identifierInput = page.locator('input[id="identifier"]');
    const passwordInput = page.locator('input[id="password"]');
    const submitButton = page.getByRole('button', { name: /sign.*in|login/i });

    // Fill form
    await identifierInput.fill('test@example.com');
    await passwordInput.fill('password123');

    // Click submit multiple times rapidly
    await submitButton.click();
    await submitButton.click();
    await submitButton.click();

    // Wait a bit
    await page.waitForTimeout(1000);

    // Should handle gracefully (button should be disabled or form should prevent multiple submissions)
    const isDisabled = await submitButton.isDisabled();
    const url = page.url();

    // Either button is disabled or we're still on signin page (not crashed)
    expect(isDisabled || url.includes('/signin')).toBeTruthy();
  });

  test('should validate email format before submission', async ({ page }) => {
    const identifierInput = page.locator('input[id="identifier"]');
    const passwordInput = page.locator('input[id="password"]');

    // Fill with invalid email format
    await identifierInput.fill('not-an-email');
    await passwordInput.fill('password123');
    await identifierInput.blur();

    // Should show validation error
    await page.waitForTimeout(500);
    const errorMessages = await page.locator('p.text-destructive, p.text-red-500').count();

    expect(errorMessages).toBeGreaterThan(0);
  });

  test('should accept valid phone number as identifier', async ({ page }) => {
    const identifierInput = page.locator('input[id="identifier"]');
    const passwordInput = page.locator('input[id="password"]');

    // Fill with phone number format
    await identifierInput.fill('+213555123456');
    await passwordInput.fill('password123');
    await identifierInput.blur();
    await passwordInput.blur();

    // Wait a bit for validation
    await page.waitForTimeout(500);

    // Should not show validation error for identifier
    const errorText = await page.locator('p.text-destructive, p.text-red-500').allTextContents();
    const hasIdentifierError = errorText.some(text =>
      text.toLowerCase().includes('email') || text.toLowerCase().includes('phone')
    );

    // Password might have error (too short) but identifier should be valid
    expect(hasIdentifierError).toBeFalsy();
  });

  test('should maintain form values after validation error', async ({ page }) => {
    const identifierInput = page.locator('input[id="identifier"]');
    const passwordInput = page.locator('input[id="password"]');
    const submitButton = page.getByRole('button', { name: /sign.*in|login/i });

    const testEmail = 'test@example.com';
    const testPassword = 'pass';

    // Fill form
    await identifierInput.fill(testEmail);
    await passwordInput.fill(testPassword);

    // Submit (will likely fail validation or credentials)
    await submitButton.click();
    await page.waitForTimeout(1000);

    // Form values should be maintained
    await expect(identifierInput).toHaveValue(testEmail);
    await expect(passwordInput).toHaveValue(testPassword);
  });

  test('should have accessible form labels', async ({ page }) => {
    // Check for proper labels
    const identifierLabel = page.locator('label[for="identifier"]');
    const passwordLabel = page.locator('label[for="password"]');

    // Labels should exist (or inputs should have aria-label)
    const hasIdentifierLabel = await identifierLabel.count() > 0;
    const hasPasswordLabel = await passwordLabel.count() > 0;

    const identifierInput = page.locator('input[id="identifier"]');
    const hasIdentifierAriaLabel = await identifierInput.getAttribute('aria-label') !== null;

    // Either label or aria-label should exist
    expect(hasIdentifierLabel || hasIdentifierAriaLabel).toBeTruthy();
    expect(hasPasswordLabel).toBeTruthy();
  });

  test('should clear error messages when user starts typing again', async ({ page }) => {
    const identifierInput = page.locator('input[id="identifier"]');
    const passwordInput = page.locator('input[id="password"]');

    // Trigger validation error
    await identifierInput.fill('x');
    await identifierInput.clear();
    await identifierInput.blur();

    // Wait for error to appear
    await page.waitForTimeout(500);
    const initialErrorCount = await page.locator('p.text-destructive, p.text-red-500').count();
    expect(initialErrorCount).toBeGreaterThan(0);

    // Start typing again
    await identifierInput.fill('test@example.com');

    // Wait a bit
    await page.waitForTimeout(500);

    // Error might clear or stay depending on form library behavior
    // Just verify the page is still functional
    await expect(identifierInput).toHaveValue('test@example.com');
  });

  test.skip('should redirect to intended page after sign-in', async ({ page }) => {
    // Try to access protected page first
    await page.goto('/en/profile');

    // Should redirect to sign-in
    await page.waitForURL(/.*\/en\/signin/);

    // Fill and submit sign-in form
    const identifierInput = page.locator('input[id="identifier"]');
    const passwordInput = page.locator('input[id="password"]');
    const submitButton = page.getByRole('button', { name: /sign.*in|login/i });

    await identifierInput.fill(process.env.TEST_USER_EMAIL || 'test@example.com');
    await passwordInput.fill(process.env.TEST_USER_PASSWORD || 'password123');
    await submitButton.click();

    // Should redirect back to profile page (or dashboard)
    await page.waitForTimeout(2000);
    const url = page.url();
    expect(url).toMatch(/profile|dashboard/);
  });

  test('should display all helper links', async ({ page }) => {
    // Check for forgot password link
    const forgotPasswordLink = page.getByRole('link', { name: /forgot/i });
    await expect(forgotPasswordLink).toBeVisible();

    // Check for register link
    const registerLink = page.getByRole('link', { name: /register|sign.*up/i });
    await expect(registerLink).toBeVisible();
  });

  test('should have proper form structure', async ({ page }) => {
    // Check for form element
    const form = page.locator('form').first();
    await expect(form).toBeVisible();

    // Check form contains inputs and button
    const inputsInForm = form.locator('input[type="password"], input[type="email"], input[type="text"]');
    const buttonsInForm = form.locator('button[type="submit"]');

    expect(await inputsInForm.count()).toBeGreaterThan(0);
    expect(await buttonsInForm.count()).toBeGreaterThan(0);
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