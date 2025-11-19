#!/bin/bash

# E2E Test Runner Helper Script
# This script provides easy commands to run your Playwright e2e tests

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  DonateBlood E2E Test Runner                      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to display menu
show_menu() {
    echo -e "${GREEN}Available Options:${NC}"
    echo "1. Run all e2e tests"
    echo "2. Run tests in UI mode (interactive)"
    echo "3. Run specific test file"
    echo "4. Run tests in headed mode (see browser)"
    echo "5. Run tests on specific browser"
    echo "6. Debug mode"
    echo "7. View last test report"
    echo "8. Run only authentication tests"
    echo "9. Run only navigation tests"
    echo "10. List all available tests"
    echo "11. Run tests that don't require authentication"
    echo "0. Exit"
    echo ""
}

# Function to run all tests
run_all_tests() {
    echo -e "${YELLOW}Running all e2e tests...${NC}"
    npm run test:e2e
}

# Function to run UI mode
run_ui_mode() {
    echo -e "${YELLOW}Starting Playwright UI mode...${NC}"
    npm run test:e2e:ui
}

# Function to run specific file
run_specific_file() {
    echo -e "${GREEN}Available test files:${NC}"
    echo "1. auth.spec.ts"
    echo "2. search.spec.ts"
    echo "3. profile.spec.ts"
    echo "4. dashboard.spec.ts"
    echo "5. password-reset.spec.ts"
    echo "6. email-verification.spec.ts"
    echo "7. account-deletion.spec.ts"
    echo "8. navigation.spec.ts"
    echo ""
    echo -n "Enter file number: "
    read file_choice
    
    case $file_choice in
        1) file="auth.spec.ts" ;;
        2) file="search.spec.ts" ;;
        3) file="profile.spec.ts" ;;
        4) file="dashboard.spec.ts" ;;
        5) file="password-reset.spec.ts" ;;
        6) file="email-verification.spec.ts" ;;
        7) file="account-deletion.spec.ts" ;;
        8) file="navigation.spec.ts" ;;
        *) echo -e "${RED}Invalid choice${NC}"; return ;;
    esac
    
    echo -e "${YELLOW}Running tests/e2e/${file}...${NC}"
    npx playwright test "tests/e2e/${file}"
}

# Function to run in headed mode
run_headed_mode() {
    echo -e "${YELLOW}Running tests in headed mode...${NC}"
    npx playwright test --headed
}

# Function to run on specific browser
run_specific_browser() {
    echo -e "${GREEN}Select browser:${NC}"
    echo "1. Chromium"
    echo "2. Firefox"
    echo "3. WebKit (Safari)"
    echo ""
    echo -n "Enter browser number: "
    read browser_choice
    
    case $browser_choice in
        1) browser="chromium" ;;
        2) browser="firefox" ;;
        3) browser="webkit" ;;
        *) echo -e "${RED}Invalid choice${NC}"; return ;;
    esac
    
    echo -e "${YELLOW}Running tests on ${browser}...${NC}"
    npx playwright test --project="${browser}"
}

# Function to run debug mode
run_debug_mode() {
    echo -e "${GREEN}Select test file to debug:${NC}"
    echo "1. auth.spec.ts"
    echo "2. search.spec.ts"
    echo "3. profile.spec.ts"
    echo "4. navigation.spec.ts"
    echo "5. Other (enter filename)"
    echo ""
    echo -n "Enter choice: "
    read debug_choice
    
    case $debug_choice in
        1) file="auth.spec.ts" ;;
        2) file="search.spec.ts" ;;
        3) file="profile.spec.ts" ;;
        4) file="navigation.spec.ts" ;;
        5) 
            echo -n "Enter filename: "
            read file
            ;;
        *) echo -e "${RED}Invalid choice${NC}"; return ;;
    esac
    
    echo -e "${YELLOW}Starting debug mode for tests/e2e/${file}...${NC}"
    npx playwright test --debug "tests/e2e/${file}"
}

# Function to view report
view_report() {
    echo -e "${YELLOW}Opening test report...${NC}"
    npx playwright show-report
}

# Function to run authentication tests
run_auth_tests() {
    echo -e "${YELLOW}Running authentication tests...${NC}"
    npx playwright test tests/e2e/auth.spec.ts tests/e2e/password-reset.spec.ts
}

# Function to run navigation tests
run_navigation_tests() {
    echo -e "${YELLOW}Running navigation tests...${NC}"
    npx playwright test tests/e2e/navigation.spec.ts
}

# Function to list tests
list_tests() {
    echo -e "${YELLOW}Listing all available tests...${NC}"
    npx playwright test --list
}

# Function to run tests without auth
run_no_auth_tests() {
    echo -e "${YELLOW}Running tests that don't require authentication...${NC}"
    echo -e "${BLUE}This includes:${NC}"
    echo "  - Auth form validation"
    echo "  - Search page display"
    echo "  - Navigation elements"
    echo "  - Language switching"
    echo "  - Password reset page"
    echo ""
    npx playwright test -g "should navigate|should display|should show|should redirect" \
        --grep-invert "Authenticated|when authenticated|authenticated"
}

# Main loop
while true; do
    show_menu
    echo -n "Enter your choice: "
    read choice
    echo ""
    
    case $choice in
        1) run_all_tests ;;
        2) run_ui_mode ;;
        3) run_specific_file ;;
        4) run_headed_mode ;;
        5) run_specific_browser ;;
        6) run_debug_mode ;;
        7) view_report ;;
        8) run_auth_tests ;;
        9) run_navigation_tests ;;
        10) list_tests ;;
        11) run_no_auth_tests ;;
        0) 
            echo -e "${GREEN}Goodbye!${NC}"
            exit 0
            ;;
        *) 
            echo -e "${RED}Invalid option. Please try again.${NC}"
            ;;
    esac
    
    echo ""
    echo -e "${BLUE}Press Enter to continue...${NC}"
    read
    clear
done

