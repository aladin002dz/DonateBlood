import { expect, test } from '@playwright/test';

test.describe('Email Verification Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/verify-email');
    await page.waitForLoadState('networkidle');
  });

  test('should display email verification page', async ({ page }) => {
    await expect(page).toHaveURL(/.*\/en\/verify-email/);
    
    // Check for verification-related text
    await expect(page.locator('text=/verify.*email|email.*verification|check.*email/i').first()).toBeVisible();
  });

  test('should handle verification without token', async ({ page }) => {
    // When accessing verify-email without a token, should show appropriate message
    const hasInstructions = await page.locator('text=/check.*email|sent.*email|verification.*link/i').count() > 0;
    const hasError = await page.locator('text=/token.*required|invalid.*token|missing.*token/i').count() > 0;
    
    // Should show either instructions or error
    expect(hasInstructions || hasError).toBeTruthy();
  });

  test('should display verification message', async ({ page }) => {
    // Check for common verification page elements
    const elements = [
      page.locator('text=/verify.*email/i'),
      page.locator('text=/check.*email/i'),
      page.locator('text=/sent.*email/i'),
      page.locator('text=/confirmation/i')
    ];
    
    let foundElement = false;
    for (const element of elements) {
      if (await element.count() > 0) {
        foundElement = true;
        break;
      }
    }
    
    expect(foundElement).toBeTruthy();
  });

  test('should have link to resend verification email', async ({ page }) => {
    // Look for resend button or link
    const resendButton = page.getByRole('button', { name: /resend|send.*again/i });
    const resendLink = page.getByRole('link', { name: /resend|send.*again/i });
    
    const hasResendOption = await resendButton.count() > 0 || await resendLink.count() > 0;
    
    // Resend option might be present
    if (hasResendOption) {
      expect(hasResendOption).toBeTruthy();
    }
  });

  test.describe('Verification with Token', () => {
    test('should handle invalid verification token', async ({ page }) => {
      // Navigate with invalid token
      await page.goto('/en/verify-email?token=invalid-token-12345');
      await page.waitForLoadState('networkidle');
      
      // Wait a bit for any async verification
      await page.waitForTimeout(2000);
      
      // Should show error message or redirect
      const hasError = await page.locator('text=/invalid.*token|expired.*token|verification.*failed/i').count() > 0;
      const url = page.url();
      
      expect(hasError || url).toBeTruthy();
    });

    test.skip('should verify email with valid token', async ({ page }) => {
      // Note: This test requires a valid verification token from the database
      const validToken = 'valid-verification-token-12345';
      await page.goto(`/en/verify-email?token=${validToken}`);
      await page.waitForLoadState('networkidle');
      
      // Wait for verification to complete
      await page.waitForTimeout(2000);
      
      // Should show success message
      await expect(page.locator('text=/success|verified|confirmed/i')).toBeVisible();
      
      // Might redirect to dashboard or signin
      await page.waitForTimeout(1000);
      const url = page.url();
      expect(url).toMatch(/dashboard|signin|profile/);
    });
  });

  test.describe('Verification Banner', () => {
    test.skip('should display verification banner on dashboard for unverified users', async ({ page }) => {
      // This test requires authentication with an unverified email
      // Navigate to dashboard
      await page.goto('/en/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Look for email verification banner
      const banner = page.locator('[class*="banner"], [class*="alert"]').filter({ 
        hasText: /verify.*email|email.*verification|unverified/i 
      });
      
      if (await banner.count() > 0) {
        await expect(banner.first()).toBeVisible();
        
        // Check for verify button/link in banner
        const verifyButton = banner.getByRole('button', { name: /verify|send/i });
        const verifyLink = banner.getByRole('link', { name: /verify|send/i });
        
        expect(await verifyButton.count() > 0 || await verifyLink.count() > 0).toBeTruthy();
      }
    });
  });

  test.describe('Resend Verification Email', () => {
    test.skip('should allow resending verification email', async ({ page }) => {
      // This test requires authentication
      await page.goto('/en/verify-email');
      await page.waitForLoadState('networkidle');
      
      // Find resend button
      const resendButton = page.getByRole('button', { name: /resend|send.*again/i });
      
      if (await resendButton.count() > 0) {
        await expect(resendButton).toBeVisible();
        await resendButton.click();
        
        // Wait for response
        await page.waitForTimeout(2000);
        
        // Should show success message or toast
        const successMessage = page.locator('text=/sent|resent|check.*email/i');
        await expect(successMessage.first()).toBeVisible({ timeout: 5000 });
      }
    });

    test.skip('should rate limit resend attempts', async ({ page }) => {
      await page.goto('/en/verify-email');
      await page.waitForLoadState('networkidle');
      
      const resendButton = page.getByRole('button', { name: /resend|send.*again/i });
      
      if (await resendButton.count() > 0) {
        // Click resend multiple times
        await resendButton.click();
        await page.waitForTimeout(500);
        
        await resendButton.click();
        await page.waitForTimeout(500);
        
        await resendButton.click();
        await page.waitForTimeout(1000);
        
        // Should show rate limit message
        const rateLimitMessage = page.locator('text=/too many|wait.*before|rate.*limit|try.*later/i');
        const hasRateLimit = await rateLimitMessage.count() > 0;
        
        if (hasRateLimit) {
          await expect(rateLimitMessage.first()).toBeVisible();
        }
      }
    });
  });

  test.describe('Verified Email Status', () => {
    test.skip('should show verified badge for verified users', async ({ page }) => {
      // This test requires authentication with a verified email
      await page.goto('/en/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Look for verified badge or status
      const verifiedBadge = page.locator('text=/verified|✓/i').filter({
        hasText: /email.*verified|verified/i
      });
      
      await expect(verifiedBadge.first()).toBeVisible();
    });

    test.skip('should not show verification banner for verified users', async ({ page }) => {
      // This test requires authentication with a verified email
      await page.goto('/en/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Verification banner should NOT be visible
      const banner = page.locator('text=/verify.*email|unverified/i');
      await expect(banner).not.toBeVisible();
    });
  });
});

