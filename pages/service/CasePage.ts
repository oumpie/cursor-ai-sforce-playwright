import { BasePage } from '../base/BasePage';
import { Page } from '@playwright/test';
import { CaseData, CaseStatus, CaseClassification } from '../../types/service.types';

export class CasePage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async navigateToNewCase() {
        await this.page.click('a[title="Cases"]');
        await this.page.click('div[title="New"]');
    }

    async createCase(caseData: CaseData) {
        // Contact Information
        await this.page.fill('input[name="ContactId"]', caseData.contactName);
        await this.page.click(`//lightning-base-combobox-item//span[text()="${caseData.contactName}"]`);
        
        // Case Information
        await this.page.fill('input[name="Subject"]', caseData.subject);
        await this.page.selectOption('select[name="Status"]', caseData.status);
        await this.page.selectOption('select[name="Priority"]', caseData.priority);
        await this.page.selectOption('select[name="Origin"]', caseData.origin);
        await this.page.selectOption('select[name="Type"]', caseData.type);
        
        // Description
        await this.page.fill('textarea[name="Description"]', caseData.description);
        
        await this.page.click('button[name="SaveEdit"]');
    }

    async updateCaseStatus(caseNumber: string, newStatus: CaseStatus) {
        // Navigate to case detail
        await this.page.click('a[title="Cases"]');
        await this.page.fill('input[name="Case-search-input"]', caseNumber);
        await this.page.click(`//a[contains(text(),'${caseNumber}')]`);
        
        // Click edit button
        await this.page.click('button[name="Edit"]');
        
        // Update status
        await this.page.selectOption('select[name="Status"]', newStatus);
        
        // Save changes
        await this.page.click('button[name="SaveEdit"]');
    }

    async classifyCase(caseNumber: string, classification: CaseClassification) {
        await this.page.click('a[title="Cases"]');
        await this.page.fill('input[name="Case-search-input"]', caseNumber);
        await this.page.click(`//a[contains(text(),'${caseNumber}')]`);
        
        await this.page.click('button[name="Edit"]');
        await this.page.selectOption('select[name="Classification"]', classification);
        await this.page.click('button[name="SaveEdit"]');
    }

    async addCaseComment(caseNumber: string, comment: string) {
        await this.page.click('a[title="Cases"]');
        await this.page.fill('input[name="Case-search-input"]', caseNumber);
        await this.page.click(`//a[contains(text(),'${caseNumber}')]`);
        
        await this.page.click('button[title="Add Comment"]');
        await this.page.fill('textarea[name="CommentBody"]', comment);
        await this.page.click('button[title="Save Comment"]');
    }

    async resolveCase(caseNumber: string, resolution: string) {
        await this.page.click('a[title="Cases"]');
        await this.page.fill('input[name="Case-search-input"]', caseNumber);
        await this.page.click(`//a[contains(text(),'${caseNumber}')]`);
        
        await this.page.click('button[name="Edit"]');
        await this.page.selectOption('select[name="Status"]', 'Closed' as CaseStatus);
        await this.page.fill('textarea[name="Resolution"]', resolution);
        await this.page.click('button[name="SaveEdit"]');
    }

    async verifyCaseStatus(caseNumber: string, expectedStatus: CaseStatus): Promise<boolean> {
        await this.page.click('a[title="Cases"]');
        await this.page.fill('input[name="Case-search-input"]', caseNumber);
        await this.page.click(`//a[contains(text(),'${caseNumber}')]`);
        
        const actualStatus = await this.page.textContent('span.slds-form-element__static[field-label="Status"]');
        return actualStatus?.trim() === expectedStatus;
    }

    async getCaseNumber(): Promise<string> {
        await this.waitForPageLoad();
        const caseNumber = await this.page.textContent('span.slds-form-element__static[field-label="Case Number"]');
        return caseNumber?.trim() || '';
    }
} 