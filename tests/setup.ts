import { jest } from '@jest/globals';

// Global test setup
beforeAll(() => {
  // Set up any global test environment
  jest.clearAllMocks();
});

afterEach(() => {
  // Clean up after each test
  jest.clearAllMocks();
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
