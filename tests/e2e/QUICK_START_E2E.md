# Quick Start Guide - E2E Tests

## 🚀 Get Started in 3 Steps

### Step 1: Run Tests Now (No Setup Required)

```bash
# Run all tests
npm run test:e2e

# Or use the interactive UI
npm run test:e2e:ui
```

### Step 2: Use the Helper Scripts

**Windows (PowerShell):**
```powershell
.\run-tests.ps1
```

**Linux/Mac:**
```bash
chmod +x run-tests.sh
./run-tests.sh
```

This interactive menu lets you:
- Run all tests
- Run specific test files
- Debug tests
- View reports
- And more!

### Step 3: View Results

After tests run, open the HTML report:
```bash
npx playwright show-report
```

## 📊 What You'll See

Currently, these tests will run successfully **without any setup**:
- ✅ Authentication form validation
- ✅ Search page display
- ✅ Navigation elements
- ✅ Language switching
- ✅ Password reset forms
- ✅ Redirect behaviors

Tests marked with `test.skip()` require authentication setup (see below).

## 🔐 Enable All Tests (Optional)

To run the full 297-test suite:

1. Create `tests/auth.setup.ts`:

```typescript
import { test as setup } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  await page.goto('/en/signin');
  await page.fill('input[id="identifier"]', 'test@example.com');
  await page.fill('input[id="password"]', 'testpassword');
  await page.getByRole('button', { name: /sign.*in/i }).click();
  await page.waitForURL(/.*\/dashboard/);
  await page.context().storageState({ path: 'tests/.auth/user.json' });
});
```

2. Update `playwright.config.ts`:

```typescript
export default defineConfig({
  // ... existing config
  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: 'tests/.auth/user.json'
      },
      dependencies: ['setup'],
    },
    // ... repeat for firefox and webkit
  ],
});
```

3. Remove `test.skip()` from authenticated tests

4. Run tests again!

## 📚 Documentation

- **Full Documentation**: `tests/e2e/README.md`
- **Summary**: `E2E_TESTS_SUMMARY.md`
- **Playwright Docs**: https://playwright.dev

## 🎯 Common Commands

```bash
# Run specific file
npx playwright test tests/e2e/navigation.spec.ts

# Run in headed mode (see browser)
npx playwright test --headed

# Run specific browser
npx playwright test --project=chromium

# Debug a test
npx playwright test --debug tests/e2e/auth.spec.ts

# List all tests
npx playwright test --list

# Run tests matching pattern
npx playwright test -g "should navigate"
```

## 🐛 Troubleshooting

### Tests are slow
- Run with fewer browsers: `npx playwright test --project=chromium`
- Use UI mode for development: `npm run test:e2e:ui`

### Tests are failing
- Check if dev server is running (Playwright starts it automatically)
- Verify baseURL in `playwright.config.ts` matches your dev server
- Check `test-results/` folder for screenshots and videos

### Need to update Playwright
```bash
npm install -D @playwright/test@latest
npx playwright install
```

## ✨ Tips

1. **Use UI Mode for Development**: It's much easier to develop and debug tests
   ```bash
   npm run test:e2e:ui
   ```

2. **Watch Mode**: The UI mode has built-in watch mode

3. **Test One File**: Focus on one file at a time during development
   ```bash
   npx playwright test tests/e2e/navigation.spec.ts --headed
   ```

4. **Debug Failing Tests**: Use the `--debug` flag
   ```bash
   npx playwright test --debug
   ```

5. **Screenshots**: Already configured to capture on failure

## 🎉 You're Ready!

That's it! You now have 297 comprehensive e2e tests ready to use.

**Next Steps:**
1. Run the tests: `npm run test:e2e`
2. Check the report: `npx playwright show-report`
3. Set up authentication to enable all tests
4. Integrate with your CI/CD pipeline

Happy Testing! 🚀

