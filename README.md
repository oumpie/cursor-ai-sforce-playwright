# Salesforce E2E Testing Framework with Playwright

## Overview
A comprehensive end-to-end testing framework built with Playwright for Salesforce applications. Designed to support multiple environments and regional operations across Africa, with built-in utilities for authentication, data management, reporting, and AI-powered testing capabilities.

## Project Structure
```
├── ai/
│   ├── config/
│   │   └── aiConfig.ts
│   ├── models/
│   │   ├── gpt4.service.ts
│   │   ├── langchain.service.ts
│   │   └── gemini.service.ts
│   └── utils/
│       └── aiHelper.ts
├── config/
│   ├── environment.config.ts
│   └── testConfig.ts
├── pages/
│   ├── base/
│   │   └── BasePage.ts
│   └── common/
│       └── LoginPage.ts
├── tests/
│   ├── example/
│   │   └── regionalTest.spec.ts
│   └── sales/
│       └── createLead.spec.ts
├── types/
│   ├── lead.types.ts
│   └── region.types.ts
├── utils/
│   ├── dataGenerator.ts
│   ├── dataManager.ts
│   ├── testHelper.ts
│   ├── regionalContext.ts
│   └── errors/
│       ├── index.ts
│       └── TestError.ts
└── services/
    └── AuthService.ts
```

## Playwright is divided into 3 parts

- Navigate 	<Go to the page to test> 
- Take action <Do something on the page> 
- Check the results of the action <See if it worked as expected> 

## Core Features

### Regional Testing
- Multi-region support (EA, WA, ROA, SA)
- Region-specific configurations
- Regional user context management
- Localized data handling

### Error Management
- Structured error handling
- Custom error types for different scenarios
- Automatic error context capture
- Screenshot generation on failure

### Test Data Management
- Singleton pattern for global state
- Automated cleanup mechanisms
- Region-aware data generation
- Test isolation guarantees

### AI Integration
- GPT-4 for test script generation
- LangChain for workflow automation
- Gemini for UI validation
- HuggingFace for log analysis

## Configuration

### Environment Setup
```bash
# Required environment variables
SALESFORCE_USERNAME=your-username
SALESFORCE_PASSWORD=your-password
TEST_ENV=dev|qa|uat
TEST_REGION=EA|WA|ROA|SA
```

### Test Configuration
```typescript
// testConfig.ts
{
  retryOptions: {
    maxAttempts: 3,
    delayMs: 1000
  },
  timeouts: {
    defaultTimeout: 30000,
    navigationTimeout: 60000
  },
  reporting: {
    screenshotOnFailure: true,
    traceOnFailure: true
  }
}
```

## Usage Examples

### Regional Test
```typescript
test.describe('Regional Test Example', () => {
    const testFlow = new TestDataFlow();
    
    test('should handle regional scenario', async ({ browser }) => {
        const { page } = await RegionalTestFlow.setupRegionalTest(browser, 'EA');
        // Test implementation
    });
});
```

### Error Handling
```typescript
try {
    await testOperation();
} catch (error) {
    await ErrorHandler.handleTestError(error, {
        testId,
        action: 'Operation Name'
    });
}
```

## Best Practices

### Test Structure
- Use Page Object Model
- Implement proper error handling
- Follow regional testing guidelines
- Maintain test data isolation

### Error Handling
- Use custom error types
- Include context in errors
- Implement retry mechanisms
- Capture diagnostic data

### Regional Testing
- Use regional context manager
- Handle timezone differences
- Consider locale-specific data
- Validate regional requirements

## Contributing
1. Fork the repository
2. Create feature branch
3. Implement changes following project structure
4. Add tests and documentation
5. Submit pull request

## Support
- Technical Issues: [tech-support@example.com]
- Regional Support: [regional-support@example.com]

## License
MIT License
