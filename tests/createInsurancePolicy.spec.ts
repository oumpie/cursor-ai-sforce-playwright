import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/common/LoginPage';
import { InsurancePolicyPage } from '../pages/fsc/InsurancePolicyPage';
import { DataGenerator } from '../utils/dataGenerator';
import { PolicyData, ClaimData } from '../types/insurance.types';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Salesforce FSC Insurance Policy Management', () => {
    let loginPage: LoginPage;
    let insurancePolicyPage: InsurancePolicyPage;
    let page: Page;
    let policyNumber: string;

    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        page = await context.newPage();
        
        const environment = process.env.TEST_ENV || 'dev';
        loginPage = new LoginPage(page, environment);
        insurancePolicyPage = new InsurancePolicyPage(page);

        // Login as FSC user
        await loginPage.login(
            process.env.LOOKSEE_USERNAME!,
            process.env.LOOKSEE_PASSWORD!
        );
    });

    test('should create a new life insurance policy', async () => {
        const policyData: PolicyData = DataGenerator.generateInsurancePolicyData();
        
        await insurancePolicyPage.navigateToNewPolicy();
        await insurancePolicyPage.createPolicy(policyData);
        
        policyNumber = await insurancePolicyPage.getPolicyNumber();
        expect(policyNumber).toBeTruthy();
        
        const isPolicyActive = await insurancePolicyPage.verifyPolicyStatus(policyNumber, 'Active');
        expect(isPolicyActive).toBeTruthy();
    });

    test('should submit a claim against the policy', async () => {
        const baseClaimData = DataGenerator.generateClaimData();
        const claimData: ClaimData = {
            ...baseClaimData,
            policyNumber
        };
        
        await insurancePolicyPage.submitClaim(policyNumber, claimData);
        
        // Verify claim submission
        const claimStatus = await insurancePolicyPage.getClaimStatus(policyNumber);
        expect(claimStatus).toBe('New');
    });

    test.afterAll(async () => {
        await page.close();
    });
}); 