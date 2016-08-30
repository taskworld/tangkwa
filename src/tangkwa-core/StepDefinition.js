import _ from 'lodash'
import t from 'tcomb'

export const init = t.struct({
  expression: t.String,
  createOptions: t.Function
})

export const isMatchingByText = (text) => {
  const PLACEHOLDER_RE = /\\\{\w+\\\}/g
  const regexp = new RegExp('^' + _.escapeRegExp(text).replace(PLACEHOLDER_RE, '(.*?)') + '$', 'i')
  return (stepDefintion) => regexp.test(stepDefintion.expression)
}
