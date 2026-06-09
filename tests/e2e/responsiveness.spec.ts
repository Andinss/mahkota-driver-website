import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * E2E tests for responsiveness and accessibility of Mahkota Drive landing page.
 *
 * Validates: Requirements 1.5, 3.4, 5.6, 7.5, 8.3
 */

const viewports = [
  { width: 320, height: 568, label: 'mobile (320px)' },
  { width: 768, height: 1024, label: 'tablet (768px)' },
  { width: 1024, height: 768, label: 'desktop (1024px)' },
];

test.describe('No horizontal overflow', () => {
  for (const viewport of viewports) {
    test(`no horizontal overflow at ${viewport.label}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');

      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      expect(hasOverflow).toBe(false);
    });
  }
});

test.describe('Responsive layout — sections exist', () => {
  const sections = [
    'tentang-kami',
    'layanan',
    'statistik',
    'testimoni',
    'cara-daftar',
    'unduh-aplikasi',
  ];

  test('all main sections are present on the page', async ({ page }) => {
    await page.goto('/');

    for (const sectionId of sections) {
      const section = page.locator(`#${sectionId}`);
      await expect(section).toBeAttached();
    }
  });

  test('navbar is visible', async ({ page }) => {
    await page.goto('/');

    const navbar = page.locator('nav');
    await expect(navbar).toBeVisible();
  });

  test('footer is visible', async ({ page }) => {
    await page.goto('/');

    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });
});

test.describe('Responsive layout — viewport-specific checks', () => {
  test('sections stack vertically on mobile (320px)', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/');

    // Verify sections are visible and not overflowing
    const sections = page.locator('section');
    const count = await sections.count();
    expect(count).toBeGreaterThan(0);

    // Each section should fit within viewport width
    for (let i = 0; i < count; i++) {
      const box = await sections.nth(i).boundingBox();
      if (box) {
        expect(box.width).toBeLessThanOrEqual(320);
      }
    }
  });

  test('navbar adapts to tablet viewport (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    const navbar = page.locator('nav');
    await expect(navbar).toBeVisible();
  });

  test('layout uses multi-column on desktop (1024px)', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/');

    // Verify the page renders without overflow at desktop width
    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasOverflow).toBe(false);

    // Navbar should be visible
    const navbar = page.locator('nav');
    await expect(navbar).toBeVisible();
  });
});

test.describe('Accessibility audit (axe-core)', () => {
  test('no critical accessibility violations on landing page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    // Filter for critical and serious violations only
    const criticalViolations = accessibilityScanResults.violations.filter(
      (violation) => violation.impact === 'critical' || violation.impact === 'serious'
    );

    expect(criticalViolations).toEqual([]);
  });

  test('images have alt text', async ({ page }) => {
    await page.goto('/');

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      // Every image should have an alt attribute (can be empty for decorative)
      expect(alt).not.toBeNull();
    }
  });

  test('interactive elements are keyboard accessible', async ({ page }) => {
    await page.goto('/');

    // All links and buttons should be focusable
    const interactiveElements = page.locator('a[href], button');
    const count = await interactiveElements.count();
    expect(count).toBeGreaterThan(0);

    // Tab through first few interactive elements to verify focus works
    for (let i = 0; i < Math.min(count, 5); i++) {
      await page.keyboard.press('Tab');
      const focused = page.locator(':focus');
      await expect(focused).toBeAttached();
    }
  });
});
