export interface TestConfig {
    retryOptions: {
        maxAttempts: number;
        delayMs: number;
    };
    timeouts: {
        defaultTimeout: number;
        navigationTimeout: number;
        apiTimeout: number;
    };
    reporting: {
        screenshotOnFailure: boolean;
        traceOnFailure: boolean;
        videoOnFailure: boolean;
    };
    regional: {
        defaultRegion: string;
        defaultCountry: string;
    };
}

export const testConfig: TestConfig = {
    retryOptions: {
        maxAttempts: 3,
        delayMs: 1000
    },
    timeouts: {
        defaultTimeout: 30000,
        navigationTimeout: 60000,
        apiTimeout: 30000
    },
    reporting: {
        screenshotOnFailure: true,
        traceOnFailure: true,
        videoOnFailure: true
    },
    regional: {
        defaultRegion: 'EA',
        defaultCountry: 'KE'
    }
}; 