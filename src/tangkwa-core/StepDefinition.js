import _ from 'lodash'
import t from 'tcomb'

export const init = t.struct({
  expression: t.String,
  createOptions: t.Function
})

export const isMatchingByText = (text) => {
  const matcher = _createStepDefinitionMatcherByText(text)
  return (stepDefinition) => {
    return matcher.testAgainstExpression(stepDefinition.expression)
  }
}

export const _createStepDefinitionMatcherByText = (text) => {
  const PLACEHOLDER_RE = /\\\{(\w+)\\\}/g
  function compile (expression) {
    const escapedExpression = _.escapeRegExp(expression)
    const variableNames = [ ]
    const regexp = new RegExp('^' + escapedExpression.replace(PLACEHOLDER_RE, (__, name) => {
      variableNames.push(name)
      return '(.*?)'
    }) + '$', 'i')
    return {
      test: (text) => regexp.test(text),
      getMatches: (text) => {
        const match = regexp.exec(text)
        if (!match) return null
        const out = { }
        let i = 0
        for (const name of variableNames) {
          i += 1
          out[name] = match[i]
        }
        return out
      }
    }
  }
  return {
    testAgainstExpression: (expression) => {
      const compiledExpression = compile(expression)
      return compiledExpression.test(text)
    },
    matchAgainstExpression: (expression) => {
      const compiledExpression = compile(expression)
      return compiledExpression.getMatches(text)
    }
  }
}
