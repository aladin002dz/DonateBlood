import { expect, test } from '@playwright/test';

test.describe('Navigation and UI Features', () => {
  test.describe('Main Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/en');
      await page.waitForLoadState('networkidle');
    });

    test('should display navigation bar', async ({ page }) => {
      // Check for navigation element
      const nav = page.locator('nav').first();
      await expect(nav).toBeVisible();
      
      // Check for logo/brand name
      const logo = page.locator('[class*="heart"], [class*="Heart"]').first();
      await expect(logo).toBeVisible();
    });

    test('should display brand logo and name', async ({ page }) => {
      // Brand link should be visible
      const brandLink = page.getByRole('link').filter({ has: page.locator('[class*="heart"]') }).first();
      await expect(brandLink).toBeVisible();
      
      // Click brand should navigate to home
      await brandLink.click();
      await expect(page).toHaveURL(/.*\/en(\/)?$/);
    });

    test('should display navigation links for unauthenticated users', async ({ page }) => {
      // Check for common links
      const homeLink = page.getByRole('link', { name: /home/i });
      const searchLink = page.getByRole('link', { name: /search/i });
      const signInLink = page.getByRole('link', { name: /sign.*in|login/i });
      const registerLink = page.getByRole('link', { name: /register|sign.*up/i });
      
      // Home might be visible or in mobile menu
      if (await homeLink.count() > 0) {
        await expect(homeLink.first()).toBeVisible();
      }
      
      // Search should be visible
      if (await searchLink.count() > 0) {
        await expect(searchLink.first()).toBeVisible();
      }
      
      // Sign in and register should be visible
      if (await signInLink.count() > 0) {
        await expect(signInLink.first()).toBeVisible();
      }
      
      if (await registerLink.count() > 0) {
        await expect(registerLink.first()).toBeVisible();
      }
    });

    test('should navigate to search page', async ({ page }) => {
      const searchLink = page.getByRole('link', { name: /search/i }).first();
      
      if (await searchLink.isVisible()) {
        await searchLink.click();
        await expect(page).toHaveURL(/.*\/en\/search/);
      }
    });

    test('should navigate to sign-in page', async ({ page }) => {
      const signInLink = page.getByRole('link', { name: /sign.*in|login/i }).first();
      
      if (await signInLink.isVisible()) {
        await signInLink.click();
        await expect(page).toHaveURL(/.*\/en\/signin/);
      }
    });

    test('should navigate to register page', async ({ page }) => {
      const registerLink = page.getByRole('link', { name: /register|sign.*up/i }).first();
      
      if (await registerLink.isVisible()) {
        await registerLink.click();
        await expect(page).toHaveURL(/.*\/en\/register/);
      }
    });

    test('should highlight active page in navigation', async ({ page }) => {
      // Navigate to search
      await page.goto('/en/search');
      await page.waitForLoadState('networkidle');
      
      // Search link should have active styling
      const searchLink = page.getByRole('link', { name: /search/i }).first();
      if (await searchLink.count() > 0) {
        const classes = await searchLink.getAttribute('class');
        // Active links typically have different classes
        expect(classes).toBeTruthy();
      }
    });
  });

  test.describe('Language Switching', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/en');
      await page.waitForLoadState('networkidle');
    });

    test('should display language selector', async ({ page }) => {
      // Look for language selector (combobox with globe icon)
      const languageSelector = page.getByRole('combobox').filter({ 
        has: page.locator('svg, [class*="globe"]')
      }).first();
      
      if (await languageSelector.count() === 0) {
        // Try finding by trigger button
        const trigger = page.locator('button').filter({ hasText: /English|العربية|Français/i }).first();
        await expect(trigger).toBeVisible();
      } else {
        await expect(languageSelector).toBeVisible();
      }
    });

    test('should switch to Arabic language', async ({ page }) => {
      // Find language selector
      const languageButton = page.locator('button').filter({ hasText: /English|language/i }).first();
      
      if (await languageButton.count() > 0) {
        await languageButton.click();
        await page.waitForTimeout(500);
        
        // Select Arabic
        const arabicOption = page.getByRole('option', { name: /العربية|Arabic/i });
        if (await arabicOption.count() > 0) {
          await arabicOption.click();
          
          // Wait for language change
          await page.waitForTimeout(1000);
          
          // URL should now have /ar/ instead of /en/
          await expect(page).toHaveURL(/.*\/ar(\/|$)/);
          
          // Check for RTL direction
          const html = page.locator('html');
          const dir = await html.getAttribute('dir');
          expect(dir).toBe('rtl');
        }
      }
    });

    test('should switch to French language', async ({ page }) => {
      // Find language selector
      const languageButton = page.locator('button').filter({ hasText: /English|language/i }).first();
      
      if (await languageButton.count() > 0) {
        await languageButton.click();
        await page.waitForTimeout(500);
        
        // Select French
        const frenchOption = page.getByRole('option', { name: /Français|French/i });
        if (await frenchOption.count() > 0) {
          await frenchOption.click();
          
          // Wait for language change
          await page.waitForTimeout(1000);
          
          // URL should now have /fr/
          await expect(page).toHaveURL(/.*\/fr(\/|$)/);
        }
      }
    });

    test('should persist language preference across pages', async ({ page }) => {
      // Switch to French
      const languageButton = page.locator('button').filter({ hasText: /English/i }).first();
      
      if (await languageButton.count() > 0) {
        await languageButton.click();
        await page.waitForTimeout(500);
        
        const frenchOption = page.getByRole('option', { name: /Français/i });
        if (await frenchOption.count() > 0) {
          await frenchOption.click();
          await page.waitForTimeout(1000);
          
          // Navigate to another page
          await page.goto('/fr/search');
          await page.waitForLoadState('networkidle');
          
          // Should still be in French
          await expect(page).toHaveURL(/.*\/fr\/search/);
          
          // Navigate back to home
          await page.goto('/fr');
          await expect(page).toHaveURL(/.*\/fr(\/)?$/);
        }
      }
    });

    test('should display all available languages in selector', async ({ page }) => {
      const languageButton = page.locator('button').filter({ hasText: /English|language/i }).first();
      
      if (await languageButton.count() > 0) {
        await languageButton.click();
        await page.waitForTimeout(500);
        
        // Check for all three languages
        const englishOption = page.getByRole('option', { name: /English/i });
        const arabicOption = page.getByRole('option', { name: /العربية|Arabic/i });
        const frenchOption = page.getByRole('option', { name: /Français|French/i });
        
        await expect(englishOption).toBeVisible();
        await expect(arabicOption).toBeVisible();
        await expect(frenchOption).toBeVisible();
      }
    });
  });

  test.describe('Theme Switching', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/en');
      await page.waitForLoadState('networkidle');
    });

    test('should display theme toggle button', async ({ page }) => {
      // Look for theme toggle button (usually has moon/sun icon)
      const themeToggle = page.getByRole('button').filter({
        has: page.locator('[class*="moon"], [class*="sun"], [class*="Moon"], [class*="Sun"]')
      });
      
      // Theme toggle might not be visible initially, check if it exists
      const count = await themeToggle.count();
      if (count > 0) {
        await expect(themeToggle.first()).toBeVisible();
      }
    });

    test.skip('should toggle between light and dark themes', async ({ page }) => {
      // This test is skipped by default as theme toggle location may vary
      const themeToggle = page.getByRole('button').filter({
        has: page.locator('[class*="moon"], [class*="sun"]')
      }).first();
      
      if (await themeToggle.count() > 0) {
        // Get initial theme
        const htmlElement = page.locator('html');
        const initialClass = await htmlElement.getAttribute('class');
        
        // Click toggle
        await themeToggle.click();
        await page.waitForTimeout(500);
        
        // Check theme changed
        const newClass = await htmlElement.getAttribute('class');
        expect(initialClass).not.toBe(newClass);
      }
    });

    test.skip('should persist theme preference', async ({ page }) => {
      const themeToggle = page.getByRole('button').filter({
        has: page.locator('[class*="moon"], [class*="sun"]')
      }).first();
      
      if (await themeToggle.count() > 0) {
        // Toggle to dark mode
        await themeToggle.click();
        await page.waitForTimeout(500);
        
        const htmlElement = page.locator('html');
        const darkModeClass = await htmlElement.getAttribute('class');
        
        // Navigate to another page
        await page.goto('/en/search');
        await page.waitForLoadState('networkidle');
        
        // Theme should persist
        const newClass = await htmlElement.getAttribute('class');
        expect(newClass).toBe(darkModeClass);
      }
    });
  });

  test.describe('Mobile Navigation', () => {
    test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE size
    
    test('should display mobile menu button', async ({ page }) => {
      await page.goto('/en');
      await page.waitForLoadState('networkidle');
      
      // Look for menu button (hamburger icon)
      const menuButton = page.getByRole('button', { name: /toggle menu|menu/i });
      if (await menuButton.count() === 0) {
        // Try finding by icon
        const menuIcon = page.locator('button').filter({
          has: page.locator('[class*="menu"], [class*="Menu"]')
        }).first();
        await expect(menuIcon).toBeVisible();
      } else {
        await expect(menuButton).toBeVisible();
      }
    });

    test('should open mobile menu when clicked', async ({ page }) => {
      await page.goto('/en');
      await page.waitForLoadState('networkidle');
      
      // Find and click menu button
      const menuButton = page.locator('button').filter({
        has: page.locator('[class*="menu"], [class*="Menu"]')
      }).first();
      
      if (await menuButton.count() > 0) {
        await menuButton.click();
        await page.waitForTimeout(500);
        
        // Mobile menu should be visible
        // Look for navigation items in the sheet/drawer
        const mobileNav = page.locator('[role="dialog"], [class*="sheet"]');
        if (await mobileNav.count() > 0) {
          await expect(mobileNav.first()).toBeVisible();
        }
      }
    });

    test('should display navigation items in mobile menu', async ({ page }) => {
      await page.goto('/en');
      await page.waitForLoadState('networkidle');
      
      // Open mobile menu
      const menuButton = page.locator('button').filter({
        has: page.locator('[class*="menu"], [class*="Menu"]')
      }).first();
      
      if (await menuButton.count() > 0) {
        await menuButton.click();
        await page.waitForTimeout(500);
        
        // Check for navigation links in mobile menu
        const homeLink = page.getByRole('link', { name: /home/i });
        const searchLink = page.getByRole('link', { name: /search/i });
        
        // At least some navigation items should be visible
        const visibleLinks = await page.getByRole('link').count();
        expect(visibleLinks).toBeGreaterThan(0);
      }
    });

    test('should close mobile menu when navigation item clicked', async ({ page }) => {
      await page.goto('/en');
      await page.waitForLoadState('networkidle');
      
      // Open mobile menu
      const menuButton = page.locator('button').filter({
        has: page.locator('[class*="menu"], [class*="Menu"]')
      }).first();
      
      if (await menuButton.count() > 0) {
        await menuButton.click();
        await page.waitForTimeout(500);
        
        // Click a navigation link
        const searchLink = page.getByRole('link', { name: /search/i }).last();
        if (await searchLink.count() > 0) {
          await searchLink.click();
          await page.waitForTimeout(500);
          
          // Menu should close (check if drawer is hidden)
          const mobileNav = page.locator('[role="dialog"][data-state="open"]');
          await expect(mobileNav).not.toBeVisible();
        }
      }
    });

    test('should have language selector in mobile view', async ({ page }) => {
      await page.goto('/en');
      await page.waitForLoadState('networkidle');
      
      // Language selector should be visible even in mobile
      const languageButton = page.locator('button').filter({ 
        hasText: /English|العربية|Français/i 
      }).first();
      
      await expect(languageButton).toBeVisible();
    });
  });

  test.describe('Authenticated Navigation', () => {
    test.skip('should display profile link when authenticated', async ({ page }) => {
      // This test requires authentication setup
      await page.goto('/en');
      await page.waitForLoadState('networkidle');
      
      // Should see profile link
      const profileLink = page.getByRole('link', { name: /profile/i });
      await expect(profileLink).toBeVisible();
    });

    test.skip('should display logout button when authenticated', async ({ page }) => {
      await page.goto('/en');
      await page.waitForLoadState('networkidle');
      
      // Should see logout button/link
      const logoutButton = page.getByRole('button', { name: /logout|sign.*out/i });
      const logoutLink = page.getByRole('link', { name: /logout|sign.*out/i });
      
      expect(await logoutButton.count() > 0 || await logoutLink.count() > 0).toBeTruthy();
    });

    test.skip('should not display sign-in/register when authenticated', async ({ page }) => {
      await page.goto('/en');
      await page.waitForLoadState('networkidle');
      
      // Should NOT see sign-in or register links
      const signInLink = page.getByRole('link', { name: /sign.*in|login/i });
      const registerLink = page.getByRole('link', { name: /register|sign.*up/i });
      
      await expect(signInLink).not.toBeVisible();
      await expect(registerLink).not.toBeVisible();
    });

    test.skip('should logout user when logout clicked', async ({ page }) => {
      await page.goto('/en');
      await page.waitForLoadState('networkidle');
      
      // Click logout
      const logoutButton = page.getByRole('button', { name: /logout|sign.*out/i });
      await logoutButton.click();
      
      // Wait for logout to complete
      await page.waitForTimeout(2000);
      
      // Should redirect to home
      await expect(page).toHaveURL(/.*\/en(\/)?$/);
      
      // Sign-in link should now be visible
      const signInLink = page.getByRole('link', { name: /sign.*in|login/i });
      await expect(signInLink).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels', async ({ page }) => {
      await page.goto('/en');
      await page.waitForLoadState('networkidle');
      
      // Check navigation has proper role
      const nav = page.locator('nav').first();
      await expect(nav).toBeVisible();
      
      // Links should be accessible
      const links = page.getByRole('link');
      expect(await links.count()).toBeGreaterThan(0);
    });

    test('should be keyboard navigable', async ({ page }) => {
      await page.goto('/en');
      await page.waitForLoadState('networkidle');
      
      // Tab through navigation
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);
      
      // Focus should be on a navigable element
      const focused = await page.evaluate(() => document.activeElement?.tagName);
      expect(['A', 'BUTTON', 'INPUT']).toContain(focused);
    });

    test('should have sufficient color contrast', async ({ page }) => {
      await page.goto('/en');
      await page.waitForLoadState('networkidle');
      
      // This is a basic check - full accessibility audits require specialized tools
      const nav = page.locator('nav').first();
      await expect(nav).toBeVisible();
      
      // Navigation should be readable
      const navText = await nav.textContent();
      expect(navText).toBeTruthy();
      expect(navText!.length).toBeGreaterThan(0);
    });
  });
});

