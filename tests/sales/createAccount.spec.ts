import { test } from '@playwright/test';

test('should create account while authenticated', async ({ page }) => {
    // Test starts already authenticated
    await page.goto('/lightning/o/Account/list');
    // Rest of your test...
}); 