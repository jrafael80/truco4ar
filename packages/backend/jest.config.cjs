module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/__tests__/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapper: {
    '^@truco4ar/shared$': '<rootDir>/../shared/src/index.ts',
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      useESM: true,
    }]
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  setupFiles: ['<rootDir>/jest.setup.js']
};
