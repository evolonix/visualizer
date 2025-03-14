module.exports = (config, _, targetOptions) => {
  const { configuration } = targetOptions;

  if (configuration.includes('production')) {
    setupLazyChunkHashing(config, {
      eagerChunkPrefixes: [],
    });
  }

  return config;
};

/**
 * In a typical Angular SPA, the index.html for the app is generated with the build,
 * and chunk hashes (calculated at build time) may be included in the file names
 * and then injected into the transformed index. Those content hashes serve as a handy
 * cache-busting mechanism, as change in a module source will naturally result in a
 * new hash for the resulting bundle.
 *
 * In the Degreed SPAs, initial and eager chunks are injected by the
 * Razor page. This means that the file names are static,
 * and cache-busting is instead handled by a query string parameter returned from a call
 * to `Url.BlobContent`.
 *
 * As of Angular 12, there is not a config option to do output hashing for_only_ the lazy
 * loaded chunks {@link https://github.com/angular/angular-cli/issues/7431}. However, in
 * Webpack 5, a function may be passed to `config.output.chunkFilename` to conditionally
 * set the filename template to be used for a chunk, including whether a chunk hash should
 * be included.
 *
 * @param {import('webpack').Configuration} config
 * @param {object}   options
 * @param {string[]} options.eagerChunkPrefixes Name prefixes for 'lazy' chunks which will
 *                                              be eager loaded, and must not include a
 *                                              chunk hash
 * @returns {void}
 */
function setupLazyChunkHashing(config, options) {
  const { eagerChunkPrefixes } = options;
  const eagerFormat = config.output.filename;
  // Add content hash as suffix to base filename template to support Angular differential loading
  const hashFormat = eagerFormat.replace('.js', '.[contenthash:8].js');

  config.output.chunkFilename = (data) => {
    const chunkId = data.chunk.id;
    if (eagerChunkPrefixes.some((id) => chunkId.startsWith(id))) {
      return eagerFormat;
    }

    return hashFormat;
  };
}
