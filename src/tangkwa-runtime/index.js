import invariant from 'invariant'

import Feature, { Background, Scenario } from '../tangkwa-core/Feature'

export { createStepDefinition } from '../tangkwa-core/createStepDefinition'

export function loadFeaturesFromContext (context) {
  return context.keys().map((key) => createFeatureFromGherkinDocument(key, context(key)))
}

function createFeatureFromGherkinDocument (filename, document) {
  invariant(document.type === 'GherkinDocument', 'GherkinDocument expected')
  invariant(document.feature, 'GherkinDocument should have a feature')
  const feature = document.feature
  return Feature({
    name: feature.name,
    filename: filename,
    description: feature.description,
    location: feature.location,
    background: findBackground(),
    scenarios: findScenarios()
  })

  function findBackground () {
    const backgrounds = feature.children.filter((child) => child.type === 'Background')
    invariant(backgrounds.length <= 1, 'A feature file should not have more than 1 background')
    return backgrounds[0] ? Background(backgrounds[0]) : null
  }

  function findScenarios () {
    const scenarios = feature.children.filter((child) => child.type === 'Scenario')
    return scenarios.map((child) => Scenario(child))
  }
}
