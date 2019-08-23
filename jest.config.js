module.exports = {
  verbose: true,
  coverageReporters: [
    'json-summary',
    'json',
    'lcov',
    'text',
    'clover',
  ],
  setupFiles: [
    '<rootDir>/jest.init.js',
  ],
};
