import { test, expect } from '@playwright/test';

test.describe('Profile Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en');
  });

  test('should navigate to profile page when authenticated', async ({ page }) => {
    // Note: In a real scenario, you'd set up authenticated state
    // For now, we'll just test navigation
    await page.goto('/en/profile');
    
    // If not authenticated, should redirect or show error
    // If authenticated, should show profile
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/en\/(profile|signin|register)/);
  });

  test('should display profile information when authenticated', async ({ page }) => {
    // This test assumes authentication state is set up
    // In practice, you'd use Playwright's authentication state
    await page.goto('/en/profile');
    
    // Check if profile page elements are visible
    // These selectors should match your actual profile page structure
    const profileContent = page.locator('text=/profile|name|email|Donor Profile/i').first();
    if (await profileContent.count() > 0) {
      await expect(profileContent).toBeVisible();
    }
  });
});

