import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/common/LoginPage';
import { CasePage } from '../pages/service/CasePage';
import { DataGenerator } from '../utils/dataGenerator';
import { CaseData, CaseStatus } from '../types/service.types';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Salesforce Service Case Lifecycle', () => {
    let loginPage: LoginPage;
    let casePage: CasePage;
    let page: Page;
    let caseNumber: string;

    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        page = await context.newPage();
        loginPage = new LoginPage(page);
        casePage = new CasePage(page);

        // Login as admin first
        await loginPage.login(
            process.env.ADMIN_USERNAME!,
            process.env.ADMIN_PASSWORD!
        );

        // Then login as LookSee user
        await loginPage.loginAsUser(process.env.LOOKSEE_USERNAME!);
    });

    test('should create a new service case', async () => {
        const caseData: CaseData = {
            contactName: 'Luke Kettle',
            subject: `Support Request - ${DataGenerator.generateDescription()}`,
            status: 'New' as CaseStatus,
            priority: 'Medium',
            origin: 'Phone',
            type: 'Problem',
            description: DataGenerator.generateDescription(),
            classification: 'Technical Issue',
            region: 'EA',
            country: 'Kenya',
            countryCode: 'KE'
        };
        
        await casePage.navigateToNewCase();
        await casePage.createCase(caseData);
        
        caseNumber = await casePage.getCaseNumber();
        expect(caseNumber).toBeTruthy();
        
        const isCaseStatusNew = await casePage.verifyCaseStatus(caseNumber, 'New');
        expect(isCaseStatusNew).toBeTruthy();
    });

    test('should update case status to In Progress', async () => {
        await casePage.updateCaseStatus(caseNumber, 'In Progress');
        const isCaseInProgress = await casePage.verifyCaseStatus(caseNumber, 'In Progress');
        expect(isCaseInProgress).toBeTruthy();
    });

    test('should classify the case', async () => {
        await casePage.classifyCase(caseNumber, 'Technical Issue');
        await casePage.addCaseComment(caseNumber, 'Case classified as Technical Issue');
    });

    test('should resolve the case', async () => {
        const resolution = 'Issue resolved by following standard procedure';
        await casePage.resolveCase(caseNumber, resolution);
        
        const isCaseClosed = await casePage.verifyCaseStatus(caseNumber, 'Closed');
        expect(isCaseClosed).toBeTruthy();
    });

    test.afterAll(async () => {
        await page.close();
    });
}); 