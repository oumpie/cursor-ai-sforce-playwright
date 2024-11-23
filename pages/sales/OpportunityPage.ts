import { BasePage } from '../base/BasePage';
import { Page } from '@playwright/test';

export class OpportunityPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async navigateToNewOpportunity() {
        await this.page.click('a[title="Opportunities"]');
        await this.page.click('div[title="New"]');
    }

    async createOpportunity(opportunityData: any) {
        await this.page.fill('input[name="Name"]', opportunityData.name);
        await this.page.fill('input[name="Amount"]', opportunityData.amount);
        await this.page.fill('input[name="CloseDate"]', opportunityData.closeDate);
        await this.page.selectOption('select[name="StageName"]', opportunityData.stage);
        
        if (opportunityData.accountName) {
            await this.page.fill('input[name="Account"]', opportunityData.accountName);
            await this.page.click(`//lightning-base-combobox-item//span[text()="${opportunityData.accountName}"]`);
        }

        await this.page.click('button[name="SaveEdit"]');
    }

    async verifyOpportunityCreated(opportunityName: string) {
        await this.waitForPageLoad();
        return await this.page.isVisible(`//span[contains(text(),'${opportunityName}')]`);
    }
} 