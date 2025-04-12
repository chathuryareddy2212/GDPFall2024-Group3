module.exports = {
    testEnvironment: 'node',
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest',
    },
    testMatch: ['**/__tests__/**/*.test.js'],
  };
  