import { Page } from '@playwright/test';
import { TestError, ApiError, ValidationError, RegionalError } from './index';
import { testConfig } from '../../config/testConfig';

export class ErrorHandler {
    static async handleTestError(error: Error, context: {
        page?: Page;
        testId: string;
        action: string;
    }): Promise<void> {
        const errorContext = {
            timestamp: new Date().toISOString(),
            testId: context.testId,
            action: context.action,
            error: error.message
        };

        try {
            if (error instanceof ApiError) {
                await this.handleApiError(error, context);
            } else if (error instanceof ValidationError) {
                await this.handleValidationError(error, context);
            } else if (error instanceof RegionalError) {
                await this.handleRegionalError(error, context);
            }

            if (testConfig.reporting.screenshotOnFailure && context.page) {
                await this.captureErrorScreenshot(context.page, context.testId);
            }
        } catch (handlingError) {
            console.error('Error while handling test error:', handlingError);
            throw handlingError;
        }
    }

    private static async handleApiError(error: ApiError, context: any): Promise<void> {
        console.error(`API Error in ${context.action}:`, error.apiContext);
    }

    private static async handleValidationError(error: ValidationError, context: any): Promise<void> {
        console.error(`Validation Error in ${context.action}:`, error.validationContext);
    }

    private static async handleRegionalError(error: RegionalError, context: any): Promise<void> {
        console.error(`Regional Error in ${context.action}:`, error.regionalContext);
    }

    private static async captureErrorScreenshot(page: Page, testId: string): Promise<string> {
        const screenshotPath = `error-screenshots/${testId}-${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        return screenshotPath;
    }
} 