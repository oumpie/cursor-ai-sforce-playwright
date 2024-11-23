import { TestError } from './TestError';

export class ValidationError extends TestError {
    constructor(
        message: string,
        public readonly validationContext: {
            field: string;
            expectedValue: any;
            actualValue: any;
        }
    ) {
        super(message);
        this.name = 'ValidationError';
    }
} 