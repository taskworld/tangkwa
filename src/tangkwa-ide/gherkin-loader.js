'use strict'
const Gherkin = require('gherkin')

module.exports = function (source) {
  this.cacheable()
  return 'module.exports = ' + JSON.stringify(
    new Gherkin.Parser(new Gherkin.AstBuilder()).parse(
      new Gherkin.TokenScanner(source.toString()),
      new Gherkin.TokenMatcher()
    )
  )
}
