import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/common/LoginPage';
import { AccountPage } from '../pages/sales/AccountPage';
import { OpportunityPage } from '../pages/sales/OpportunityPage';
import { DataGenerator } from '../utils/dataGenerator';
import dotenv from 'dotenv';

interface AccountData {
    accountName: string;
    // ... other account properties
}

interface OpportunityData {
    name: string;
    accountName: string;
    amount: string;
    closeDate: string;
    stage: string;
}

dotenv.config();

test.describe('Salesforce Opportunity Creation', () => {
    let loginPage: LoginPage;
    let accountPage: AccountPage;
    let opportunityPage: OpportunityPage;
    let page: Page;
    let accountName: string;

    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        page = await context.newPage();
        
        const environment = process.env.TEST_ENV || 'dev';
        loginPage = new LoginPage(page, environment);
        accountPage = new AccountPage(page);
        opportunityPage = new OpportunityPage(page);

        // Login as admin first
        await loginPage.login(
            process.env.ADMIN_USERNAME!,
            process.env.ADMIN_PASSWORD!
        );

        // Create an account first
        const accountData = {
            accountName: `Test Account ${DataGenerator.generateCompanyName()}`,
            // ... other required account fields
        };
        accountName = accountData.accountName;
        
        await accountPage.navigateToNewAccount();
        await accountPage.createAccount({
            name: accountData.accountName
        });
    });

    test('should create a new opportunity linked to account', async () => {
        const opportunityData: OpportunityData = DataGenerator.generateOpportunityData(accountName);
        
        await opportunityPage.navigateToNewOpportunity();
        await opportunityPage.createOpportunity(opportunityData);
        
        const isOpportunityCreated = await opportunityPage.verifyOpportunityCreated(opportunityData.name);
        expect(isOpportunityCreated).toBeTruthy();
    });

    test.afterAll(async () => {
        await page.close();
    });
}); 