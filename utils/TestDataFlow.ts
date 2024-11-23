import { DataManager } from './dataManager';
import { DataGenerator } from './dataGenerator';
import { RegionalContextManager } from './regionalContext';
import { CountryCode } from '../types/region.types';
import { TestError } from './errors/TestError';

export class TestDataFlow {
    private dataManager: DataManager;
    private regionalContext: RegionalContextManager;

    constructor() {
        this.dataManager = DataManager.getInstance();
        this.regionalContext = RegionalContextManager.getInstance();
    }

    async setupTestData(testId: string, region: string): Promise<void> {
        const context = await this.regionalContext.getContext();
        if (!context) {
            throw new TestError('Regional context not set', {
                action: 'Setup Test Data',
                error: 'Missing regional context'
            });
        }

        try {
            const testData = await DataGenerator.generateRegionalCaseData(
                context.countryCode as CountryCode
            );
            
            await this.dataManager.registerCleanupTask(testId, async () => {
                await this.cleanupTestData(testId, testData);
            });

            await this.dataManager.setData(testId, testData);
        } catch (error) {
            throw new TestError('Failed to setup test data', {
                action: 'Setup Test Data',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    private async cleanupTestData(testId: string, data: any): Promise<void> {
        // Implement cleanup logic
        console.log(`Cleaning up test data for ${testId}`);
    }
} 