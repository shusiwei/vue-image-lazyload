const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    app: ['./examples/app.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'examples')
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              postcss: [require('autoprefixer')()],
              cssModules: {
                camelCase: 'only',
                localIdentName: '[name]_[local]_[hash:base64:5]'
              }
            }
          }
        ]
      }, {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ],
        exclude: /node_modules/
      }, {
        test: /\.(css|styl)$/,
        use: [
          {
            loader: 'style-loader'
          }, {
            loader: 'css-loader'
          }, {
            loader: 'postcss-loader'
          }
        ],
        exclude: /node_modules/
      }, {
        test: /\.(png|jpg|gif|svg|ttf|woff)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]?[hash:8]'
            }
          }
        ]
      }
    ]
  },
  resolve: {
    modules: ['node_modules']
  },
  devServer: {
    inline: true,
    hot: true,
    open: true,
    port: 8080,
    historyApiFallback: true,
    noInfo: true,
    contentBase: path.join(__dirname, 'examples')
  },
  devtool: 'eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ],
  performance: {
    hints: false
  }
};
