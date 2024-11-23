import { chromium, FullConfig } from '@playwright/test';
import { environments } from './config/environment.config';

async function globalSetup(config: FullConfig) {
    const { baseURL, storageState } = config.projects[0].use;
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // Get environment-specific credentials
    const env = process.env.TEST_ENV || 'dev';
    const credentials = environments[env];

    try {
        // Navigate to Salesforce login
        await page.goto(baseURL!);

        // Login
        await page.fill('#username', credentials.adminUsername!);
        await page.fill('#password', credentials.adminPassword!);
        await page.click('#Login');

        // Wait for login to complete
        await page.waitForURL('**/lightning/page/**');

        // Save signed-in state
        await context.storageState({ 
            path: 'playwright/.auth/admin.json' 
        });

        await browser.close();
    } catch (error) {
        console.error('Authentication failed:', error);
        throw error;
    }
}

export default globalSetup; 