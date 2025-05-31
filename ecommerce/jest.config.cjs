/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom', // Simulate browser environment for React testing
    transform: {
        '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest', // Use babel-jest to transform JS/TS files
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS imports for tests
        '^@/(.*)$': '<rootDir>/src/$1', // Path alias for src/
        '^~/(.*)$': '<rootDir>/src/$1', // Alternative alias, e.g., Vite style
        '^firebaseConfig$': '<rootDir>/__mocks__/firebaseConfig.ts', // Mock firebaseConfig module
    },
    setupFiles: ['<rootDir>/jest.env.js'], // Load env variables before tests
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Setup RTL or custom test utilities
    testMatch: ['**/__tests__/**/*.(ts|tsx|js|jsx)'], // Test file patterns
    transformIgnorePatterns: [
        'node_modules/(?!(firebase|@firebase)/)', // Transpile Firebase SDK packages
    ],
};