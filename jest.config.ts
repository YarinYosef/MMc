import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^uuid$': '<rootDir>/src/__mocks__/uuid.ts',
    '^d3$': '<rootDir>/src/__mocks__/d3.ts',
    '^d3-(.*)$': '<rootDir>/src/__mocks__/d3.ts',
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/e2e/',
    '/__tests__/.*/helpers\\.ts$',
  ],
  transformIgnorePatterns: ['node_modules/(?!(uuid)/)'],
  coverageProvider: 'v8',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app/layout.tsx',
    '!src/app/favicon.ico',
  ],
};

export default createJestConfig(config);
