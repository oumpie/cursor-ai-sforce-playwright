import { Browser, BrowserContext, Page } from '@playwright/test';
import { LoginPage } from '../pages/common/LoginPage';
import { environments } from '../config/environment.config';
import { RegionalDefaults, RegionalContext } from '../types/region.types';
import { TestError, RegionalError } from './errors';

export class TestHelper {
    private static async delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static async setupRegionalContext(page: Page, region: string): Promise<void> {
        const context = RegionalDefaults[region];
        await page.setExtraHTTPHeaders({
            'Accept-Language': context.locale
        });
        await page.context().addInitScript(`{
            Intl.DateTimeFormat.prototype.resolvedOptions = () => ({
                timeZone: '${context.timezone}'
            });
        }`);
    }

    static async setupTest(browser: Browser, environment: string = 'dev'): Promise<{
        context: BrowserContext;
        page: Page;
        loginPage: LoginPage;
    }> {
        const context = await browser.newContext();
        const page = await context.newPage();
        const loginPage = new LoginPage(page, environment);

        return { context, page, loginPage };
    }

    static getEnvironmentConfig(env: string) {
        return environments[env] || environments.dev;
    }

    static async cleanupTest(context: BrowserContext) {
        await context.close();
    }

    static async saveAuthenticationState(page: Page) {
        await page.context().storageState({ path: 'auth.json' });
    }

    static async loadAuthenticationState(browser: Browser) {
        return await browser.newContext({
            storageState: 'auth.json'
        });
    }

    static async cleanupTestData(testId: string): Promise<void> {
        // Implement cleanup logic
    }

    private static readonly RETRY_OPTIONS = {
        maxAttempts: 3,
        delayMs: 1000
    };

    static async withRetry<T>(
        operation: () => Promise<T>,
        context: { action: string; page?: string }
    ): Promise<T> {
        let lastError: Error | undefined;

        for (let attempt = 1; attempt <= this.RETRY_OPTIONS.maxAttempts; attempt++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error as Error;
                if (attempt < this.RETRY_OPTIONS.maxAttempts) {
                    await this.delay(this.RETRY_OPTIONS.delayMs);
                }
            }
        }

        throw new TestError(
            `Operation failed after ${this.RETRY_OPTIONS.maxAttempts} attempts`,
            { ...context, error: lastError?.message }
        );
    }

    static async setupRegionalTest(
        browser: Browser,
        region: string
    ): Promise<{
        context: BrowserContext;
        page: Page;
        regionalContext: RegionalContext;
    }> {
        const regionalContext = RegionalDefaults[region];
        if (!regionalContext) {
            throw new RegionalError(
                `Invalid region: ${region}`,
                { region, country: 'Unknown', operation: 'Setup' }
            );
        }

        const context = await browser.newContext({
            locale: regionalContext.locale,
            timezoneId: regionalContext.timezone
        });

        const page = await context.newPage();
        return { context, page, regionalContext };
    }
} 