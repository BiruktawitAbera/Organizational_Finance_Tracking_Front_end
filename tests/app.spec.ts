import { test, expect } from '@playwright/test';

test.describe('App Routing and Role-Based Access Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page before each test
    await page.goto('http://localhost:5173/login'); // Update URL to your login page URL
  });

  test('should navigate to login page', async ({ page }) => {
    await expect(page).toHaveURL('http://localhost:5173/login');
  });

  test('should login successfully and redirect to dashboard', async ({ page }) => {
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

    // Check if redirected to the dashboard
    await expect(page).toHaveURL('http://localhost:5173/'); // Update URL for home page
  });

  test('should show error message for invalid credentials', async ({ page }) => {
    // Mock invalid login response
    await page.route('POST', '/api/token/', (route) => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          detail: 'Invalid credentials',
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

  test('should navigate to admin page if user is admin', async ({ page }) => {
    // Mock successful login response for admin
    await page.route('POST', '/api/token/', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access: 'mockAccessToken',
          refresh: 'mockRefreshToken',
          role: 'admin',
          user_id: 1,
          department: 'Sales',
          force_password_change: false,
        }),
      });
    });

    // Fill in the login form
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'adminpassword');
    await page.click('button[type="submit"]');

    // Navigate to the users page
    await page.goto('http://localhost:5173/users'); // Update URL for users page
    await expect(page).toHaveURL('http://localhost:5173/users');
  });

  test('should not allow non-admin users to access admin page', async ({ page }) => {
    // Mock successful login response for manager
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
    await page.fill('input[type="email"]', 'manager@example.com');
    await page.fill('input[type="password"]', 'managerpassword');
    await page.click('button[type="submit"]');

    // Attempt to navigate to the users page
    await page.goto('http://localhost:5173/users'); // Update URL for users page
    await expect(page).toHaveURL('http://localhost:5173/'); // Should redirect to dashboard
  });
  test('should show loading state while fetching user role', async ({ page }) => {
    // Mock the role fetching to simulate loading
    await page.route('GET', 'http://127.0.0.1:8000/api/accounts/user-role/', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ role: 'manager' }),
      });
    });

    // Fill in the login form
    await page.fill('input[type="email"]', 'user@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Check for loading state
    await expect(page.locator('text=Loading...')).toBeVisible();
  });
});
