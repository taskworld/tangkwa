import * as ScenarioReference from './ScenarioReference'

import test from 'ava'

import createStepDefinition from './createStepDefinition'
import generateExecutionPlan from './generateExecutionPlan'

test('should not be resolved if not matched', t => {
  const project = testProject()
  const ref = ScenarioReference.init({
    featureFilename: 'Wow',
    scenarioName: 'another scenario'
  })
  const result = generateExecutionPlan(project, ref)
  t.is(result, null)
})

test('generates an execution plan from the project and current item', t => {
  const project = testProject()
  const ref = ScenarioReference.init({
    featureFilename: 'Test.feature',
    scenarioName: 'another scenario'
  })
  const result = generateExecutionPlan(project, ref)
  t.is(result.sections.length, 2)
  t.is(result.sections[0].name, 'Background')
  t.is(result.sections[1].name, 'Scenario: another scenario')
})

function testProject () {
  const features = [
    {
      name: 'a feature',
      filename: 'Test.feature',
      background: {
        steps: [
          { keyword: 'Given', text: 'a background step' }
        ]
      },
      scenarios: [
        {
          name: 'a scenario',
          steps: [
            { keyword: 'When', text: 'a scenario step' },
            { keyword: 'Then', text: 'it works' }
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
    }
  ]
  const stepDefinitions = [
    createStepDefinition('it is run', () => ({
      run () {
      }
    }))
  ]
  return { features, stepDefinitions }
}
