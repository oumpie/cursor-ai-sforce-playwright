import { faker } from '@faker-js/faker';
import { CaseData, CaseStatus, CasePriority, CaseOrigin, CaseType, CaseClassification } from '../types/service.types';
import { CountryCode, CountryMapping } from '../types/region.types';
import { PolicyData, ClaimData, PolicyStatus, ClaimStatus } from '../types/insurance.types';
import { LeadData, LeadStatus } from '../types/lead.types';

export interface AccountData {
    name: string;
    type?: 'Customer' | 'Partner' | 'Prospect';
    industry?: string;
    rating?: 'Hot' | 'Warm' | 'Cold';
    phone?: string;
    website?: string;
    description?: string;
    billingAddress?: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    annualRevenue?: number;
    employees?: number;
    ownership?: 'Public' | 'Private' | 'Subsidiary';
}

// Define industry types to match Salesforce picklist values
const INDUSTRY_TYPES = [
    'Technology',
    'Financial Services',
    'Healthcare',
    'Manufacturing',
    'Retail',
    'Education',
    'Government',
    'Other'
] as const;

export class DataGenerator {
    private static readonly INDUSTRY_TYPES = INDUSTRY_TYPES;
    
    private static formatPhoneNumber(phone: string): string {
        // Remove any non-numeric characters
        const cleaned = phone.replace(/\D/g, '');
        
        // Format based on length (assuming standard formats)
        if (cleaned.length === 10) {
            return `+1 (${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
        } else if (cleaned.length === 11) {
            return `+${cleaned.slice(0,1)} (${cleaned.slice(1,4)}) ${cleaned.slice(4,7)}-${cleaned.slice(7)}`;
        }
        
        // Return original if doesn't match expected formats
        return phone;
    }

    static generateAccountData(region?: string): AccountData {
        const account: AccountData = {
            name: `${faker.company.name()} ${faker.string.alphanumeric(5)}`,
            type: faker.helpers.arrayElement(['Customer', 'Partner', 'Prospect']),
            industry: faker.helpers.arrayElement(this.INDUSTRY_TYPES),
            rating: faker.helpers.arrayElement(['Hot', 'Warm', 'Cold']),
            phone: this.formatPhoneNumber(faker.phone.number()),
            website: faker.internet.url(),
            description: faker.company.catchPhrase(),
            billingAddress: {
                street: faker.location.streetAddress(),
                city: faker.location.city(),
                state: faker.location.state(),
                postalCode: faker.location.zipCode(),
                country: region ? region : 'United States'
            },
            annualRevenue: faker.number.int({ min: 100000, max: 10000000 }),
            employees: faker.number.int({ min: 10, max: 10000 }),
            ownership: faker.helpers.arrayElement(['Public', 'Private', 'Subsidiary'])
        };

        return account;
    }

    static generateRegionalAccountData(countryCode: CountryCode): AccountData {
        const account = this.generateAccountData();
        const country = CountryMapping[countryCode];
        
        if (!country) {
            throw new Error(`Invalid country code: ${countryCode}`);
        }

        // Add regional specific data
        account.billingAddress = {
            street: faker.location.streetAddress(),
            city: this.getRegionalCity(countryCode),
            state: this.getRegionalState(countryCode),
            postalCode: faker.location.zipCode(),
            country: country.name
        };

        // Apply country-specific phone formatting
        account.phone = this.formatRegionalPhoneNumber(
            faker.phone.number(),
            countryCode
        );
        
        return account;
    }

    private static getRegionalCity(countryCode: CountryCode): string {
        const cityMap: Record<CountryCode, string[]> = {
            'KE': ['Nairobi', 'Mombasa', 'Kisumu'],
            'GH': ['Accra', 'Kumasi', 'Tamale'],
            'ZA': ['Johannesburg', 'Cape Town', 'Durban'],
            'NA': ['Windhoek', 'Walvis Bay', 'Swakopmund'],
            TZ: [],
            ZW: [],
            LS: [],
            BW: [],
            ZM: [],
            MW: [],
            SZ: [],
            AO: []
        };

        return faker.helpers.arrayElement(cityMap[countryCode] || ['Unknown City']);
    }

    private static getRegionalState(countryCode: CountryCode): string {
        const stateMap: Record<CountryCode, string[]> = {
            'KE': ['Nairobi', 'Coast', 'Nyanza'],
            'GH': ['Greater Accra', 'Ashanti', 'Northern'],
            'ZA': ['Gauteng', 'Western Cape', 'KwaZulu-Natal'],
            'NA': ['Khomas', 'Erongo', 'Oshana'],
            TZ: [],
            ZW: [],
            LS: [],
            BW: [],
            ZM: [],
            MW: [],
            SZ: [],
            AO: []
        };

        return faker.helpers.arrayElement(stateMap[countryCode] || ['Unknown State']);
    }

    private static formatRegionalPhoneNumber(phone: string, countryCode: CountryCode): string {
        const countryFormats: Record<CountryCode, string> = {
            'KE': '+254',  // Kenya
            'GH': '+233',  // Ghana
            'ZA': '+27',   // South Africa
            'NA': '+264',  // Namibia
            // Add other country codes as needed
        };

        const prefix = countryFormats[countryCode] || '+1';
        const cleaned = phone.replace(/\D/g, '').slice(-9);
        return `${prefix} ${cleaned.slice(0,3)} ${cleaned.slice(3,6)} ${cleaned.slice(6)}`;
    }

    static generateInsurancePolicyData(): PolicyData {
        const effectiveDate = new Date();
        const expirationDate = new Date();
        expirationDate.setFullYear(effectiveDate.getFullYear() + 1);

        return {
            policyName: `Policy - ${faker.company.name()}`,
            policyType: 'Life',
            policyHolder: 'Luke Kettle',
            effectiveDate: effectiveDate.toISOString().split('T')[0],
            expirationDate: expirationDate.toISOString().split('T')[0],
            premium: faker.number.int({ min: 1000, max: 5000 }),
            status: 'Active',
            coverageAmount: faker.number.int({ min: 100000, max: 1000000 }),
            deductible: faker.number.int({ min: 500, max: 2000 }),
            underwritingStatus: 'Approved'
        };
    }

    static generateCaseData(): CaseData {
        return {
            contactName: 'Luke Kettle',
            subject: `Support Request - ${this.generateDescription()}`,
            status: 'New' as CaseStatus,
            priority: 'Medium' as CasePriority,
            origin: 'Phone' as CaseOrigin,
            type: 'Problem' as CaseType,
            description: this.generateDescription(),
            classification: 'Technical Issue' as CaseClassification,
            region: 'EA',
            country: 'Kenya',
            countryCode: 'KE'
        };
    }

    /**
     * Generates regional case data with proper country-specific formatting
     * @param countryCode - The country code for regional context
     */
    static generateRegionalCaseData(countryCode: CountryCode): CaseData {
        const country = CountryMapping[countryCode];
        const prefix = country.prefix;

        return {
            contactName: this.generateRegionalContactName(prefix),
            subject: this.generateRegionalSubject(prefix),
            status: 'New' as CaseStatus,
            priority: 'Medium' as CasePriority,
            origin: 'Phone' as CaseOrigin,
            type: 'Problem' as CaseType,
            description: faker.lorem.paragraph(),
            classification: 'Technical Issue' as CaseClassification,
            region: country.region,
            country: country.name,
            countryCode
        };
    }

    private static generateRegionalContactName(prefix: string): string {
        return `${prefix}-Agent`;
    }

    private static generateRegionalSubject(prefix: string): string {
        return `${prefix}-Support Request - ${faker.commerce.productName()}`;
    }

    static generateCompanyName(): string {
        return faker.company.name();
    }

    static generatePhoneNumber(): string {
        return faker.phone.number();
    }

    static generateWebsite(): string {
        return faker.internet.url();
    }

    static generateDescription(): string {
        return faker.company.catchPhrase();
    }

    static generateAddress() {
        return {
            street: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            zipCode: faker.location.zipCode(),
            country: 'United States'
        };
    }

    static generateClaimData(): Omit<ClaimData, 'policyNumber'> {
        const incidentDate = new Date();
        incidentDate.setDate(incidentDate.getDate() - 5);

        return {
            claimType: 'Accident',
            incidentDate: incidentDate.toISOString().split('T')[0],
            reportedDate: new Date().toISOString().split('T')[0],
            description: faker.lorem.paragraph(),
            status: 'New' as ClaimStatus,
            damageEstimate: faker.number.int({ min: 1000, max: 50000 }),
            location: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state()}`
        };
    }

