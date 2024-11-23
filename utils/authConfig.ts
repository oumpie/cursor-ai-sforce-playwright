import { AuthConfig } from '../types/auth.types';

export const authConfig: Record<string, AuthConfig> = {
  dev: {
    clientId: process.env.DEV_CLIENT_ID || '',
    clientSecret: process.env.DEV_CLIENT_SECRET || '',
    redirectUri: process.env.DEV_REDIRECT_URI || 'http://localhost:3000/oauth/callback',
    loginUrl: process.env.DEV_URL || 'https://test.salesforce.com',
  },
  qa: {
    clientId: process.env.QA_CLIENT_ID || '',
    clientSecret: process.env.QA_CLIENT_SECRET || '',
    redirectUri: process.env.QA_REDIRECT_URI || 'http://localhost:3000/oauth/callback',
    loginUrl: process.env.QA_URL || 'https://test.salesforce.com',
  },
  uat: {
    clientId: process.env.UAT_CLIENT_ID || '',
    clientSecret: process.env.UAT_CLIENT_SECRET || '',
    redirectUri: process.env.UAT_REDIRECT_URI || 'http://localhost:3000/oauth/callback',
    loginUrl: process.env.UAT_URL || 'https://test.salesforce.com',
  }
}; 