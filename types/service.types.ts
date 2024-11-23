export type CasePriority = 'High' | 'Medium' | 'Low';
export type CaseStatus = 'New' | 'In Progress' | 'On Hold' | 'Closed';
export type CaseOrigin = 'Phone' | 'Email' | 'Web' | 'Chat';
export type CaseType = 'Problem' | 'Feature Request' | 'Question';
export type CaseClassification = 'Technical Issue' | 'User Error' | 'Enhancement' | 'Documentation';

export interface CaseData {
    contactName: string;
    subject: string;
    status: CaseStatus;
    priority: CasePriority;
    origin: CaseOrigin;
    type: CaseType;
    description: string;
    classification: CaseClassification;
    region: string;
    country: string;
    countryCode: string;
}

export interface CaseComment {
    body: string;
    isPublic?: boolean;
} 