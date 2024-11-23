export type AfricanRegion = 'EA' | 'WA' | 'ROA' | 'SA'; // East Africa, West Africa, Rest of Africa, South Africa

export type CountryCode = 
    | 'KE'                // East Africa
    | 'GH'                // West Africa
    | 'ZA'                // South Africa (separate)
    | 'NA' | 'TZ' | 'ZW'  // ROA countries
    | 'LS' | 'BW' | 'ZM'  // More ROA countries
    | 'MW' | 'SZ' | 'AO'; // Additional ROA countries

export interface RegionUser {
    username: string;
    countryCode: CountryCode;
    region: AfricanRegion;
    profile: 'SVC Agent Banker';
}

export const CountryMapping: Record<CountryCode, { 
    name: string;
    region: AfricanRegion;
    prefix: string;
    priority: 'primary' | 'secondary';
}> = {
    // Primary Market - East Africa
    'KE': {
        name: 'Kenya',
        region: 'EA',
        prefix: 'KE-EA',
        priority: 'primary'
    },
    
    // Primary Market - West Africa
    'GH': {
        name: 'Ghana',
        region: 'WA',
        prefix: 'GH-WA',
        priority: 'primary'
    },

    // South Africa (Separate Region)
    'ZA': {
        name: 'South Africa',
        region: 'SA',
        prefix: 'ZA-SA',
        priority: 'primary'
    },

    // Rest of Africa Countries
    'NA': {
        name: 'Namibia',
        region: 'ROA',
        prefix: 'NA-ROA',
        priority: 'secondary'
    },
    'TZ': {
        name: 'Tanzania',
        region: 'ROA',
        prefix: 'TZ-ROA',
        priority: 'secondary'
    },
    'ZW': {
        name: 'Zimbabwe',
        region: 'ROA',
        prefix: 'ZW-ROA',
        priority: 'secondary'
    },
    'LS': {
        name: 'Lesotho',
        region: 'ROA',
        prefix: 'LS-ROA',
        priority: 'secondary'
    },
    'BW': {
        name: 'Botswana',
        region: 'ROA',
        prefix: 'BW-ROA',
        priority: 'secondary'
    },
    'ZM': {
        name: 'Zambia',
        region: 'ROA',
        prefix: 'ZM-ROA',
        priority: 'secondary'
    },
    'MW': {
        name: 'Malawi',
        region: 'ROA',
        prefix: 'MW-ROA',
        priority: 'secondary'
    },
    'SZ': {
        name: 'Eswatini',
        region: 'ROA',
        prefix: 'SZ-ROA',
        priority: 'secondary'
    },
    'AO': {
        name: 'Angola',
        region: 'ROA',
        prefix: 'AO-ROA',
        priority: 'secondary'
    }
};

// Helper functions for region management
export const RegionHelpers = {
    isPrimaryMarket(countryCode: CountryCode): boolean {
        return CountryMapping[countryCode].priority === 'primary';
    },

    getCountriesByRegion(region: AfricanRegion): CountryCode[] {
        return Object.entries(CountryMapping)
            .filter(([_, data]) => data.region === region)
            .map(([code]) => code as CountryCode);
    },

    getPrimaryMarkets(): CountryCode[] {
        return Object.entries(CountryMapping)
            .filter(([_, data]) => data.priority === 'primary')
            .map(([code]) => code as CountryCode);
    },

    getROACountries(): CountryCode[] {
        return Object.entries(CountryMapping)
            .filter(([_, data]) => data.region === 'ROA')
            .map(([code]) => code as CountryCode);
    },

    isROACountry(countryCode: CountryCode): boolean {
        return CountryMapping[countryCode].region === 'ROA';
    },

    isSouthAfrica(countryCode: CountryCode): boolean {
        return countryCode === 'ZA';
    }
};

export interface RegionalContext {
    countryCode: string;
    locale: string;
    timezone: string;
    currency: string;
    dateFormat: string;
    numberFormat: string;
}

export const RegionalDefaults: Record<string, RegionalContext> = {
    EA: {
        countryCode: 'KE',
        locale: 'en-KE',
        timezone: 'Africa/Nairobi',
        currency: 'KES',
        dateFormat: 'DD/MM/YYYY',
        numberFormat: '#,##0.00'
    }
    // Add other regions...
}; 