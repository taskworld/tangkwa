import * as ScenarioReference from './ScenarioReference'
import * as StepDefinition from './StepDefinition'

export function generateExecutionPlan (project, scenarioReference) {
  const found = findMatchingFeatureAndScenario()
  if (!found) return null

  const sections = [ ]
  const matchingFeature = found.feature
  const matchingScenario = found.scenario
  const stepInitializer = createStepInitializer()

  if (matchingFeature.background) {
    sections.push({
      title: 'Background',
      steps: stepInitializer.initializeSteps('Background', matchingFeature.background.steps)
    })
  }

  const title = 'Scenario: ' + matchingScenario.name
  sections.push({
    title,
    steps: stepInitializer.initializeSteps(title, matchingScenario.steps)
  })

  return { sections }

  function findAllMatchingStepDefinitions (stepInfo) {
    return project.stepDefinitions.filter(StepDefinition.isMatchingByText(stepInfo.text))
  }

  function createStepInitializer () {
    const knownContextTypes = new Set()
    function initializeStep (title, number, stepInfo) {
      const id = [
        matchingFeature.filename,
        matchingScenario.name,
        number + '. ' + stepInfo.keyword + ' ' + stepInfo.text
      ].join(' → ')
      const invalid = (reason) => ({ id, info: stepInfo, valid: false, reason })
      const matching = findAllMatchingStepDefinitions(stepInfo)
      if (matching.length === 0) {
        return invalid('No matching step definition found.')
      }
      if (matching.length > 1) {
        return invalid('Found ' + matching.length + ' matching step definitions, which results in an ambiguous step.')
      }
      const stepDefinition = matching[0]
      const options = stepDefinition.createOptions()
      if (options.contextTypes) {
        const missing = [ ]
        for (const key of Object.keys(options.contextTypes)) {
          if (!knownContextTypes.has(key)) {
            missing.push(key)
          }
        }
        if (missing.length) {
          return invalid('Missing context: ' + missing.join(', '))
        }
      }
      if (options.nextContextTypes) {
        for (const key of Object.keys(options.nextContextTypes)) {
          knownContextTypes.add(key)
        }
      }
      return { id, info: stepInfo, options, valid: true }
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
