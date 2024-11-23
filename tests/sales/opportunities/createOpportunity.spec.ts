import { test, expect } from '@playwright/test';
import { AccountPage } from '../../../pages/sales/AccountPage';
import { OpportunityPage } from '../../../pages/sales/OpportunityPage';
import { DataGenerator } from '../../../utils/dataGenerator';
import { TestHelper } from '../../../utils/testHelper';
import { ErrorHandler } from '../../../utils/errors/ErrorHandler';

test.describe('Opportunity Management', () => {
    let accountPage: AccountPage;
    let opportunityPage: OpportunityPage;
    const testId = `test-${Date.now()}`;
    let accountName: string;

    test.beforeEach(async ({ page, browser }) => {
        try {
            // Setup test environment
            const { loginPage } = await TestHelper.setupTest(browser);
            await loginPage.login(
                process.env.SALESFORCE_USERNAME!,
                process.env.SALESFORCE_PASSWORD!
            );

            // Initialize page objects
            accountPage = new AccountPage(page);
            opportunityPage = new OpportunityPage(page);

            // Create prerequisite account
            const accountData = DataGenerator.generateAccountData();
            await accountPage.navigateToNewAccount();
            await accountPage.createAccount(accountData);
            accountName = accountData.name;

        } catch (error) {
            await ErrorHandler.handleTestError(error, {
                testId,
                action: 'Test Setup'
            });
            throw error;
        }
    });

    test('should create new opportunity linked to account', async () => {
        try {
            const opportunityData = DataGenerator.generateOpportunityData(accountName);
            
            await opportunityPage.navigateToNewOpportunity();
            await opportunityPage.createOpportunity(opportunityData);
            
            const isCreated = await opportunityPage.verifyOpportunityCreated(opportunityData.name);
            expect(isCreated).toBeTruthy();
        } catch (error) {
            await ErrorHandler.handleTestError(error, {
                testId,
                action: 'Create Opportunity'
            });
            throw error;
        }
    });

    test('should create regional opportunity linked to account', async () => {
        try {
            const regionalAccountData = DataGenerator.generateRegionalAccountData('KE');
            await accountPage.navigateToNewAccount();
            await accountPage.createAccount(regionalAccountData);

            const opportunityData = DataGenerator.generateOpportunityData(regionalAccountData.name);
            
            await opportunityPage.navigateToNewOpportunity();
            await opportunityPage.createOpportunity(opportunityData);
            
            const isCreated = await opportunityPage.verifyOpportunityCreated(opportunityData.name);
            expect(isCreated).toBeTruthy();
        } catch (error) {
            await ErrorHandler.handleTestError(error, {
                testId,
                action: 'Create Regional Opportunity'
            });
            throw error;
        }
    });

    test.afterEach(async ({ context }) => {
        try {
            await TestHelper.cleanupTest(context);
        } catch (error) {
            console.error('Cleanup failed:', error);
        }
    });
}); 