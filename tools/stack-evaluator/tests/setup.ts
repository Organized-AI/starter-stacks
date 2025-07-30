/**
 * Test setup and configuration
 * Global test utilities and mocks
 */

import { jest } from '@jest/globals';

// Global test timeout
jest.setTimeout(10000);

// Mock console methods in tests to reduce noise
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeEach(() => {
  // Reset all mocks before each test
  jest.clearAllMocks();
  
  // Mock console.error and console.warn
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterEach(() => {
  // Restore console methods
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Global test utilities
export const testUtils = {
  /**
   * Create a mock UserAnswers object for testing
   */
  createMockUserAnswers: (overrides: Partial<any> = {}) => ({
    userId: '123e4567-e89b-12d3-a456-426614174000',
    answers: [
      { questionId: 'timeline', value: 'same-day' },
      { questionId: 'background', value: 'intermediate' },
      { questionId: 'project-type', value: 'chat-interface' },
      { questionId: 'team-size', value: 'small' },
      { questionId: 'design-priority', value: 'important' },
    ],
    completedAt: new Date(),
    ...overrides,
  }),

  /**
   * Create a mock Stack object for testing
   */
  createMockStack: (overrides: Partial<any> = {}) => ({
    id: 'test-stack',
    name: 'Test Stack',
    description: 'A test stack for unit testing',
    category: 'traditional' as const,
    components: [
      {
        name: 'Test Framework',
        category: 'framework' as const,
        description: 'Test framework component',
      },
    ],
    pros: ['Fast', 'Easy to use'],
    cons: ['Limited features'],
    bestFor: ['Testing', 'Development'],
    avoidIf: ['Production use'],
    pricing: {
      setupCost: 0,
      monthlyCost: [
        {
          name: 'Free',
          minCost: 0,
          maxCost: 0,
          includedResources: ['Basic features'],
        },
      ],
      hasFreeTier: true,
    },
    learningCurve: 'easy' as const,
    timeToProduction: '1-day' as const,
    communitySupport: 'active' as const,
    metadata: {
      lastUpdated: new Date(),
      documentation: 'good' as const,
      ecosystem: 'stable' as const,
    },
    ...overrides,
  }),

  /**
   * Create a delayed promise for testing async operations
   */
  delay: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

  /**
   * Generate a random UUID for testing
   */
  generateTestId: () => '123e4567-e89b-12d3-a456-426614174' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
};