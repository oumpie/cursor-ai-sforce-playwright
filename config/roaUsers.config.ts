import { CountryCode, CountryMapping } from '../types/region.types';

export interface ROAUserConfig {
    username: string;
    profile: string;
    country: CountryCode;
    permissions: string[];
}

export const roaUsersConfig: Record<CountryCode, ROAUserConfig[]> = {
    'KE': [{
        username: 'KE-EA.agent@looksee.com',
        profile: 'SVC Agent Banker',
        country: 'KE',
        permissions: ['Create_Case', 'Edit_Case', 'View_Case']
    }],
    'NA': [{
        username: 'NA-ROA.agent@looksee.com',
        profile: 'SVC Agent Banker',
        country: 'NA',
        permissions: ['Create_Case', 'Edit_Case', 'View_Case']
    }],
    'TZ': [{
        username: 'TZ-ROA.agent@looksee.com',
        profile: 'SVC Agent Banker',
        country: 'TZ',
        permissions: ['Create_Case', 'Edit_Case', 'View_Case']
    }],
    'ZW': [{
        username: 'ZW-ROA.agent@looksee.com',
        profile: 'SVC Agent Banker',
        country: 'ZW',
        permissions: ['Create_Case', 'Edit_Case', 'View_Case']
    }],
    'LS': [{
        username: 'LS-ROA.agent@looksee.com',
        profile: 'SVC Agent Banker',
        country: 'LS',
        permissions: ['Create_Case', 'Edit_Case', 'View_Case']
    }],
    'BW': [{
        username: 'BW-ROA.agent@looksee.com',
        profile: 'SVC Agent Banker',
        country: 'BW',
        permissions: ['Create_Case', 'Edit_Case', 'View_Case']
    }],
    'ZM': [{
        username: 'ZM-ROA.agent@looksee.com',
        profile: 'SVC Agent Banker',
        country: 'ZM',
        permissions: ['Create_Case', 'Edit_Case', 'View_Case']
    }],
    'MW': [{
        username: 'MW-ROA.agent@looksee.com',
        profile: 'SVC Agent Banker',
        country: 'MW',
        permissions: ['Create_Case', 'Edit_Case', 'View_Case']
    }],
    'SZ': [{
        username: 'SZ-ROA.agent@looksee.com',
        profile: 'SVC Agent Banker',
        country: 'SZ',
        permissions: ['Create_Case', 'Edit_Case', 'View_Case']
    }],
    'AO': [{
        username: 'AO-ROA.agent@looksee.com',
        profile: 'SVC Agent Banker',
        country: 'AO',
        permissions: ['Create_Case', 'Edit_Case', 'View_Case']
    }],
    'GH': [{
        username: 'GH-WA.agent@looksee.com',
        profile: 'SVC Agent Banker',
        country: 'GH',
        permissions: ['Create_Case', 'Edit_Case', 'View_Case']
    }],
    'ZA': [{
        username: 'ZA-SA.agent@looksee.com',
        profile: 'SVC Agent Banker',
        country: 'ZA',
        permissions: ['Create_Case', 'Edit_Case', 'View_Case']
    }]
}; 