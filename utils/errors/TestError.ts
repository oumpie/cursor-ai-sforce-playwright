export class TestError extends Error {
    constructor(
        message: string,
        public readonly context?: {
            page?: string;
            action?: string;
            selector?: string;
            screenshot?: string;
            error?: string;
        }
    ) {
        super(message);
        this.name = 'TestError';
        Object.setPrototypeOf(this, TestError.prototype);
    }
} 