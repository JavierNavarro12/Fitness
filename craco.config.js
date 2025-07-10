module.exports = {
  webpack: {
    configure: webpackConfig => {
      // Ignorar warnings de source maps faltantes
      webpackConfig.ignoreWarnings = [
        ...(webpackConfig.ignoreWarnings || []),
        /Failed to parse source map/,
        /ENOENT: no such file or directory/,
      ];

      return webpackConfig;
    },
  },
};
