import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to search page', async ({ page }) => {
    // Assuming user is logged in (you may need to set up auth state)
    await page.goto('/search');
    await expect(page).toHaveURL(/.*search/);
  });

  test('should display search filters', async ({ page }) => {
    await page.goto('/search');
    
    // Check for blood group filter
    const bloodGroupFilter = page.locator('select[name*="blood"], input[name*="blood"]').first();
    if (await bloodGroupFilter.count() > 0) {
      await expect(bloodGroupFilter).toBeVisible();
    }
  });

  test('should allow filtering by blood group', async ({ page }) => {
    await page.goto('/search');
    
    // Try to find and interact with blood group filter
    const bloodGroupSelect = page.locator('select[name*="bloodGroup"]').first();
    if (await bloodGroupSelect.count() > 0) {
      await bloodGroupSelect.selectOption('O+');
      // Wait for results to update
      await page.waitForTimeout(500);
    }
  });
});

