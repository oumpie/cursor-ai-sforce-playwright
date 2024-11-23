import { BasePage } from '../base/BasePage';
import { Page } from '@playwright/test';
import { PolicyData, PolicyStatus, ClaimData, ClaimStatus } from '../../types/insurance.types';

export class InsurancePolicyPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async navigateToNewPolicy() {
        await this.page.click('a[title="Insurance Policies"]');
        await this.page.click('div[title="New"]');
    }

    async createPolicy(policyData: PolicyData) {
        // Basic Policy Information
        await this.page.fill('input[name="Name"]', policyData.policyName);
        await this.page.selectOption('select[name="PolicyType"]', policyData.policyType);
        await this.page.fill('input[name="PolicyHolder"]', policyData.policyHolder);
        
        // Dates
        await this.page.fill('input[name="EffectiveDate"]', policyData.effectiveDate);
        await this.page.fill('input[name="ExpirationDate"]', policyData.expirationDate);
        
        // Financial Information
        await this.page.fill('input[name="AnnualPremium"]', policyData.premium.toString());
        await this.page.fill('input[name="CoverageAmount"]', policyData.coverageAmount.toString());
        await this.page.fill('input[name="Deductible"]', policyData.deductible.toString());
        
        // Status
        await this.page.selectOption('select[name="Status"]', policyData.status);
        
        await this.page.click('button[name="SaveEdit"]');
    }

    async submitClaim(policyNumber: string, claimData: ClaimData) {
        await this.page.click('a[title="Insurance Policies"]');
        await this.page.fill('input[name="Policy-search-input"]', policyNumber);
        await this.page.click(`//a[contains(text(),'${policyNumber}')]`);
        
        await this.page.click('button[title="Submit Claim"]');
        
        // Fill claim details
        await this.page.fill('input[name="ClaimType"]', claimData.claimType);
        await this.page.fill('input[name="IncidentDate"]', claimData.incidentDate);
        await this.page.fill('input[name="ReportedDate"]', claimData.reportedDate);
        await this.page.fill('textarea[name="Description"]', claimData.description);
        
        if (claimData.damageEstimate) {
            await this.page.fill('input[name="DamageEstimate"]', claimData.damageEstimate.toString());
        }
        
        if (claimData.location) {
            await this.page.fill('input[name="Location"]', claimData.location);
        }
        
        await this.page.click('button[name="SaveEdit"]');
    }

    async verifyPolicyStatus(policyNumber: string, expectedStatus: PolicyStatus): Promise<boolean> {
        await this.page.click('a[title="Insurance Policies"]');
        await this.page.fill('input[name="Policy-search-input"]', policyNumber);
        await this.page.click(`//a[contains(text(),'${policyNumber}')]`);
        
        const actualStatus = await this.page.textContent('span.slds-form-element__static[field-label="Status"]');
        return actualStatus?.trim() === expectedStatus;
    }

    async getPolicyNumber(): Promise<string> {
        await this.waitForPageLoad();
        const policyNumber = await this.page.textContent('span.slds-form-element__static[field-label="Policy Number"]');
        return policyNumber?.trim() || '';
    }

    async getClaimStatus(policyNumber: string): Promise<ClaimStatus> {
        await this.page.click('a[title="Insurance Policies"]');
        await this.page.fill('input[name="Policy-search-input"]', policyNumber);
        await this.page.click(`//a[contains(text(),'${policyNumber}')]`);
        
        // Navigate to Claims related list
        await this.page.click('a[title="Claims"]');
        
        // Get the most recent claim status
        const status = await this.page.textContent('td[data-label="Status"]:first-child');
        return (status?.trim() || 'New') as ClaimStatus;
    }
} 