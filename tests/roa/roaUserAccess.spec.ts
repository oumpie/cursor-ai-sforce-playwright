import { test, expect, Page, Browser } from '@playwright/test';
import { LoginPage } from '../../pages/common/LoginPage';
import { CasePage } from '../../pages/service/CasePage';
import { DataGenerator } from '../../utils/dataGenerator';
import { CountryCode, CountryMapping, RegionHelpers } from '../../types/region.types';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Test suite for ROA (Rest of Africa) user access and case management
 * Tests user authentication and case creation for each ROA country
 */
test.describe('ROA User Access Management', () => {
    // Get all ROA countries for testing
    const roaCountries = RegionHelpers.getROACountries();

    for (const countryCode of roaCountries) {
        const country = CountryMapping[countryCode];
        
        test.describe(`${country.name} User Operations`, () => {
            let loginPage: LoginPage;
            let casePage: CasePage;
            let page: Page;

            test.beforeEach(async ({ browser }) => {
                await setupTestEnvironment(browser);
            });

            /**
             * Sets up the test environment with proper authentication
             */
            async function setupTestEnvironment(browser: Browser) {
                const context = await browser.newContext();
                page = await context.newPage();
                
                const environment = process.env.TEST_ENV || 'dev';
                loginPage = new LoginPage(page, environment);
                casePage = new CasePage(page);

                // Authenticate as ROA admin
                await authenticateAsAdmin();
            }

            /**
             * Handles admin authentication process
             */
            async function authenticateAsAdmin() {
                await loginPage.login(
                    process.env.ROA_ADMIN_USERNAME!,
                    process.env.ROA_ADMIN_PASSWORD!
                );
            }

            test(`${country.name} SVC Agent: Case Creation Flow`, async () => {
                // Login as country-specific agent
                const agentUsername = `${country.prefix}.agent@looksee.com`;
                await loginPage.loginAsRegionalUser(agentUsername, 'SVC Agent Banker', countryCode);

                // Create and verify case
                await createAndVerifyCase();
            });

            /**
             * Creates a case and verifies its creation
             */
            async function createAndVerifyCase() {
                const caseData = DataGenerator.generateRegionalCaseData(countryCode);
                await casePage.navigateToNewCase();
                await casePage.createCase(caseData);

                const caseNumber = await casePage.getCaseNumber();
                expect(caseNumber).toBeTruthy();
                expect(caseNumber.startsWith(country.prefix)).toBeTruthy();
            }

            // Additional test cases...
        });
    }
}); 