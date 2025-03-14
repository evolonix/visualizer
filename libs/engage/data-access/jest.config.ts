/* eslint-disable */
export default {
  displayName: 'lib-engage-data-access',
  preset: '../../../jest.preset.js',
  setupFilesAfterEnv: ['./src/jest-setup.ts'],
  globals: {},
  coverageDirectory: '../../../coverage/libs/engage/data-access',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: [`<rootDir>/node_modules/(?!@angular|@ngneat|array-move|lodash-es)`],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};
