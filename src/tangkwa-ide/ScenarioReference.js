import t from 'tcomb'
import { parse, stringify } from 'querystring'

export const init = t.struct({
  featureFilename: t.String,
  scenarioName: t.String
})

export const matcher = (test) => (matchee) => (
  test.featureFilename === matchee.featureFilename &&
  test.scenarioName === matchee.scenarioName
)

export const parseFromLocation = (location) => {
  const parsed = parse(String(location.search).replace(/^\?/, ''))
  if (typeof parsed.feature !== 'string') return null
  if (typeof parsed.scenario !== 'string') return null
  return init({
    featureFilename: parsed.feature,
    scenarioName: parsed.scenario
  })
}

export const getLocationTransition = (ref) => {
  if (!ref) return { search: '' }
  return {
    search: '?' + stringify({ feature: ref.featureFilename, scenario: ref.scenarioName })
  }
}
