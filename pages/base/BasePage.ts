import { Page, errors } from '@playwright/test';

/**
 * Base page object that provides common functionality for all Salesforce pages
 */
export class BasePage {
    protected page: Page;
    protected defaultTimeout = 30000; // 30 seconds

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Waits for the Salesforce page header to be visible
     * This indicates the page has fully loaded
     */
    async waitForPageLoad(): Promise<void> {
        try {
            await this.page.waitForSelector('span.slds-page-header__title', {
                timeout: this.defaultTimeout
            });
        } catch (error) {
            if (error instanceof errors.TimeoutError) {
                throw new Error('Page failed to load within the specified timeout');
            }
            throw error;
        }
    }

    /**
     * Waits for a specific toast message to appear
     * @param message - The expected toast message text
     */
    async waitForToast(message: string): Promise<void> {
        try {
            await this.page.waitForSelector(
                `div.slds-notify__content:has-text("${message}")`,
                { timeout: this.defaultTimeout }
            );
        } catch (error) {
            if (error instanceof errors.TimeoutError) {
                throw new Error(`Toast message "${message}" did not appear`);
            }
            throw error;
        }
    }

    /**
     * Waits for any loading spinners to disappear
     */
    async waitForSpinner(): Promise<void> {
        try {
            await this.page.waitForSelector('div.slds-spinner', {
                state: 'hidden',
                timeout: this.defaultTimeout
            });
        } catch (error) {
            if (error instanceof errors.TimeoutError) {
                throw new Error('Loading spinner did not disappear');
            }
            throw error;
        }
    }

    protected async waitForLoadingState(): Promise<void> {
        await Promise.all([
            this.page.waitForLoadState('networkidle'),
            this.page.waitForSelector('.slds-spinner', { state: 'hidden' })
        ]);
    }

    protected async retryOperation<T>(
        operation: () => Promise<T>,
        maxAttempts = 3
    ): Promise<T> {
        let lastError: Error | undefined;
        
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error as Error;
                if (attempt < maxAttempts) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }
        
        throw new Error(`Operation failed after ${maxAttempts} attempts: ${lastError?.message}`);
    }
} 