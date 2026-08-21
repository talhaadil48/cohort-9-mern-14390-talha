/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js"
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
          module: "CommonJS",
          moduleResolution: "node",
          target: "ES2020",
          allowSyntheticDefaultImports: true,
          esModuleInterop: true,
          strict: false,
          skipLibCheck: true,
          allowArbitraryExtensions: true,
          types: ["node", "jest", "@testing-library/jest-dom", "vite/client"]
        }
      }
    ]
  }
};
