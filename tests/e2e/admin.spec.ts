import { test, expect } from '@playwright/test';

/**
 * E2E tests for the admin panel flow.
 * Validates: Requirements 9.1, 9.2, 10.4
 *
 * Tests cover:
 * - Successful login flow
 * - Failed login with wrong credentials
 * - Unauthorized access redirect
 * - Rate limiting after multiple failed attempts
 * - Logout flow
 */

test.describe('Admin Panel', () => {
  test.describe('Login Flow', () => {
    test('should login successfully with correct credentials', async ({ page }) => {
      // Navigate to admin login page
      await page.goto('/admin');

      // Verify login page is displayed
      await expect(page.locator('h1')).toContainText('Admin Login');

      // Fill in correct credentials
      await page.fill('#username', 'admin');
      await page.fill('#password', 'admin123');

      // Click login button
      await page.click('button[type="submit"]');

      // Wait for redirect to dashboard
      await page.waitForURL('/admin/dashboard');

      // Verify dashboard content is visible
      await expect(page.locator('h1')).toContainText('Mahkota Drive Admin');
      await expect(page.locator('nav[aria-label="Tab navigasi admin"]')).toBeVisible();
    });

    test('should show error message with wrong credentials', async ({ page }) => {
      // Navigate to admin login page
      await page.goto('/admin');

      // Fill in wrong credentials
      await page.fill('#username', 'wronguser');
      await page.fill('#password', 'wrongpass');

      // Click login button
      await page.click('button[type="submit"]');

      // Verify error message is shown
      await expect(page.locator('[role="alert"]')).toBeVisible();
      await expect(page.locator('[role="alert"]')).toContainText(
        'Username atau password salah'
      );

      // Verify still on /admin page (not redirected)
      expect(page.url()).toContain('/admin');
      expect(page.url()).not.toContain('/admin/dashboard');
    });
  });

  test.describe('Unauthorized Access', () => {
    test('should redirect to login page when accessing dashboard without session', async ({
      page,
    }) => {
      // Navigate directly to dashboard without logging in
      await page.goto('/admin/dashboard');

      // Verify redirect to login page
      await page.waitForURL('/admin');
      await expect(page.locator('h1')).toContainText('Admin Login');
    });
  });

  test.describe('Rate Limiting', () => {
    test('should show rate limit error after 6 failed login attempts', async ({
      page,
    }) => {
      await page.goto('/admin');

      // Attempt 6 failed logins in sequence
      for (let i = 0; i < 6; i++) {
        await page.fill('#username', 'admin');
        await page.fill('#password', `wrongpass${i}`);
        await page.click('button[type="submit"]');

        // Wait for the response to complete before next attempt
        await page.waitForSelector('[role="alert"]', { timeout: 10000 });
      }

      // Verify the last attempt shows rate limit error message
      await expect(page.locator('[role="alert"]')).toContainText(
        'Terlalu banyak percobaan login'
      );
    });
  });

  test.describe('Logout', () => {
    test('should logout and redirect to login page', async ({ page }) => {
      // First, login successfully
      await page.goto('/admin');
      await page.fill('#username', 'admin');
      await page.fill('#password', 'admin123');
      await page.click('button[type="submit"]');
      await page.waitForURL('/admin/dashboard');

      // Verify we are on the dashboard
      await expect(page.locator('h1')).toContainText('Mahkota Drive Admin');

      // Click "Keluar" button
      await page.click('button:has-text("Keluar")');

      // Verify redirect to login page
      await page.waitForURL('/admin');
      await expect(page.locator('h1')).toContainText('Admin Login');
    });
  });
});
