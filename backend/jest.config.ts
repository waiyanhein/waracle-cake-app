import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  testEnvironment: 'node',
  rootDir: '.',
  // testMatch: ['<rootDir>/test/**/*.test.ts'],
  // moduleDirectories: ['node_modules', 'src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  preset: 'ts-jest',
  coveragePathIgnorePatterns: ['node_modules'],
  // setupFilesAfterEnv: ['jest-expect-message']
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json' // ✅ use the test config
    }
  }
};
export default config;