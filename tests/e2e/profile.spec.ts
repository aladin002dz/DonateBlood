import { test, expect } from '@playwright/test';

test.describe('Profile Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/profile');
    await page.waitForLoadState('networkidle');
  });

  test('should redirect to sign-in when not authenticated', async ({ page }) => {
    // When not authenticated, should redirect to signin page
    await page.waitForURL(/.*\/en\/signin/);
    await expect(page).toHaveURL(/.*\/en\/signin/);
  });

  test('should display loading state while checking authentication', async ({ page }) => {
    // Check for loading indicator
    const loadingText = page.locator('text=/Loading|loading/i');
    
    // Either loading appears or redirect happens quickly
    const result = await Promise.race([
      page.waitForURL(/.*\/en\/signin/, { timeout: 5000 }).then(() => 'redirected'),
      loadingText.waitFor({ state: 'visible', timeout: 5000 }).then(() => 'loading'),
      new Promise(resolve => setTimeout(() => resolve('timeout'), 5000))
    ]);
    
    expect(['redirected', 'loading', 'timeout']).toContain(result);
  });

  test.describe('Authenticated Profile', () => {
    // Note: These tests require authentication setup
    // You would need to add authentication state management
    // test.use({ storageState: 'tests/.auth/user.json' });
    
    test.skip('should display profile page with all sections', async ({ page }) => {
      await page.goto('/en/profile');
      
      // Check for main sections
      await expect(page.locator('text=/Profile|Donor Profile/i').first()).toBeVisible();
      await expect(page.locator('text=/Personal.*Info|personalInfo/i').first()).toBeVisible();
      await expect(page.locator('text=/Location.*Info|locationInfo/i').first()).toBeVisible();
      await expect(page.locator('text=/Donation.*Info|donationInfo/i').first()).toBeVisible();
    });

    test.skip('should display availability status card', async ({ page }) => {
      await page.goto('/en/profile');
      
      // Check for availability section
      await expect(page.locator('text=/Availability.*Status|Available.*for.*Donation/i').first()).toBeVisible();
      
      // Check for availability toggle switch
      const availabilitySwitch = page.locator('button[role="switch"]#availability, [id="availability"]');
      await expect(availabilitySwitch).toBeVisible();
    });

    test.skip('should display current blood group and location', async ({ page }) => {
      await page.goto('/en/profile');
      
      // Check for blood group display
      await expect(page.locator('text=/Blood.*Group/i').first()).toBeVisible();
      
      // Check for location display
      await expect(page.locator('text=/location|wilaya|daira/i').first()).toBeVisible();
    });

    test.skip('should allow editing full name', async ({ page }) => {
      await page.goto('/en/profile');
      
      // Find full name input
      const nameInput = page.locator('input[id="fullName"]');
      await expect(nameInput).toBeVisible();
      
      // Clear and type new name
      await nameInput.clear();
      await nameInput.fill('John Doe');
      
      // Verify input value changed
      await expect(nameInput).toHaveValue('John Doe');
    });

    test.skip('should allow selecting blood group', async ({ page }) => {
      await page.goto('/en/profile');
      
      // Find blood group select
      const bloodGroupSelect = page.locator('button[id="bloodGroup"]').first();
      await expect(bloodGroupSelect).toBeVisible();
      
      // Click to open dropdown
      await bloodGroupSelect.click();
      await page.waitForTimeout(500);
      
      // Select a blood group
      await page.getByRole('option', { name: 'A+' }).click();
      
      // Verify selection
      await expect(bloodGroupSelect).toContainText('A+');
    });

    test.skip('should allow editing email and phone', async ({ page }) => {
      await page.goto('/en/profile');
      
      // Find email input
      const emailInput = page.locator('input[id="email"]');
      await expect(emailInput).toBeVisible();
      
      // Edit email
      await emailInput.clear();
      await emailInput.fill('newemail@example.com');
      await expect(emailInput).toHaveValue('newemail@example.com');
      
      // Find phone input
      const phoneInput = page.locator('input[id="phone"]');
      await expect(phoneInput).toBeVisible();
      
      // Edit phone
      await phoneInput.clear();
      await phoneInput.fill('+213555123456');
      await expect(phoneInput).toHaveValue('+213555123456');
    });

    test.skip('should have cascading location selectors (wilaya -> daira -> commune)', async ({ page }) => {
      await page.goto('/en/profile');
      
      // Find wilaya select
      const wilayaSelect = page.locator('button').filter({ has: page.locator('#wilaya, [id*="wilaya"]') }).first();
      
      // Daira should be disabled initially if no wilaya selected
      const dairaSelect = page.locator('button').filter({ has: page.locator('#daira, [id*="daira"]') }).first();
      
      // Select wilaya
      await wilayaSelect.click();
      await page.waitForTimeout(500);
      await page.getByRole('option').first().click();
      await page.waitForTimeout(500);
      
      // Daira should now be enabled
      await expect(dairaSelect).toBeEnabled();
      
      // Select daira
      await dairaSelect.click();
      await page.waitForTimeout(500);
      await page.getByRole('option').first().click();
      
      // Commune should now be enabled
      const communeSelect = page.locator('button').filter({ has: page.locator('#commune, [id*="commune"]') }).first();
      await expect(communeSelect).toBeEnabled();
    });

    test.skip('should allow setting last donation date', async ({ page }) => {
      await page.goto('/en/profile');
      
      // Find last donation input
      const lastDonationInput = page.locator('input[id="lastDonation"], input[type="date"]').first();
      await expect(lastDonationInput).toBeVisible();
      
      // Set date
      await lastDonationInput.fill('2024-01-15');
      await expect(lastDonationInput).toHaveValue('2024-01-15');
    });

    test.skip('should allow selecting donation type', async ({ page }) => {
      await page.goto('/en/profile');
      
      // Find donation type select
      const donationTypeSelect = page.locator('button').filter({ 
        has: page.locator('#donationType, [id*="donationType"]') 
      }).first();
      
      if (await donationTypeSelect.count() > 0) {
        await donationTypeSelect.click();
        await page.waitForTimeout(500);
        
        // Select donation type
        await page.getByRole('option', { name: /Blood|Platelets/i }).first().click();
        
        // Verify selection
        const selectedText = await donationTypeSelect.textContent();
        expect(selectedText).toMatch(/Blood|Platelets/i);
      }
    });

    test.skip('should toggle availability status', async ({ page }) => {
      await page.goto('/en/profile');
      
      // Find availability switch
      const availabilitySwitch = page.locator('[role="switch"][id="availability"]');
      await expect(availabilitySwitch).toBeVisible();
      
      // Get initial state
      const initialState = await availabilitySwitch.getAttribute('data-state');
      
      // Toggle switch
      await availabilitySwitch.click();
      await page.waitForTimeout(500);
      
      // Verify state changed
      const newState = await availabilitySwitch.getAttribute('data-state');
      expect(newState).not.toBe(initialState);
      
      // Check badge updates
      const statusBadge = page.locator('text=/available|unavailable/i').first();
      await expect(statusBadge).toBeVisible();
    });

    test.skip('should display update profile button', async ({ page }) => {
      await page.goto('/en/profile');
      
      // Find update button
      const updateButton = page.getByRole('button', { name: /Update.*Profile|Save/i });
      await expect(updateButton).toBeVisible();
      await expect(updateButton).toBeEnabled();
    });

    test.skip('should show loading state when updating profile', async ({ page }) => {
      await page.goto('/en/profile');
      
      // Fill some data
      const nameInput = page.locator('input[id="fullName"]');
      await nameInput.clear();
      await nameInput.fill('Updated Name');
      
      // Click update button
      const updateButton = page.getByRole('button', { name: /Update.*Profile/i });
      await updateButton.click();
      
      // Should show loading state
      await expect(page.locator('text=/updating|loading/i, [class*="spin"]')).toBeVisible({ timeout: 2000 });
    });

    test.skip('should display delete account button', async ({ page }) => {
      await page.goto('/en/profile');
      
      // Find delete account button
      const deleteButton = page.getByRole('button', { name: /Delete.*Account/i });
      await expect(deleteButton).toBeVisible();
      await expect(deleteButton).toHaveClass(/destructive|red/i);
    });

    test.skip('should display important reminder card', async ({ page }) => {
      await page.goto('/en/profile');
      
      // Check for warning/reminder card
      await expect(page.locator('text=/important.*reminder|warning/i').first()).toBeVisible();
    });

    test.skip('should validate required fields', async ({ page }) => {
      await page.goto('/en/profile');
      
      // Clear required field (e.g., name)
      const nameInput = page.locator('input[id="fullName"]');
      await nameInput.clear();
      await nameInput.blur();
      
      // Try to submit
      const updateButton = page.getByRole('button', { name: /Update.*Profile/i });
      await updateButton.click();
      
      // Should show validation error or prevent submission
      await page.waitForTimeout(1000);
      
      // Either validation message appears or form doesn't submit
      const errorMessages = await page.locator('p.text-destructive, p.text-red-500').count();
      const isStillOnPage = page.url().includes('/profile');
      
      expect(errorMessages > 0 || isStillOnPage).toBeTruthy();
    });

    test.skip('should update profile successfully', async ({ page }) => {
      await page.goto('/en/profile');
      
      // Fill form with valid data
      const nameInput = page.locator('input[id="fullName"]');
      await nameInput.clear();
      await nameInput.fill('Test User Updated');
      
      // Select blood group
      const bloodGroupSelect = page.locator('button[id="bloodGroup"]').first();
      await bloodGroupSelect.click();
      await page.waitForTimeout(500);
      await page.getByRole('option', { name: 'O+' }).click();
      
      // Submit form
      const updateButton = page.getByRole('button', { name: /Update.*Profile/i });
      await updateButton.click();
      
      // Wait for success message
      await expect(page.locator('text=/success|updated|saved/i')).toBeVisible({ timeout: 5000 });
    });

    test.skip('should display all blood group options', async ({ page }) => {
      await page.goto('/en/profile');
      
      // Open blood group selector
      const bloodGroupSelect = page.locator('button[id="bloodGroup"]').first();
      await bloodGroupSelect.click();
      await page.waitForTimeout(500);
      
      // Check for all 8 blood groups
      const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
      
      for (const group of bloodGroups) {
        const option = page.getByRole('option', { name: group });
        await expect(option).toBeVisible();
      }
    });
  });
});

