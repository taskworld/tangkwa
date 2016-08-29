import * as ScenarioReference from './ScenarioReference'

export function generateExecutionPlan (project, scenarioReference) {
  const found = findMatchingFeatureAndScenario()
  if (!found) return null

  const sections = [ ]
  const matchingFeature = found.feature
  const matchingScenario = found.scenario
  const stepInitializer = createStepInitializer()

  if (matchingFeature.background) {
    sections.push({
      name: 'Background',
      steps: stepInitializer.initializeSteps('Background', matchingFeature.background.steps)
    })
  }

  const title = 'Scenario: ' + matchingScenario.name
  sections.push({
    name: title,
    steps: stepInitializer.initializeSteps(title, matchingScenario.steps)
  })

  return { sections }

  function findAllMatchingStepDefinitions (stepInfo) {
    return project.stepDefinitions.filter((definition) => (
      definition.stepName === stepInfo.text
    ))
  }

  function createStepInitializer () {
    function initializeStep (title, number, stepInfo) {
      const invalid = (reason) => ({ info: stepInfo, valid: false, reason })
      const matching = findAllMatchingStepDefinitions(stepInfo)
      if (matching.length === 0) return invalid('')
      // if (matching.length > 1) return invalid('')
      return { info: stepInfo, valid: true }
    }
    function initializeSteps (title, steps) {
      const out = [ ]
      let number = 0
      for (const step of steps) {
        number += 1
        out.push(initializeStep(title, number, step))
      }
      return out
    }
    return {
      initializeSteps
    }
  }

  function findMatchingFeatureAndScenario () {
    const matches = ScenarioReference.matcher(scenarioReference)
    for (const feature of project.features) {
      for (const scenario of feature.scenarios) {
        if (matches(ScenarioReference.initWithFeatureAndScenario(feature, scenario))) {
          return { feature, scenario }
        }
      }
    }
    return null
  }
}

export default generateExecutionPlan
