const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const baseConfig = require('./webpack.config');
const config = {
  output: {
    filename: 'bundle.js',
    chunkFilename: '[id].js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    inline: true,
    hot: true,
    open: true,
    port: 8080,
    historyApiFallback: true,
    noInfo: true,
    contentBase: path.join(__dirname, 'dist'),
    proxy: {
      '/res': {
        // target: 'http://h5.uhuibao.net/',
        target: 'http://192.168.9.53:86/',
        changeOrigin: true,
        pathRewrite: {
          '^/res' : '/res'
        }
      },
      '/mock': {
        target: 'http://localhost:3001/',
        changeOrigin: true,
        pathRewrite: {
          '^/mock' : '/'
        }
      }
    }
  },
  devtool: 'eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    }),
    new StyleLintPlugin({
      syntax: 'scss',
      files: ['**/*.styl']
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor'],
      filename: '[name].bundle.js'
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, 'src/index.html')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
};

module.exports = webpackMerge(baseConfig, config);
