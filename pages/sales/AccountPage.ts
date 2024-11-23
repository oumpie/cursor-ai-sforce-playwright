import { BasePage } from '../base/BasePage';
import { Page } from '@playwright/test';
import { AccountData } from '../../utils/dataGenerator';

export class AccountPage extends BasePage {
    // Locators
    private readonly newButton = 'a[title="New"]';
    private readonly accountNameInput = 'input[name="Name"]';
    private readonly industrySelect = 'button[aria-label="Industry"]';
    private readonly typeSelect = 'button[aria-label="Type"]';
    private readonly ratingSelect = 'button[aria-label="Rating"]';
    private readonly phoneInput = 'input[name="Phone"]';
    private readonly websiteInput = 'input[name="Website"]';
    private readonly descriptionTextarea = 'textarea[name="Description"]';
    private readonly saveButton = 'button[name="SaveEdit"]';

    // Add billing address locators
    private readonly billingStreetInput = 'textarea[name="BillingStreet"]';
    private readonly billingCityInput = 'input[name="BillingCity"]';
    private readonly billingStateInput = 'input[name="BillingState"]';
    private readonly billingPostalCodeInput = 'input[name="BillingPostalCode"]';
    private readonly billingCountryInput = 'input[name="BillingCountry"]';

    constructor(page: Page) {
        super(page);
    }

    async navigateToNewAccount(): Promise<void> {
        await this.retryOperation(async () => {
            await this.page.click(this.newButton);
            await this.waitForLoadingState();
        });
    }

    async createAccount(accountData: AccountData): Promise<void> {
        // Type validation
        if (!this.validateAccountData(accountData)) {
            throw new Error('Invalid account data structure');
        }

        await this.fillAccountForm(accountData);
        await this.saveAccount();
        await this.verifyAccountCreated(accountData.name);
    }

    private validateAccountData(data: any): data is AccountData {
        return (
            typeof data === 'object' &&
            typeof data.name === 'string' &&
            data.name.length > 0
        );
    }

    private async fillAccountForm(accountData: AccountData): Promise<void> {
        await this.fillRequiredFields(accountData);
        await this.fillOptionalFields(accountData);
        if (accountData.billingAddress) {
            await this.fillBillingAddress(accountData.billingAddress);
        }
    }

    private async fillBillingAddress(billingAddress: AccountData['billingAddress']): Promise<void> {
        if (!billingAddress) return;

        await this.page.fill(this.billingStreetInput, billingAddress.street);
        await this.page.fill(this.billingCityInput, billingAddress.city);
        await this.page.fill(this.billingStateInput, billingAddress.state);
        await this.page.fill(this.billingPostalCodeInput, billingAddress.postalCode);
        await this.page.fill(this.billingCountryInput, billingAddress.country);
    }

    private async fillRequiredFields(accountData: AccountData): Promise<void> {
        await this.page.fill(this.accountNameInput, accountData.name);
        if (accountData.industry) {
            await this.selectFromDropdown(this.industrySelect, accountData.industry);
        }
    }

    private async fillOptionalFields(accountData: AccountData): Promise<void> {
        if (accountData.type) {
            await this.selectFromDropdown(this.typeSelect, accountData.type);
        }
        if (accountData.rating) {
            await this.selectFromDropdown(this.ratingSelect, accountData.rating);
        }
        if (accountData.phone) {
            await this.page.fill(this.phoneInput, accountData.phone);
        }
        if (accountData.website) {
            await this.page.fill(this.websiteInput, accountData.website);
        }
        if (accountData.description) {
            await this.page.fill(this.descriptionTextarea, accountData.description);
        }
    }

    private async selectFromDropdown(selector: string, value: string): Promise<void> {
        await this.page.click(selector);
        await this.page.click(`lightning-base-combobox-item[data-value="${value}"]`);
    }

    private async saveAccount(): Promise<void> {
        await this.page.click(this.saveButton);
        await this.waitForLoadingState();
    }

    async verifyAccountCreated(accountName: string): Promise<boolean> {
        await this.waitForToast('Account Created');
        const headerTitle = await this.page.textContent('span.slds-page-header__title');
        return headerTitle?.includes(accountName) || false;
    }

    async verifyBillingAddress(billingAddress: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    }): Promise<boolean> {
        try {
            const street = await this.page.inputValue(this.billingStreetInput);
            const city = await this.page.inputValue(this.billingCityInput);
            const state = await this.page.inputValue(this.billingStateInput);
            const postalCode = await this.page.inputValue(this.billingPostalCodeInput);
            const country = await this.page.inputValue(this.billingCountryInput);

            return (
                street === billingAddress.street &&
                city === billingAddress.city &&
                state === billingAddress.state &&
                postalCode === billingAddress.postalCode &&
                country === billingAddress.country
            );
        } catch (error) {
            console.error('Error verifying billing address:', error);
            return false;
        }
    }

    async verifyRegionalData(accountData: AccountData): Promise<boolean> {
        try {
            // Verify billing address
            if (accountData.billingAddress) {
                const hasValidAddress = await this.verifyBillingAddress(accountData.billingAddress);
                if (!hasValidAddress) return false;
            }

            // Verify regional specific fields
            const countrySpecificFields = await this.verifyCountrySpecificFields(accountData);
            if (!countrySpecificFields) return false;

            return true;
        } catch (error) {
            console.error('Error verifying regional data:', error);
            return false;
        }
    }

    private async verifyCountrySpecificFields(accountData: AccountData): Promise<boolean> {
        // Add any country-specific field verifications here
        // For example, VAT numbers, registration numbers, etc.
        return true; // Placeholder implementation
    }
} 