import invariant from 'invariant'
import t from 'tcomb'

export function createStepDefinition (stepName, createOptions) {
  return {
    stepName,
    createOptions
  }
}

export function loadFeaturesFromContext (context) {
  return context.keys().map((key) => createFeatureFromGherkinDocument(key, context(key)))
}

const Location = t.struct({
  column: t.Number,
  line: t.Number
}, { name: 'Location' })

const Steps = t.list(t.struct({
  keyword: t.String,
  text: t.String,
  location: Location
}, { name: 'Step' }))

const Scenario = t.struct({
  name: t.String,
  steps: Steps,
  location: Location
}, { name: 'Scenario' })

const Background = t.struct({
  steps: Steps,
  location: Location
}, { name: 'Background' })

const Feature = t.struct({
  name: t.String,
  filename: t.String,
  description: t.maybe(t.String),
  background: t.maybe(Background),
  location: Location,
  scenarios: t.list(Scenario)
}, { name: 'Feature' })

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
