import { BasePage } from '../base/BasePage';
import { Page } from '@playwright/test';

export class LeadPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async navigateToNewLead() {
        await this.page.click('a[title="Leads"]');
        await this.page.click('div[title="New"]');
    }

    async createLead(leadData: any) {
        // Salutation
        await this.page.click('button[name="salutation"]');
        await this.page.click(`lightning-base-combobox-item[data-value="${leadData.salutation}"]`);
        
        // Required fields
        await this.page.fill('input[name="firstName"]', leadData.firstName);
        await this.page.fill('input[name="lastName"]', leadData.lastName);
        await this.page.fill('input[name="Company"]', leadData.company);
        await this.page.fill('input[name="Email"]', leadData.email);
        await this.page.fill('input[name="Phone"]', leadData.phone);
        
        // LookSip specific fields
        await this.page.selectOption('select[name="LeadSource"]', leadData.leadSource);
        await this.page.selectOption('select[name="Rating"]', leadData.rating);
        await this.page.selectOption('select[name="Industry"]', leadData.industry);
        
        // Address
        await this.page.fill('textarea[name="Street"]', leadData.street);
        await this.page.fill('input[name="City"]', leadData.city);
        await this.page.fill('input[name="State"]', leadData.state);
        await this.page.fill('input[name="PostalCode"]', leadData.postalCode);
        await this.page.fill('input[name="Country"]', leadData.country);
        
        await this.page.click('button[name="SaveEdit"]');
    }

    async verifyLeadCreated(leadName: string) {
        await this.waitForPageLoad();
        return await this.page.isVisible(`//span[contains(text(),'${leadName}')]`);
    }
} 