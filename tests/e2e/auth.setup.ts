import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }, testInfo) => {
    // TODO: Update TEST_USER_EMAIL and TEST_USER_PASSWORD in .env
    const email = process.env.TEST_USER_EMAIL;
    const password = process.env.TEST_USER_PASSWORD;

    // Skip auth setup if credentials not available
    if (!email || !password || email === 'test@example.com') {
        testInfo.skip();
        return;
    }

    await page.goto('/en/signin');
    // Increased timeout to account for Next.js compilation time
    await page.waitForLoadState('networkidle', { timeout: 60000 });

    // Fill email/phone
    const emailInput = page.getByLabel(/email.*phone/i);
    await emailInput.fill(email);
    await emailInput.blur();

    await page.waitForTimeout(500);

    // Fill password
    const passwordInput = page.getByLabel(/^password$/i);
    await passwordInput.fill(password);
    await passwordInput.blur();

    await page.waitForTimeout(500);

    // Click sign in
    const signInButton = page.getByRole('button', { name: /sign.*in|login/i });
    await signInButton.click();

    // Wait for redirect (increased timeout for Next.js compilation)
    await page.waitForURL(/.*\/(profile|dashboard)/, { timeout: 30000 });

    // Save storage state
    await page.context().storageState({ path: authFile });
});
