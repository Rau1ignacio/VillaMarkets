
export default {
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { configFile: './babel.config.js' }],
  },
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.cjs',
    '\\.(gif|ttf|eot|svg|png|jpg|jpeg|avif)$': '<rootDir>/__mocks__/fileMock.cjs'
  },
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/jest.setup.cjs'],
};
