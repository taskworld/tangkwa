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
      steps: stepInitializer.initializeSteps(matchingFeature.background.steps)
    })
  }

  sections.push({
    name: 'Scenario: ' + matchingScenario.name,
    steps: stepInitializer.initializeSteps(matchingScenario.steps)
  })

  return { sections }

  function createStepInitializer () {
    function initializeStep (step) {
      return { info: step, valid: true }
    }
    function initializeSteps (steps) {
      const out = [ ]
      for (const step of steps) out.push(initializeStep(step))
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
