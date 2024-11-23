import { test, expect } from '@playwright/test';
import { AccountPage } from '../../../pages/sales/AccountPage';
import { DataGenerator, AccountData } from '../../../utils/dataGenerator';
import { TestHelper } from '../../../utils/testHelper';
import { ErrorHandler } from '../../../utils/errors/ErrorHandler';

test.describe('Account Management', () => {
    let accountPage: AccountPage;
    const testId = `test-${Date.now()}`;

    test.beforeEach(async ({ page, browser }) => {
        try {
            // Setup test environment with proper error handling
            const { loginPage } = await TestHelper.setupTest(browser);
            
            // Login with environment-specific credentials
            await loginPage.login(
                process.env.SALESFORCE_USERNAME!,
                process.env.SALESFORCE_PASSWORD!
            );

            // Initialize page objects
            accountPage = new AccountPage(page);
        } catch (error) {
            await ErrorHandler.handleTestError(error, {
                testId,
                action: 'Test Setup'
            });
            throw error;
        }
    });

    test('should create new account with complete data', async () => {
        try {
            const accountData = DataGenerator.generateAccountData();
            
            // Type assertion to ensure accountData matches the interface
            if (!isValidAccountData(accountData)) {
                throw new Error('Invalid account data generated');
            }

            await accountPage.navigateToNewAccount();
            await accountPage.createAccount(accountData);
            
            const isCreated = await accountPage.verifyAccountCreated(accountData.name);
            expect(isCreated).toBeTruthy();
        } catch (error) {
            await ErrorHandler.handleTestError(error, {
                testId,
                action: 'Create Account'
            });
            throw error;
        }
    });

    // Type guard function
    function isValidAccountData(data: any): data is AccountData {
        return (
            data &&
            typeof data.name === 'string' &&
            (!data.type || ['Customer', 'Partner', 'Prospect'].includes(data.type)) &&
            (!data.rating || ['Hot', 'Warm', 'Cold'].includes(data.rating))
        );
    }

    test('should create account with regional data', async () => {
        try {
            // Generate regional-specific account data
            const accountData = DataGenerator.generateRegionalAccountData('KE');
            
            // Validate required fields and regional data
            if (!accountData.name || !accountData.billingAddress?.country) {
                throw new Error('Account name and billing country are required for regional accounts');
            }

            // Create account using POM
            await accountPage.navigateToNewAccount();
            await accountPage.createAccount(accountData);
            
            // Verify account creation
            const isCreated = await accountPage.verifyAccountCreated(accountData.name);
            expect(isCreated).toBeTruthy();

            // Verify regional specific data
            const hasRegionalData = await accountPage.verifyRegionalData(accountData);
            expect(hasRegionalData).toBeTruthy();
        } catch (error) {
            await ErrorHandler.handleTestError(error, {
                testId,
                action: 'Create Regional Account'
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