module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // updated extension
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json', // or 'tsconfig.test.json' if you use a separate one
        },
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};