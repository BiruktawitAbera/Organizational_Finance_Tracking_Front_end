import { test, expect } from '@playwright/test';

test.describe('SignInPage Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page before each test
    await page.goto('http://localhost:5173/login'); // Adjust the URL as needed
  });

  test('should display login form elements', async ({ page }) => {
    // Check if the login form elements are visible
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toHaveText('Login→');
    await expect(page.locator('a[href="ForgotPassword"]')).toBeVisible();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Mock successful login response
    await page.route('POST', '/api/token/', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access: 'mockAccessToken',
          refresh: 'mockRefreshToken',
          role: 'manager',
          user_id: 1,
          department: 'Sales',
          force_password_change: false,
        }),
      });
    });

    // Fill in the login form
    await page.fill('input[type="email"]', 'user@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Check if redirected to the home page
    await expect(page).toHaveURL('http://localhost:5173/'); // Adjust the URL as needed
  });

  test('should show error message for invalid credentials', async ({ page }) => {
    // Mock invalid login response
    await page.route('POST', '/api/token/', (route) => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          detail: 'Invalid email or password',
        }),
      });
    });

    // Fill in the login form with invalid credentials
    await page.fill('input[type="email"]', 'user@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Check for error message
    await expect(page.locator('.text-red-500')).toHaveText('Invalid credentials');
  });

  test('should navigate to enforce password change if required', async ({ page }) => {
    // Mock response indicating a password change is required
    await page.route('POST', '/api/token/', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access: 'mockAccessToken',
          refresh: 'mockRefreshToken',
          role: 'manager',
          user_id: 1,
          department: 'Sales',
          force_password_change: true,
        }),
      });
    });

    // Fill in the login form
    await page.fill('input[type="email"]', 'user@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Check if redirected to the enforce password change page
    await expect(page).toHaveURL('http://localhost:5173/enforce'); // Adjust the URL as needed
  });

  test('should validate email input', async ({ page }) => {
    // Fill in the login form with invalid email
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Check for error message (if any validation is implemented)
    // This assumes you have some client-side validation
    await expect(page.locator('.text-red-500')).toBeVisible();
  });

  test('should validate password input', async ({ page }) => {
    // Fill in the login form with a short password
    await page.fill('input[type="email"]', 'user@example.com');
    await page.fill('input[type="password"]', 'short');
    await page.click('button[type="submit"]');


    // Check for error message (if any validation is implemented)
    // This assumes you have some client-side validation
    await expect(page.locator('.text-red-500')).toBeVisible();
  });
});
