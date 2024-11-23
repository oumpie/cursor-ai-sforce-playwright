import { test } from '@playwright/test';
import { RegionalTestFlow } from '../../utils/RegionalTestFlow';
import { TestDataFlow } from '../../utils/TestDataFlow';
import { ErrorHandler } from '../../utils/errors/ErrorHandler';
import { DataManager } from '../../utils/dataManager';

test.describe('Regional Test Example', () => {
    let testFlow: TestDataFlow;
    const testId = `test-${Date.now()}`;
    const dataManager = DataManager.getInstance();

    test.beforeEach(async ({ browser }) => {
        testFlow = new TestDataFlow();
        
        try {
            const { page } = await RegionalTestFlow.setupRegionalTest(browser, 'EA');
            await testFlow.setupTestData(testId, 'EA');
        } catch (error) {
            await ErrorHandler.handleTestError(error, {
                testId,
                action: 'Test Setup'
            });
            throw error;
        }
    });

    test.afterEach(async () => {
        await dataManager.cleanup(testId);
    });
}); 