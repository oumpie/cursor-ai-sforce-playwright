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
        super(message);
        this.name = 'ApiError';
    }
} 