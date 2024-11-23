import { TestError } from './TestError';

export class ApiError extends TestError {
    constructor(
        message: string,
        public readonly apiContext: {
            endpoint: string;
            method: string;
            statusCode: number;
            response?: any;
        }
    ) {
        super(message, { action: 'API Call' });
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}

export class ValidationError extends TestError {
    constructor(
        message: string,
        public readonly validationContext: {
            field: string;
            expectedValue: any;
            actualValue: any;
        }
    ) {
        super(message, { action: 'Validation' });
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

export class RegionalError extends TestError {
    constructor(
        message: string,
        public readonly regionalContext: {
            region: string;
            country: string;
            operation: string;
        }
    ) {
        super(message, { action: 'Regional Operation' });
        Object.setPrototypeOf(this, RegionalError.prototype);
    }
}

export { TestError }; 