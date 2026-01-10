import { test, expect } from '@playwright/test';

test.describe('Volunteer Platform', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Voli/);
  });
});

