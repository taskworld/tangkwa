import * as ScenarioReference from './ScenarioReference'

import t from 'tcomb'
import test from 'ava'

import createStepDefinition from './createStepDefinition'
import generateExecutionPlan from './generateExecutionPlan'

test('it should generate if no feature with that filename', t => {
  const result = plan('undefined.feature', 'another scenario')
  t.is(result, null)
})

test('it should generate if no feature with that filename', t => {
  const result = plan('Test.feature', 'other scenario')
  t.is(result, null)
})

test('it generates an execution plan from the project and current item', t => {
  const result = plan('Test.feature', 'another scenario')
  t.truthy(result)
})

test('it separates the tests into sections (background and scenario)', t => {
  const result = plan('Test.feature', 'another scenario')
  t.is(result.sections.length, 2)
  t.is(result.sections[0].name, 'Background')
  t.is(result.sections[1].name, 'Scenario: another scenario')
})

test('each scenario contains the steps', t => {
  const result = plan('Test.feature', 'a scenario')
  t.is(result.sections[0].steps.length, 2)
  t.is(result.sections[1].steps.length, 3)
})

function plan (featureFilename, scenarioName) {
  const project = getTestProject()
  const ref = ScenarioReference.init({ featureFilename, scenarioName })
  return generateExecutionPlan(project, ref)
}

function getTestProject () {
  const features = [
    {
      name: 'a feature',
      filename: 'Test.feature',
      background: {
        steps: [
          { keyword: 'Given', text: 'a background step' },
          { keyword: 'And', text: 'another background step' }
        ]
      },
      scenarios: [
        {
          name: 'a scenario',
          steps: [
            { keyword: 'When', text: 'a scenario step' },
            { keyword: 'Then', text: 'it works' },
            { keyword: 'And', text: 'it really works' }
          ]
        },
        {
          name: 'another scenario',
          steps: [
            { keyword: 'When', text: 'it is run' },
            { keyword: 'Then', text: 'it ran' }
          ]
        }
      ]
    },
    {
      name: 'log in',
      filename: 'Login.feature',
      scenarios: [
        {
          name: 'Success',
          steps: [
            { keyword: 'Given', text: 'a user' },
            { keyword: 'When', text: 'I log in with correct credentials' },
            { keyword: 'Then', text: 'I should see my name' }
          ]
        },
        {
          name: 'User expired',
          steps: [
            { keyword: 'Given', text: 'an expired user' },
            { keyword: 'When', text: 'I log in with correct credentials' },
            { keyword: 'Then', text: 'I should be informed that it expired' }
          ]
        }
      ]
    }
  ]
  const stepDefinitions = [
    createStepDefinition('it is run', () => ({
      run () {
      }
    })),
    createStepDefinition('another background step', () => ({
      run () {
      }
    })),
    createStepDefinition('a user', () => ({
      nextContextTypes: {
        user: t.Any
      },
      run () { }
    })),
    createStepDefinition('i log in with correct credentials', () => ({
      contextTypes: {
        user: t.Any
      },
      run () { }
    })),
    createStepDefinition('i should see my name', () => ({
      contextTypes: {
        user: t.Any,
        browser: t.Any
      },
      run () { }
    }))
  ]
  return { features, stepDefinitions }
}
