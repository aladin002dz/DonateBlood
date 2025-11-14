import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en');
  });

  test('should navigate to search page', async ({ page }) => {
    // Assuming user is logged in (you may need to set up auth state)
    await page.goto('/en/search');
    await expect(page).toHaveURL(/.*\/en\/search/);
  });

  test('should display search filters', async ({ page }) => {
    await page.goto('/en/search');
    
    // Check for blood group filter - it's a Select component (combobox) with id="bloodGroup"
    const bloodGroupFilter = page.locator('button[id="bloodGroup"], [role="combobox"][id="bloodGroup"]').first();
    await expect(bloodGroupFilter).toBeVisible();
    
    // Also check for the label
    await expect(page.getByText('Blood Group')).toBeVisible();
  });

  test('should allow filtering by blood group', async ({ page }) => {
    await page.goto('/en/search');
    
    // The blood group filter is a Select component (Radix UI) which renders as a button/combobox
    const bloodGroupSelect = page.locator('button[id="bloodGroup"]').first();
    await expect(bloodGroupSelect).toBeVisible();
    
    // Click to open the select dropdown
    await bloodGroupSelect.click();
    
    // Wait for the dropdown to appear and select an option
    await page.getByRole('option', { name: 'O+' }).click();
    
    // Wait for results to update (the page uses useEffect to reload on filter change)
    await page.waitForTimeout(1000);
    
    // Verify the select value has changed (optional check)
    await expect(bloodGroupSelect).toContainText('O+');
  });
});

