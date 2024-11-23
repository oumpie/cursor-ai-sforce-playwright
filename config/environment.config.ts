export const environments = {
    dev: {
        baseUrl: 'https://dev.salesforce.com',
        apiVersion: '54.0'
    },
    qa: {
        baseUrl: 'https://qa.salesforce.com',
        apiVersion: '54.0'
    },
    uat: {
        baseUrl: 'https://uat.salesforce.com',
        apiVersion: '54.0'
    }
} as const;

export type Environment = keyof typeof environments; 