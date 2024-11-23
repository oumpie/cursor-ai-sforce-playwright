export interface LeadData {
    firstName: string;
    lastName: string;
    company: string;
    email: string;
    phone?: string;
    status?: string;
    source?: string;
    industry?: string;
}

export enum LeadStatus {
    NEW = 'New',
    CONTACTED = 'Contacted',
    QUALIFIED = 'Qualified',
    UNQUALIFIED = 'Unqualified'
} 