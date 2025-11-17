# E2E Test Suite Documentation

This directory contains comprehensive end-to-end tests for the DonateBlood application using Playwright.

## 📋 Test Files Overview

### 1. **auth.spec.ts**
Tests authentication flows including:
- Sign-in page navigation and validation
- Registration form validation
- Password validation
- Navigation to forgot password page
- Form field validation errors

### 2. **search.spec.ts**
Tests blood donor search functionality:
- Search page navigation
- Blood group filter display
- Filtering by blood group
- Search results display

### 3. **profile.spec.ts** (Enhanced)
Tests user profile management:
- Profile page access control
- Availability status toggle
- Personal information editing
- Blood group selection
- Location selectors (Wilaya → Daira → Commune)
- Donation history tracking
- Profile update functionality
- Form validation

### 4. **dashboard.spec.ts** (New)
Tests authenticated user dashboard:
- Dashboard access control
- User profile information display
- Account statistics
- Quick actions (Edit Profile, Security Settings, etc.)
- Sign-out functionality
- Email verification banner
- Navigation between pages

### 5. **password-reset.spec.ts** (New)
Tests password reset flow:
- Forgot password page
- Email validation
- Reset password with token
- Password confirmation matching
- Complete password reset workflow
- Loading states

### 6. **email-verification.spec.ts** (New)
Tests email verification system:
- Email verification page access
- Token validation
- Resend verification email
- Rate limiting
- Verification status display
- Verified badge for authenticated users

### 7. **account-deletion.spec.ts** (New)
Tests account deletion functionality:
- Delete account dialog
- Confirmation text requirement
- Warning information display
- Cancel deletion
- Successful deletion workflow
- Redirect after deletion
- Accessibility features

### 8. **navigation.spec.ts** (New)
Tests navigation and UI features:
- Main navigation bar
- Brand logo and links
- Authenticated vs unauthenticated navigation
- Language switching (English, Arabic, French)
- Theme toggle (light/dark mode)
- Mobile responsive navigation
- Keyboard accessibility
- ARIA labels and roles

## 🚀 Running the Tests

### Run all e2e tests
```bash
npm run test:e2e
```

### Run tests in UI mode (interactive)
```bash
npm run test:e2e:ui
```

### Run specific test file
```bash
npx playwright test tests/e2e/auth.spec.ts
```

### Run tests in a specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run tests in headed mode (see the browser)
```bash
npx playwright test --headed
```

### Run only tests with a specific tag
```bash
npx playwright test -g "should navigate"
```

### Debug a specific test
```bash
npx playwright test --debug tests/e2e/auth.spec.ts
```

## 🔐 Authentication Setup

Many tests are marked with `test.skip()` because they require authentication. To enable these tests:

### Option 1: Setup Authentication State (Recommended)

1. Create an authentication setup file:

```typescript
// tests/auth.setup.ts
import { test as setup } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  await page.goto('/en/signin');
  await page.fill('input[id="identifier"]', process.env.TEST_USER_EMAIL!);
  await page.fill('input[id="password"]', process.env.TEST_USER_PASSWORD!);
  await page.getByRole('button', { name: /sign.*in/i }).click();
  
  await page.waitForURL(/.*\/dashboard/);
  await page.context().storageState({ path: 'tests/.auth/user.json' });
});
```

2. Update `playwright.config.ts`:

```typescript
export default defineConfig({
  // ... other config
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
    // ... other projects
  ],
});
```

3. Remove `test.skip()` from authenticated tests

### Option 2: Use Test User Creation

Create test users in your database before running tests and use those credentials.

## 📊 Test Coverage

Current test coverage includes:

- ✅ Authentication flows (sign-in, register, forgot password)
- ✅ Search functionality
- ✅ Profile management
- ✅ Dashboard access and features
- ✅ Password reset workflow
- ✅ Email verification
- ✅ Account deletion
- ✅ Navigation and UI features
- ✅ Language switching
- ✅ Mobile responsiveness
- ⚠️ Theme switching (partially covered)
- ⚠️ Authenticated user flows (requires auth setup)

## 🎯 Best Practices

### 1. Use Semantic Locators
```typescript
// Good
page.getByRole('button', { name: /sign.*in/i })
page.getByLabel('Email')

// Avoid
page.locator('.btn-primary')
```

### 2. Wait for States
```typescript
await page.waitForLoadState('networkidle');
await page.waitForURL(/\/dashboard/);
```

### 3. Handle Dynamic Content
```typescript
const element = page.locator('text=/loading/i');
if (await element.count() > 0) {
  await element.waitFor({ state: 'hidden' });
}
```

### 4. Use Data Attributes
Consider adding `data-testid` attributes to critical elements for more stable selectors.

## 🐛 Debugging Tips

### 1. Use Playwright Inspector
```bash
npx playwright test --debug
```

### 2. Take Screenshots on Failure
Already configured in `playwright.config.ts`:
```typescript
screenshot: 'only-on-failure',
video: 'retain-on-failure',
```

### 3. View Test Report
```bash
npx playwright show-report
```

### 4. Slow Down Tests
```typescript
test.use({ slowMo: 1000 }); // Slow down by 1 second
```

## 📝 Adding New Tests

When adding new tests:

1. Create a new `.spec.ts` file in `tests/e2e/`
2. Use descriptive test names
3. Group related tests with `test.describe()`
4. Add `beforeEach` hooks for common setup
5. Use `test.skip()` for tests requiring authentication
6. Add appropriate wait conditions
7. Test both success and error paths

Example structure:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/feature');
    await page.waitForLoadState('networkidle');
  });

  test('should do something', async ({ page }) => {
    // Test implementation
  });

  test.describe('Authenticated Feature', () => {
    test.skip('should do something when authenticated', async ({ page }) => {
      // Test implementation requiring auth
    });
  });
});
```

## 🔄 Continuous Integration

Tests are configured to run in CI with:
- Retry on failure (2 retries)
- Single worker for consistency
- HTML report generation
- Video recording on failure

See `playwright.config.ts` for CI-specific settings.

## 📞 Support

For issues or questions about the test suite:
1. Check the Playwright documentation: https://playwright.dev
2. Review test reports in `playwright-report/`
3. Check test artifacts in `test-results/`

## 🎨 Future Improvements

- [ ] Add visual regression testing
- [ ] Implement parallel test execution optimizations
- [ ] Add performance testing
- [ ] Create custom Playwright fixtures
- [ ] Add API mocking for isolated testing
- [ ] Implement test data factories
- [ ] Add accessibility testing (axe-core integration)

