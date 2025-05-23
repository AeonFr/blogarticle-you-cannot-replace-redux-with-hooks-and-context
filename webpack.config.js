module.exports = {
  module: {
    rules: {
      test: /\.mdx$/,
      use: [
        "babel-loader",
        {
          loader: require.resolve('@mdx-js/loader'),
        },
      ],
    }
  },
};
