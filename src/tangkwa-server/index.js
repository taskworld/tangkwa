'use strict'

const express = require('express')
const app = express()
const webpack = require('webpack')
const path = require('path')
const projectPath = path.resolve(__dirname, '../../example')
const webpackConfig = require('./generateWebpackConfig')({ projectPath })
const compiler = webpack(webpackConfig)
const projectServer = require(path.resolve(projectPath, 'tangkwa.server.js'))
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

projectServer(app)

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath,
  stats: { colors: true }
}))

app.use(require('webpack-hot-middleware')(compiler))

app.listen(55555, '127.0.0.1', function () {
  const { address, port } = this.address()
  console.log('Now listening at http://' + address + ':' + port)
})