    static generateLeadData(): LeadData {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        
        return {
            salutation: 'Mr.',
            firstName,
            lastName,
            company: `${faker.company.name()} Corp`,
            email: faker.internet.email({ firstName, lastName }),
            phone: faker.phone.number(),
            leadSource: 'LookSee App' as LeadSource,
            rating: 'Hot' as LeadRating,
            industry: 'Technology',
            street: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            postalCode: faker.location.zipCode(),
            country: 'United States',
            status: 'Open - Not Contacted' as LeadStatus
        };
    }

    static generateOpportunityData(accountName: string) {
        const closeDate = new Date();
        closeDate.setMonth(closeDate.getMonth() + 3);

        return {
            name: `Opportunity - ${faker.company.catchPhrase()}`,
            accountName,
            amount: faker.number.int({ min: 10000, max: 1000000 }).toString(),
            closeDate: closeDate.toISOString().split('T')[0],
            stage: 'Prospecting'
        };
    }

    // Helper method for generating company-related data
    static generateCompanyMetadata() {
        return {
            registrationNumber: faker.string.alphanumeric(8).toUpperCase(),
            taxId: faker.string.alphanumeric(10).toUpperCase(),
            foundedYear: faker.date.past({ years: 30 }).getFullYear(),
            marketSegment: faker.helpers.arrayElement([
                'Enterprise',
                'Mid-Market',
                'SMB'
            ]),
            businessType: faker.helpers.arrayElement([
                'Corporation',
                'LLC',
                'Partnership',
                'Sole Proprietorship'
            ])
        };
    }

    // ... other methods ...
} 