import { Page } from '@playwright/test';

export class AccountPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToNewAccount() {
    await this.page.click('a[title="Accounts"]');
    await this.page.click('div[title="New"]');
  }

  async createAccount(accountData: any) {
    await this.page.fill('input[name="Name"]', accountData.accountName);
    await this.page.fill('input[name="Phone"]', accountData.phone);
    await this.page.selectOption('select[name="Industry"]', accountData.industry);
    await this.page.selectOption('select[name="Type"]', accountData.type);
    await this.page.fill('input[name="Website"]', accountData.website);
    await this.page.fill('textarea[name="Description"]', accountData.description);
    
    // Billing Address
    await this.page.fill('textarea[name="BillingStreet"]', accountData.billingStreet);
    await this.page.fill('input[name="BillingCity"]', accountData.billingCity);
    await this.page.fill('input[name="BillingState"]', accountData.billingState);
    await this.page.fill('input[name="BillingPostalCode"]', accountData.billingZipCode);
    await this.page.fill('input[name="BillingCountry"]', accountData.billingCountry);

    await this.page.click('button[name="SaveEdit"]');
  }

  async verifyAccountCreated(accountName: string) {
    await this.page.waitForSelector('.slds-page-header__title');
    return await this.page.isVisible(`//span[contains(text(),'${accountName}')]`);
  }
} 