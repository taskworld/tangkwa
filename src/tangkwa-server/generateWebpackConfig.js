'use strict'

const HtmlPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
const base = path.resolve(__dirname, '../..')

module.exports = function generateWebpackConfig ({ projectPath }) {
  return {
    entry: [
      'babel-polyfill',
      'tangkwa-ide',
      'webpack-hot-middleware/client'
    ],
    output: {
      filename: 'ide.js',
      path: path.join(base, 'build'),
      publicPath: '/'
    },
    resolve: {
      alias: {
        'tangkwa-ide': require.resolve('../tangkwa-ide'),
        'tangkwa-steps': require.resolve('../tangkwa-steps'),
        '__project__': projectPath
      }
    },
    module: {
      loaders: [
        { test: /\.js$/, include: path.join(base, 'src'), loader: 'babel' },
        { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
        { test: /\.feature/, loader: require.resolve('../tangkwa-ide/gherkin-loader') }
      ]
    },
    plugins: [
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new HtmlPlugin()
    ]
  }
}
