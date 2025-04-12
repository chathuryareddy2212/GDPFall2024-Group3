module.exports = {
    preset: 'jest-expo',
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
    transformIgnorePatterns: [
      'node_modules/(?!(@react-native|react-native|expo(nent)?|@expo(nent)?|react-native-reanimated|react-native-svg|native-base|@react-navigation|@unimodules|expo-modules-core)/)'
    ],
  };
  