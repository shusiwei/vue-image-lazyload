const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.config');

const output = {
  filename: 'bundle.[hash:8].js',
  chunkFilename: '[id].[chunkhash:8].js'
};
switch (process.env.NODE_ENV) {
  case 'debug' :
    output.path = path.resolve(__dirname, './dist');
    output.publicPath = '//js.uhuibao.cn/project/h5_uhuibao/v2/dist/';
    break;

  case 'test' :
    output.path = path.resolve(__dirname, './build/test/dist');
    output.publicPath = '//jstest.uhuibao.net/project/h5_uhuibao/v2/dist/';
    break;

  case 'rctest' :
    output.path = path.resolve(__dirname, './build/rctest/dist');
    output.publicPath = '//jstest.uhuibao.com/project/h5_uhuibao/v2/dist/';
    break;

  case 'release' :
    output.path = path.resolve(__dirname, './build/release/dist');
    output.publicPath = '//js.uhuibao.com/project/h5_uhuibao/v2/dist/';
    break;

  case 'tw_release' :
    output.path = path.resolve(__dirname, './build/tw_release/dist');
    output.publicPath = '//jstw.uhuibao.com/project/h5_uhuibao/v2/dist/';
    break;
};

const config = {
  output,
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor'],
      filename: '[name].bundle.[hash:8].js'
    }),
    new HtmlWebpackPlugin({
      inject: true,
      filename: process.env.NODE_ENV === 'debug' ? 'index.php' : '../php/index.php',
      template: path.resolve(__dirname, 'src/index.php')
    })
  ]
};

module.exports = webpackMerge(baseConfig, config);
