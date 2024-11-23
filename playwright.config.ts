import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalSetup: require.resolve('./global-setup'),
  use: {
    baseURL: process.env.BASE_URL || 'https://test.salesforce.com',
    storageState: 'playwright/.auth/admin.json',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: {
      mode: 'retain-on-failure',
      snapshots: true,
      screenshots: true,
      sources: true
    }
  },
  projects: [
    {
      name: 'setup',
      testMatch: /global-setup\.ts/,
    },
    {
      name: 'authenticated tests',
      dependencies: ['setup'],
      testMatch: /.*\.spec\.ts/,
      use: {
        storageState: 'playwright/.auth/admin.json',
      },
    },
  ],
  fullyParallel: true,
  metadata: {
    platform: process.platform,
    headless: !!process.env.CI,
    environment: process.env.TEST_ENV || 'dev',
    region: process.env.TEST_REGION || 'EA'
  },
  expect: {
    timeout: 10000,
    toHaveScreenshot: {
      maxDiffPixels: 100
    }
  },
}); 