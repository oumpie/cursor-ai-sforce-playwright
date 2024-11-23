export type PolicyType = 'Life' | 'Health' | 'Property' | 'Auto' | 'Commercial';
export type PolicyStatus = 'Active' | 'Pending' | 'Cancelled' | 'Expired';
export type ClaimStatus = 'New' | 'In Review' | 'Approved' | 'Denied';
export type UnderwritingDecision = 'Approved' | 'Declined' | 'More Info Required';

export interface PolicyData {
    policyName: string;
    policyType: PolicyType;
    policyHolder: string;
    effectiveDate: string;
    expirationDate: string;
    premium: number;
    status: PolicyStatus;
    coverageAmount: number;
    deductible: number;
    underwritingStatus?: UnderwritingDecision;
}

export interface ClaimData {
    policyNumber: string;
    claimType: string;
    incidentDate: string;
    reportedDate: string;
    description: string;
    status: ClaimStatus;
    damageEstimate?: number;
    location?: string;
} 