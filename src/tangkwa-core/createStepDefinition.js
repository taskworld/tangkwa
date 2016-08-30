import * as StepDefinition from './StepDefinition'

import invariant from 'invariant'

export function createStepDefinition (expression, createOptions) {
  invariant(
    typeof expression === 'string',
    'createStepDefinition: Required an expression as a string.'
  )
  invariant(
    typeof createOptions === 'function',
    'createStepDefinition: Step "%s" should provide a function to generate step options.',
    expression
  )
  return StepDefinition.init({
    expression,
    createOptions
  })
}

export default createStepDefinition
