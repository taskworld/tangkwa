'use strict'

const HtmlPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/ide',
  output: {
    filename: 'ide.js',
    path: __dirname + '/build',
    publicPath: '/'
  },
  resolve: {
    alias: {
      'tangkwa$': require.resolve('./src/ide/tangkwa.js')
    }
  },
  module: {
    loaders: [
      { test: /\.js$/, include: __dirname + '/src', loader: 'babel' },
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
      { test: /\.feature/, loader: require.resolve('./src/ide/gherkin-loader') }
    ]
  },
  plugins: [
    new HtmlPlugin()
  ]
}
