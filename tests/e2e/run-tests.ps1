# E2E Test Runner Helper Script (PowerShell)
# This script provides easy commands to run your Playwright e2e tests

Write-Host "╔════════════════════════════════════════════════════╗" -ForegroundColor Blue
Write-Host "║  DonateBlood E2E Test Runner                      ║" -ForegroundColor Blue
Write-Host "╚════════════════════════════════════════════════════╝" -ForegroundColor Blue
Write-Host ""

function Show-Menu {
    Write-Host "Available Options:" -ForegroundColor Green
    Write-Host "1. Run all e2e tests"
    Write-Host "2. Run tests in UI mode (interactive)"
    Write-Host "3. Run specific test file"
    Write-Host "4. Run tests in headed mode (see browser)"
    Write-Host "5. Run tests on specific browser"
    Write-Host "6. Debug mode"
    Write-Host "7. View last test report"
    Write-Host "8. Run only authentication tests"
    Write-Host "9. Run only navigation tests"
    Write-Host "10. List all available tests"
    Write-Host "11. Run tests that don't require authentication"
    Write-Host "0. Exit"
    Write-Host ""
}

function Run-AllTests {
    Write-Host "Running all e2e tests..." -ForegroundColor Yellow
    npm run test:e2e
}

function Run-UIMode {
    Write-Host "Starting Playwright UI mode..." -ForegroundColor Yellow
    npm run test:e2e:ui
}

function Run-SpecificFile {
    Write-Host "Available test files:" -ForegroundColor Green
    Write-Host "1. auth.spec.ts"
    Write-Host "2. search.spec.ts"
    Write-Host "3. profile.spec.ts"
    Write-Host "4. dashboard.spec.ts"
    Write-Host "5. password-reset.spec.ts"
    Write-Host "6. email-verification.spec.ts"
    Write-Host "7. account-deletion.spec.ts"
    Write-Host "8. navigation.spec.ts"
    Write-Host ""
    $fileChoice = Read-Host "Enter file number"
    
    $file = switch ($fileChoice) {
        "1" { "auth.spec.ts" }
        "2" { "search.spec.ts" }
        "3" { "profile.spec.ts" }
        "4" { "dashboard.spec.ts" }
        "5" { "password-reset.spec.ts" }
        "6" { "email-verification.spec.ts" }
        "7" { "account-deletion.spec.ts" }
        "8" { "navigation.spec.ts" }
        default { 
            Write-Host "Invalid choice" -ForegroundColor Red
            return
        }
    }
    
    Write-Host "Running tests/e2e/$file..." -ForegroundColor Yellow
    npx playwright test "tests/e2e/$file"
}

function Run-HeadedMode {
    Write-Host "Running tests in headed mode..." -ForegroundColor Yellow
    npx playwright test --headed
}

function Run-SpecificBrowser {
    Write-Host "Select browser:" -ForegroundColor Green
    Write-Host "1. Chromium"
    Write-Host "2. Firefox"
    Write-Host "3. WebKit (Safari)"
    Write-Host ""
    $browserChoice = Read-Host "Enter browser number"
    
    $browser = switch ($browserChoice) {
        "1" { "chromium" }
        "2" { "firefox" }
        "3" { "webkit" }
        default {
            Write-Host "Invalid choice" -ForegroundColor Red
            return
        }
    }
    
    Write-Host "Running tests on $browser..." -ForegroundColor Yellow
    npx playwright test --project="$browser"
}

function Run-DebugMode {
    Write-Host "Select test file to debug:" -ForegroundColor Green
    Write-Host "1. auth.spec.ts"
    Write-Host "2. search.spec.ts"
    Write-Host "3. profile.spec.ts"
    Write-Host "4. navigation.spec.ts"
    Write-Host "5. Other (enter filename)"
    Write-Host ""
    $debugChoice = Read-Host "Enter choice"
    
    $file = switch ($debugChoice) {
        "1" { "auth.spec.ts" }
        "2" { "search.spec.ts" }
        "3" { "profile.spec.ts" }
        "4" { "navigation.spec.ts" }
        "5" { Read-Host "Enter filename" }
        default {
            Write-Host "Invalid choice" -ForegroundColor Red
            return
        }
    }
    
    Write-Host "Starting debug mode for tests/e2e/$file..." -ForegroundColor Yellow
    npx playwright test --debug "tests/e2e/$file"
}

function View-Report {
    Write-Host "Opening test report..." -ForegroundColor Yellow
    npx playwright show-report
}

function Run-AuthTests {
    Write-Host "Running authentication tests..." -ForegroundColor Yellow
    npx playwright test tests/e2e/auth.spec.ts tests/e2e/password-reset.spec.ts
}

function Run-NavigationTests {
    Write-Host "Running navigation tests..." -ForegroundColor Yellow
    npx playwright test tests/e2e/navigation.spec.ts
}

function List-Tests {
    Write-Host "Listing all available tests..." -ForegroundColor Yellow
    npx playwright test --list
}

function Run-NoAuthTests {
    Write-Host "Running tests that don't require authentication..." -ForegroundColor Yellow
    Write-Host "This includes:" -ForegroundColor Blue
    Write-Host "  - Auth form validation"
    Write-Host "  - Search page display"
    Write-Host "  - Navigation elements"
    Write-Host "  - Language switching"
    Write-Host "  - Password reset page"
    Write-Host ""
    npx playwright test -g "should navigate|should display|should show|should redirect" --grep-invert "Authenticated|when authenticated|authenticated"
}

# Main loop
while ($true) {
    Show-Menu
    $choice = Read-Host "Enter your choice"
    Write-Host ""
    
    switch ($choice) {
        "1" { Run-AllTests }
        "2" { Run-UIMode }
        "3" { Run-SpecificFile }
        "4" { Run-HeadedMode }
        "5" { Run-SpecificBrowser }
        "6" { Run-DebugMode }
        "7" { View-Report }
        "8" { Run-AuthTests }
        "9" { Run-NavigationTests }
        "10" { List-Tests }
        "11" { Run-NoAuthTests }
        "0" {
            Write-Host "Goodbye!" -ForegroundColor Green
            exit
        }
        default {
            Write-Host "Invalid option. Please try again." -ForegroundColor Red
        }
    }
    
    Write-Host ""
    Write-Host "Press Enter to continue..." -ForegroundColor Blue
    Read-Host
    Clear-Host
}

