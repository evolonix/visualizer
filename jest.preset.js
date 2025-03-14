const nxPreset = require('@nx/jest/preset').default;

const isDefinedEnv = !!process.env.NODE_ENV;
const isTestEnv = process.env.NODE_ENV === 'test';
const jestNodeError = `Warning! Jest NODE_ENV should be 'test': current ${process.env.NODE_ENV} !== 'test'`;

if (!isDefinedEnv) process.env.NODE_ENV = 'test';
else if (!isTestEnv) console.log(jestNodeError);

module.exports = {
  ...nxPreset,
  /* TODO: Update to latest Jest snapshotFormat
   * By default Nx has kept the older style of Jest Snapshot formats
   * to prevent breaking of any existing tests with snapshots.
   * It's recommend you update to the latest format.
   * You can do this by removing snapshotFormat property
   * and running tests with --update-snapshot flag.
   * Example: "nx affected --targets=test --update-snapshot"
   * More info: https://jestjs.io/docs/upgrading-to-jest29#snapshot-format
   */
  snapshotFormat: { escapeString: true, printBasicPrototype: true },
};
