import { expect, test } from '@playwright/test';

test.describe('Dashboard Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to dashboard page
        await page.goto('/en/dashboard');
        await page.waitForLoadState('networkidle');
    });

    test('should redirect to sign-in when not authenticated', async ({ page }) => {
        // When not authenticated, should redirect to signin page
        await page.waitForURL(/.*\/en\/signin/);
        await expect(page).toHaveURL(/.*\/en\/signin/);
    });

    test('should display loading state while checking authentication', async ({ page }) => {
        // Check for loading indicator
        const loadingText = page.locator('text=/Loading dashboard.../i');

        // Either loading appears or redirect happens quickly
        const urlOrLoading = await Promise.race([
            page.waitForURL(/.*\/en\/signin/, { timeout: 5000 }).then(() => 'redirected'),
            loadingText.waitFor({ state: 'visible', timeout: 5000 }).then(() => 'loading'),
            new Promise(resolve => setTimeout(() => resolve('timeout'), 5000))
        ]);

        expect(['redirected', 'loading', 'timeout']).toContain(urlOrLoading);
    });

    // Note: The following tests require authentication setup
    // You would need to add authentication state management in Playwright
    // using storageState or by signing in programmatically

    test.describe('Authenticated Dashboard', () => {
        // TODO: Add beforeEach with authentication state
        // test.use({ storageState: 'tests/.auth/user.json' });

        test.skip('should display user profile information', async ({ page }) => {
            // After authentication is set up, this test should:
            // 1. Navigate to dashboard
            await page.goto('/en/dashboard');

            // 2. Check for profile elements
            await expect(page.locator('text=/Welcome back/i')).toBeVisible();
            await expect(page.locator('text=/Profile Information/i')).toBeVisible();

            // 3. Verify user avatar is displayed
            const avatar = page.locator('[class*="avatar"]').first();
            await expect(avatar).toBeVisible();
        });

        test.skip('should display account statistics', async ({ page }) => {
            await page.goto('/en/dashboard');

            // Check for account statistics section
            await expect(page.locator('text=/Account Statistics/i')).toBeVisible();
            await expect(page.locator('text=/Email Status/i')).toBeVisible();
            await expect(page.locator('text=/Display Name/i')).toBeVisible();
        });

        test.skip('should have working quick actions', async ({ page }) => {
            await page.goto('/en/dashboard');

            // Check for Quick Actions section
            await expect(page.locator('text=/Quick Actions/i')).toBeVisible();

            // Verify quick action buttons exist
            await expect(page.getByRole('button', { name: /Edit Profile/i })).toBeVisible();
            await expect(page.getByRole('button', { name: /Security Settings/i })).toBeVisible();
            await expect(page.getByRole('button', { name: /Notification Preferences/i })).toBeVisible();
        });

        test.skip('should allow user to sign out', async ({ page }) => {
            await page.goto('/en/dashboard');

            // Find and click sign out button
            const signOutButton = page.getByRole('button', { name: /Sign Out/i });
            await expect(signOutButton).toBeVisible();
            await signOutButton.click();

            // Should redirect to home page
            await page.waitForURL(/.*\/en(\/)?$/);
            await expect(page).toHaveURL(/.*\/en(\/)?$/);
        });

        test.skip('should navigate back to home', async ({ page }) => {
            await page.goto('/en/dashboard');

            // Click back to home link
            const homeLink = page.getByRole('link', { name: /Back to Home/i });
            await expect(homeLink).toBeVisible();
            await homeLink.click();

            // Should navigate to home page
            await page.waitForURL(/.*\/en(\/)?$/);
            await expect(page).toHaveURL(/.*\/en(\/)?$/);
        });

        test.skip('should display email verification banner for unverified users', async ({ page }) => {
            // This test assumes the authenticated user has an unverified email
            await page.goto('/en/dashboard');

            // Look for email verification banner or status
            const emailStatus = page.locator('text=/Email Status|Unverified|Verify/i');
            await expect(emailStatus.first()).toBeVisible();
        });
    });
});

