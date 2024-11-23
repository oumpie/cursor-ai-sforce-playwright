import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/common/LoginPage';
import { CasePage } from '../pages/service/CasePage';
import { DataGenerator } from '../utils/dataGenerator';
import { CountryCode, CountryMapping, RegionHelpers } from '../types/region.types';
import dotenv from 'dotenv';

dotenv.config();

// Get all countries except South Africa for ROA testing
const roaCountries = RegionHelpers.getROACountries();
const primaryMarkets = RegionHelpers.getPrimaryMarkets().filter(code => code !== 'ZA');
const southAfrica: CountryCode = 'ZA';

// Test primary markets first
for (const countryCode of primaryMarkets) {
    const country = CountryMapping[countryCode];
    
    test.describe(`Salesforce Service Case Creation - ${country.name} (Primary Market)`, () => {
        let loginPage: LoginPage;
        let casePage: CasePage;
        let page: Page;
        let caseNumber: string;

        test.beforeAll(async ({ browser }) => {
            const context = await browser.newContext();
            page = await context.newPage();
            
            const environment = process.env.TEST_ENV || 'dev';
            loginPage = new LoginPage(page, environment);
            casePage = new CasePage(page);

            // Login as admin first
            await loginPage.login(
                process.env.ADMIN_USERNAME!,
                process.env.ADMIN_PASSWORD!
            );

            // Then login as regional SVC Agent Banker
            const regionalUsername = `${country.prefix}.agent@looksee.com`;
            await loginPage.loginAsRegionalUser(regionalUsername, 'SVC Agent Banker', countryCode);
        });

        test('should create a new service case with regional context', async () => {
            const caseData = DataGenerator.generateRegionalCaseData(countryCode);
            
            await casePage.navigateToNewCase();
            await casePage.createCase(caseData);
            
            caseNumber = await casePage.getCaseNumber();
            expect(caseNumber).toBeTruthy();
            expect(caseNumber.startsWith(country.prefix)).toBeTruthy();
            
            const isCaseStatusNew = await casePage.verifyCaseStatus(caseNumber, 'New');
            expect(isCaseStatusNew).toBeTruthy();
        });

        test('should process case through regional workflow', async () => {
            await casePage.updateCaseStatus(caseNumber, 'In Progress');
            await casePage.classifyCase(caseNumber, 'Technical Issue');
            await casePage.addCaseComment(
                caseNumber, 
                `Case being handled by ${country.prefix} SVC Agent Banker`
            );
            
            const resolution = `Issue resolved following ${country.name} standard procedure`;
            await casePage.resolveCase(caseNumber, resolution);
            
            const isCaseClosed = await casePage.verifyCaseStatus(caseNumber, 'Closed');
            expect(isCaseClosed).toBeTruthy();
        });
    });
}

// Test South Africa separately
test.describe('Salesforce Service Case Creation - South Africa', () => {
    let loginPage: LoginPage;
    let casePage: CasePage;
    let page: Page;
    let caseNumber: string;

    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        page = await context.newPage();
        
        const environment = process.env.TEST_ENV || 'dev';
        loginPage = new LoginPage(page, environment);
        casePage = new CasePage(page);

        // Login as South African admin
        await loginPage.login(
            process.env.SA_ADMIN_USERNAME!,
            process.env.SA_ADMIN_PASSWORD!
        );

        // Then login as SA SVC Agent Banker
        const saUsername = `${CountryMapping[southAfrica].prefix}.agent@looksee.com`;
        await loginPage.loginAsRegionalUser(saUsername, 'SVC Agent Banker', southAfrica);
    });

    test('should create a new service case with regional context', async () => {
        const caseData = DataGenerator.generateRegionalCaseData(southAfrica);
        
        await casePage.navigateToNewCase();
        await casePage.createCase(caseData);
        
        caseNumber = await casePage.getCaseNumber();
        expect(caseNumber).toBeTruthy();
        expect(caseNumber.startsWith(CountryMapping[southAfrica].prefix)).toBeTruthy();
        
        const isCaseStatusNew = await casePage.verifyCaseStatus(caseNumber, 'New');
        expect(isCaseStatusNew).toBeTruthy();
    });

    test('should process case through regional workflow', async () => {
        await casePage.updateCaseStatus(caseNumber, 'In Progress');
        await casePage.classifyCase(caseNumber, 'Technical Issue');
        await casePage.addCaseComment(
            caseNumber, 
            `Case being handled by ${CountryMapping[southAfrica].prefix} SVC Agent Banker`
        );
        
        const resolution = `Issue resolved following South Africa standard procedure`;
        await casePage.resolveCase(caseNumber, resolution);
        
        const isCaseClosed = await casePage.verifyCaseStatus(caseNumber, 'Closed');
        expect(isCaseClosed).toBeTruthy();
    });
});

// Test ROA countries
for (const countryCode of roaCountries) {
    const country = CountryMapping[countryCode];
    
    test.describe(`Salesforce Service Case Creation - ${country.name} (ROA)`, () => {
        let loginPage: LoginPage;
        let casePage: CasePage;
        let page: Page;
        let caseNumber: string;

        test.beforeAll(async ({ browser }) => {
            const context = await browser.newContext();
            page = await context.newPage();
            
            const environment = process.env.TEST_ENV || 'dev';
            loginPage = new LoginPage(page, environment);
            casePage = new CasePage(page);

            // Login as ROA admin
            await loginPage.login(
                process.env.ROA_ADMIN_USERNAME!,
                process.env.ROA_ADMIN_PASSWORD!
            );

            // Then login as regional SVC Agent Banker
            const regionalUsername = `${country.prefix}.agent@looksee.com`;
            await loginPage.loginAsRegionalUser(regionalUsername, 'SVC Agent Banker', countryCode);
        });

        test('should create a new service case with ROA context', async () => {
            const caseData = DataGenerator.generateRegionalCaseData(countryCode);
            
            await casePage.navigateToNewCase();
            await casePage.createCase(caseData);
            
            caseNumber = await casePage.getCaseNumber();
            expect(caseNumber).toBeTruthy();
            expect(caseNumber.startsWith(country.prefix)).toBeTruthy();
            
            // Additional ROA-specific validations can be added here
        });

        test('should process case through regional workflow', async () => {
            await casePage.updateCaseStatus(caseNumber, 'In Progress');
            await casePage.classifyCase(caseNumber, 'Technical Issue');
            await casePage.addCaseComment(
                caseNumber, 
                `Case being handled by ${country.prefix} SVC Agent Banker`
            );
            
            const resolution = `Issue resolved following ${country.name} standard procedure`;
            await casePage.resolveCase(caseNumber, resolution);
            
            const isCaseClosed = await casePage.verifyCaseStatus(caseNumber, 'Closed');
            expect(isCaseClosed).toBeTruthy();
        });
    });
} 