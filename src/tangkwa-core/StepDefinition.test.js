import * as StepDefinition from './StepDefinition'

import test from 'ava'

test('Matches exact text', t => {
  t.true(expressionMatchesText('I am here', 'I am here'))
})

test('Does not match different text', t => {
  t.false(expressionMatchesText('I am here', 'I am'))
  t.false(expressionMatchesText('I am', 'I am here'))
})

test('Matches text with different case', t => {
  t.true(expressionMatchesText('I am HERE', 'I am here'))
})

test('Matches text with placeholder', t => {
  t.true(expressionMatchesText('I search for {query}', 'I search for Google'))
})

test('Captures matches into options', t => {
  t.deepEqual(matches('I search for Google', 'I search for Google'), { })
  t.deepEqual(matches('A quick brown {jumper} jumps over the lazy {jumpee}', 'A quick brown fox jumps over the lazy dog'), {
    jumper: 'fox',
    jumpee: 'dog'
  })
  t.deepEqual(matches('I search for {query}', 'I search for Google'), {
    query: 'Google'
  })
})

function expressionMatchesText (stepDefinitionExpression, stepText) {
  const definition = StepDefinition.init({
    expression: stepDefinitionExpression,
    createOptions: () => ({ })
  })
  return StepDefinition.isMatchingByText(stepText)(definition)
}

function matches (stepDefinitionExpression, stepText) {
  const stepMatcher = StepDefinition._createStepDefinitionMatcherByText(stepText)
  return stepMatcher.matchAgainstExpression(stepDefinitionExpression)
}
