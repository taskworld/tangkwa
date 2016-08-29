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
  t.is(result.sections[0].title, 'Background')
  t.is(result.sections[1].title, 'Scenario: another scenario')
})

test('each scenario contains the steps', t => {
  const result = plan('Test.feature', 'a scenario')
  t.is(result.sections[0].steps.length, 2)
  t.is(result.sections[0].steps[0].info.keyword, 'Given')
  t.is(result.sections[0].steps[0].info.text, 'a background step')
  t.is(result.sections[1].steps.length, 3)
})

test('each step contains an ID', t => {
  const result = plan('Test.feature', 'a scenario')
  t.is(result.sections[0].steps[0].id, 'Test.feature → a scenario → 1. Given a background step')
})

test('each valid step should have a valid flag', t => {
  const result = plan('Test.feature', 'a scenario')
  t.true(result.sections[0].steps[0].valid)
  t.true(result.sections[0].steps[1].valid)
})

test('a step is invalid without matching definition', t => {
  const result = plan('Not Exist.feature', 'a scenario')
  t.false(result.sections[0].steps[0].valid)
  t.is(result.sections[0].steps[0].reason, 'No matching step definition found.')
})

test('a step is invalid when the match is ambiguous', t => {
  const result = plan('Ambiguous.feature', 'a scenario')
  t.false(result.sections[0].steps[0].valid)
  t.is(result.sections[0].steps[0].reason, 'Found 2 matching step definitions, which results in an ambiguous step.')
})

test('a step is invalid when required context is not given', t => {
  const result = plan('Login.feature', 'Success')
  t.true(result.sections[0].steps[0].valid)
  t.true(result.sections[0].steps[1].valid)
  t.false(result.sections[0].steps[2].valid)
  t.is(result.sections[0].steps[2].reason, 'Missing context: browser')
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
      name: 'Test not existing step',
      filename: 'Not Exist.feature',
      scenarios: [
        {
          name: 'a scenario',
          steps: [
            { keyword: 'Given', text: 'nothing' }
          ]
        }
      ]
    },
    {
      name: 'Ambiguous steps',
      filename: 'Ambiguous.feature',
      scenarios: [
        {
          name: 'a scenario',
          steps: [
            { keyword: 'Given', text: 'everything' }
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
    createStepDefinition('a background step', () => ({
      run () {
      }
    })),
    createStepDefinition('another background step', () => ({
      run () {
      }
    })),
    createStepDefinition('everything', () => ({
      run () {
      }
    })),
    createStepDefinition('everything', () => ({
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
