export class DataManager {
    private static instance: DataManager;
    private testData: Map<string, any> = new Map();
    private cleanupTasks: Map<string, (() => Promise<void>)[]> = new Map();

    private constructor() {}

    static getInstance(): DataManager {
        if (!this.instance) {
            this.instance = new DataManager();
        }
        return this.instance;
    }

    async setData(testId: string, data: any): Promise<void> {
        this.testData.set(testId, data);
    }

    getData<T>(testId: string): T | undefined {
        return this.testData.get(testId) as T;
    }

    async registerCleanupTask(testId: string, task: () => Promise<void>): Promise<void> {
        const tasks = this.cleanupTasks.get(testId) || [];
        tasks.push(task);
        this.cleanupTasks.set(testId, tasks);
    }

    async cleanup(testId: string): Promise<void> {
        const tasks = this.cleanupTasks.get(testId) || [];
        for (const task of tasks) {
            await task();
        }
        this.cleanupTasks.delete(testId);
        this.testData.delete(testId);
    }
} 