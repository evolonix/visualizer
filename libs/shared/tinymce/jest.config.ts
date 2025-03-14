/* eslint-disable */
export default {
  displayName: 'lib-shared-tinymce',
  preset: '../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
    'node_modules/@ephox/.*\\.(js)$': 'ts-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!@ephox/.*)'],
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/libs/shared/tinymce',
};
