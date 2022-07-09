import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ['<rootDir>/src/utils/setup-jest.ts'],
  moduleNameMapper: {
    "\\.(css|less)$": "<rootDir>/src/mocks/mockStyles.ts"
  },
  transform: {
    "node_modules/(react-dnd|dnd-core|@react-dnd)/.+\\.(j|t)sx?$": "ts-jest",
    "^.+\\.js$": "babel-jest",
  },
  transformIgnorePatterns: [`/node_modules/(?!(somePkg)|react-dnd|dnd-core|@react-dnd)`],
};

export default config;
