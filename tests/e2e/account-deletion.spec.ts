import { expect, test } from '@playwright/test';

test.describe('Account Deletion Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to profile page where delete account is located
    await page.goto('/en/profile');
    await page.waitForLoadState('networkidle');
  });

  test('should redirect to sign-in when not authenticated', async ({ page }) => {
    // When not authenticated, should redirect to signin
    await page.waitForURL(/.*\/en\/signin/);
    await expect(page).toHaveURL(/.*\/en\/signin/);
  });

  test.describe('Authenticated Account Deletion', () => {
    // Note: These tests require authentication setup
    // You would need to add authentication state management in Playwright
    
    test.skip('should display delete account button', async ({ page }) => {
      await page.goto('/en/profile');
      await page.waitForLoadState('networkidle');
      
      // Look for delete account button
      const deleteButton = page.getByRole('button', { name: /delete.*account|Delete Account/i });
      await expect(deleteButton).toBeVisible();
    });

    test.skip('should open confirmation dialog when delete button clicked', async ({ page }) => {
      await page.goto('/en/profile');
      await page.waitForLoadState('networkidle');
      
      // Click delete account button
      const deleteButton = page.getByRole('button', { name: /delete.*account|Delete Account/i });
      await deleteButton.click();
      
      // Wait for dialog to appear
      await page.waitForTimeout(500);
      
      // Check for dialog elements
      await expect(page.locator('[role="alertdialog"], [role="dialog"]')).toBeVisible();
      await expect(page.locator('text=/delete.*account|permanently.*delete/i').first()).toBeVisible();
    });

    test.skip('should display warning information in dialog', async ({ page }) => {
      await page.goto('/en/profile');
      await page.waitForLoadState('networkidle');
      
      // Open delete dialog
      const deleteButton = page.getByRole('button', { name: /delete.*account|Delete Account/i });
      await deleteButton.click();
      await page.waitForTimeout(500);
      
      // Check for warning elements
      await expect(page.locator('text=/warning|permanently|cannot.*undo|irreversible/i')).toBeVisible();
      
      // Check for list of what will be deleted
      const deletionList = [
        /profile.*info|personal.*info/i,
        /donation.*history/i,
        /availability/i,
        /session/i
      ];
      
      for (const pattern of deletionList) {
        const element = page.locator(`text=${pattern}`);
        if (await element.count() > 0) {
          await expect(element.first()).toBeVisible();
        }
      }
    });

    test.skip('should require confirmation text to enable delete button', async ({ page }) => {
      await page.goto('/en/profile');
      await page.waitForLoadState('networkidle');
      
      // Open delete dialog
      const deleteButton = page.getByRole('button', { name: /delete.*account|Delete Account/i });
      await deleteButton.click();
      await page.waitForTimeout(500);
      
      // Find the confirmation input
      const confirmInput = page.locator('input[id="confirm-delete"], input[placeholder*="DELETE"], input[placeholder*="delete"]').first();
      await expect(confirmInput).toBeVisible();
      
      // Find the final delete button in the dialog
      const confirmDeleteButton = page.locator('[role="alertdialog"], [role="dialog"]')
        .getByRole('button', { name: /delete|confirm/i })
        .filter({ hasNot: page.locator('[name*="cancel"]') })
        .last();
      
      // Button should be disabled initially
      await expect(confirmDeleteButton).toBeDisabled();
      
      // Type incorrect confirmation
      await confirmInput.fill('wrong text');
      await expect(confirmDeleteButton).toBeDisabled();
      
      // Type correct confirmation (usually "DELETE" or similar)
      // Note: Check your actual confirmation text requirement
      await confirmInput.clear();
      await confirmInput.fill('DELETE');
      
      // Button might still be disabled if exact text doesn't match
      // This depends on your implementation
    });

    test.skip('should show loading state while deleting', async ({ page }) => {
      await page.goto('/en/profile');
      await page.waitForLoadState('networkidle');
      
      // Open delete dialog
      const deleteButton = page.getByRole('button', { name: /delete.*account|Delete Account/i });
      await deleteButton.click();
      await page.waitForTimeout(500);
      
      // Fill confirmation
      const confirmInput = page.locator('input[id="confirm-delete"]').first();
      await confirmInput.fill('DELETE'); // Use actual confirmation text
      
      // Click confirm delete button
      const confirmDeleteButton = page.locator('[role="alertdialog"]')
        .getByRole('button', { name: /delete|confirm/i })
        .last();
      
      await confirmDeleteButton.click();
      
      // Should show loading state
      await expect(page.locator('text=/deleting|loading/i, [class*="spin"], [class*="animate"]')).toBeVisible({ timeout: 2000 });
    });

    test.skip('should allow canceling deletion', async ({ page }) => {
      await page.goto('/en/profile');
      await page.waitForLoadState('networkidle');
      
      // Open delete dialog
      const deleteButton = page.getByRole('button', { name: /delete.*account|Delete Account/i });
      await deleteButton.click();
      await page.waitForTimeout(500);
      
      // Find cancel button
      const cancelButton = page.locator('[role="alertdialog"]')
        .getByRole('button', { name: /cancel/i });
      await expect(cancelButton).toBeVisible();
      
      // Click cancel
      await cancelButton.click();
      
      // Dialog should close
      await page.waitForTimeout(500);
      await expect(page.locator('[role="alertdialog"]')).not.toBeVisible();
      
      // Should still be on profile page
      await expect(page).toHaveURL(/.*\/en\/profile/);
    });

    test.skip('should redirect to home after successful deletion', async ({ page }) => {
      await page.goto('/en/profile');
      await page.waitForLoadState('networkidle');
      
      // Open delete dialog
      const deleteButton = page.getByRole('button', { name: /delete.*account|Delete Account/i });
      await deleteButton.click();
      await page.waitForTimeout(500);
      
      // Fill confirmation with correct text
      const confirmInput = page.locator('input[id="confirm-delete"]').first();
      await confirmInput.fill('DELETE'); // Use actual confirmation text from translations
      
      // Click confirm delete
      const confirmDeleteButton = page.locator('[role="alertdialog"]')
        .getByRole('button', { name: /delete/i })
        .last();
      await confirmDeleteButton.click();
      
      // Wait for deletion to complete and redirect
      await page.waitForURL(/.*\/en(\/)?$/, { timeout: 10000 });
      
      // Should be redirected to home page
      await expect(page).toHaveURL(/.*\/en(\/)?$/);
      
      // Should no longer be authenticated
      // Try accessing profile again
      await page.goto('/en/profile');
      await page.waitForURL(/.*\/en\/signin/);
      await expect(page).toHaveURL(/.*\/en\/signin/);
    });

    test.skip('should show success message after deletion', async ({ page }) => {
      await page.goto('/en/profile');
      await page.waitForLoadState('networkidle');
      
      // Open delete dialog
      const deleteButton = page.getByRole('button', { name: /delete.*account|Delete Account/i });
      await deleteButton.click();
      await page.waitForTimeout(500);
      
      // Fill and confirm deletion
      const confirmInput = page.locator('input[id="confirm-delete"]').first();
      await confirmInput.fill('DELETE');
      
      const confirmDeleteButton = page.locator('[role="alertdialog"]')
        .getByRole('button', { name: /delete/i })
        .last();
      await confirmDeleteButton.click();
      
      // Look for success toast/message
      await expect(page.locator('text=/success|deleted|removed/i')).toBeVisible({ timeout: 5000 });
    });

    test.skip('should close dialog when clicking outside', async ({ page }) => {
      await page.goto('/en/profile');
      await page.waitForLoadState('networkidle');
      
      // Open delete dialog
      const deleteButton = page.getByRole('button', { name: /delete.*account|Delete Account/i });
      await deleteButton.click();
      await page.waitForTimeout(500);
      
      // Click outside the dialog (on overlay)
      const overlay = page.locator('[data-radix-dialog-overlay]').first();
      if (await overlay.count() > 0) {
        await overlay.click({ position: { x: 10, y: 10 } });
        
        // Dialog should close
        await page.waitForTimeout(500);
        await expect(page.locator('[role="alertdialog"]')).not.toBeVisible();
      }
    });
  });

  test.describe('Delete Account Button Accessibility', () => {
    test.skip('should have proper ARIA labels', async ({ page }) => {
      await page.goto('/en/profile');
      await page.waitForLoadState('networkidle');
      
      const deleteButton = page.getByRole('button', { name: /delete.*account/i });
      
      // Check button is accessible
      await expect(deleteButton).toBeVisible();
      await expect(deleteButton).toBeEnabled();
      
      // Check it has proper role
      expect(await deleteButton.getAttribute('type')).toBe('button');
    });

    test.skip('should be keyboard accessible', async ({ page }) => {
      await page.goto('/en/profile');
      await page.waitForLoadState('networkidle');
      
      // Tab to delete button
      await page.keyboard.press('Tab');
      
      // Keep tabbing until we find the delete button
      let attempts = 0;
      while (attempts < 50) {
        const focused = await page.evaluate(() => document.activeElement?.textContent);
        if (focused?.toLowerCase().includes('delete')) {
          break;
        }
        await page.keyboard.press('Tab');
        attempts++;
      }
      
      // Press Enter to open dialog
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);
      
      // Dialog should open
      await expect(page.locator('[role="alertdialog"]')).toBeVisible();
    });
  });
});

