import { TestError } from './TestError';

export class RegionalError extends TestError {
    constructor(
        message: string,
        public readonly regionalContext: {
            region: string;
            country: string;
            operation: string;
        }
    ) {
        super(message);
        this.name = 'RegionalError';
    }
} 