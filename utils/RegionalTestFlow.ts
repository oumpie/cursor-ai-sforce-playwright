import { Browser, BrowserContext, Page } from '@playwright/test';
import { TestHelper } from './testHelper';
import { RegionalContextManager } from './regionalContext';
import { testConfig } from '../config/testConfig';
import { AfricanRegion, CountryCode } from '../types/region.types';

export class RegionalTestFlow {
    static async setupRegionalTest(browser: Browser, region: AfricanRegion = testConfig.regional.defaultRegion as AfricanRegion) {
        const regionalManager = RegionalContextManager.getInstance();
        const countryCode = this.getDefaultCountryForRegion(region);
        await regionalManager.setContext(region, countryCode);

        const { context, page, regionalContext } = await TestHelper.setupRegionalTest(
            browser,
            region
        );

        await TestHelper.setupRegionalContext(page, region);

        return { context, page, regionalContext };
    }

    private static getDefaultCountryForRegion(region: AfricanRegion): CountryCode {
        const regionDefaults: Record<AfricanRegion, CountryCode> = {
            'EA': 'KE',
            'WA': 'GH',
            'ROA': 'NA',
            'SA': 'ZA'
        };
        return regionDefaults[region];
    }
} 