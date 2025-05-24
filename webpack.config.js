const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('@module-federation/enhanced/webpack');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    publicPath: 'auto'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ["@babel/preset-env", { "targets": { "browsers": "last 2 versions" } }],
              ["@babel/preset-react", { "runtime": "automatic" }],
              "@babel/preset-typescript"
            ],
            plugins: ["@vanilla-extract/babel-plugin"]
          }
        }
      },
      {
        test: /\.mdx?$/,
        use: [
          'babel-loader',
          '@mdx-js/loader'
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html'
    }),
    new ModuleFederationPlugin({
      name: 'youcantreplacereduxwithcontext',
      filename: 'remoteEntry.[contenthash].js',
      exposes: {
        '.': './src/index.microfrontend.tsx',
      },
      shared: {
        react: {
          singleton: true,
        },
        'react-dom': {
          singleton: true,
        },
      },
      dts: false,
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.mdx'],
    alias: {
      components: path.resolve(__dirname, 'components'),
      styles: path.resolve(__dirname, 'styles'),
      utils: path.resolve(__dirname, 'utils')
    }
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
    hot: true,
  }
};
